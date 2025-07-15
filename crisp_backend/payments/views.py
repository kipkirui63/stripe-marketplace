from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.utils import timezone
from dateutil.relativedelta import relativedelta
import stripe
from django.conf import settings
from .models import UserProfile, Tool, Subscription, Payment
from .serializers import (
    UserSerializer, UserProfileSerializer, ToolSerializer,
    SubscriptionSerializer, PaymentSerializer, UserRegistrationSerializer,
    LoginSerializer, CheckoutSerializer
)

# Set Stripe API key
stripe.api_key = settings.STRIPE_SECRET_KEY


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """User registration endpoint"""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key,
            'message': 'User created successfully'
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """User login endpoint"""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
        user = authenticate(username=username, password=password)
        if user:
            # Check if user is verified
            profile = UserProfile.objects.get(user=user)
            if not profile.is_verified:
                return Response({
                    'detail': 'Please verify your email first'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'user': UserSerializer(user).data,
                'token': token.key,
                'message': 'Login successful'
            })
        else:
            return Response({
                'detail': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """User logout endpoint"""
    try:
        token = Token.objects.get(user=request.user)
        token.delete()
        return Response({'message': 'Logout successful'})
    except Token.DoesNotExist:
        return Response({'message': 'No active session'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """Get current user profile"""
    try:
        profile = UserProfile.objects.get(user=request.user)
        return Response(UserProfileSerializer(profile).data)
    except UserProfile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([AllowAny])
def tools_list(request):
    """Get list of available tools"""
    tools = Tool.objects.filter(is_active=True)
    return Response(ToolSerializer(tools, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_subscriptions(request):
    """Get user's active subscriptions"""
    subscriptions = Subscription.objects.filter(user=request.user, status='active')
    return Response(SubscriptionSerializer(subscriptions, many=True).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_checkout_session(request):
    """Create Stripe checkout session"""
    serializer = CheckoutSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    tool_name = serializer.validated_data['tool_name']
    plan = serializer.validated_data['plan']
    is_yearly = serializer.validated_data['is_yearly']
    
    try:
        tool = Tool.objects.get(name=tool_name)
    except Tool.DoesNotExist:
        return Response({'error': 'Tool not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Calculate price based on plan and billing cycle
    price_multiplier = 1
    if plan == '3-month':
        price_multiplier = 3
    elif plan == '6-month':
        price_multiplier = 6
    elif plan == '12-month':
        price_multiplier = 12
    
    base_price = float(tool.price)
    if is_yearly:
        # Apply discount for yearly billing
        discount_rates = {
            '1-month': 0,
            '3-month': 0.1,
            '6-month': 0.15,
            '12-month': 0.25
        }
        discount = discount_rates.get(plan, 0)
        base_price = base_price * (1 - discount)
    
    total_price = base_price * price_multiplier
    
    try:
        # Create Stripe checkout session
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': f'{tool.name} - {plan}',
                    },
                    'unit_amount': int(total_price * 100),  # Convert to cents
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=request.build_absolute_uri('/success/'),
            cancel_url=request.build_absolute_uri('/cancel/'),
            metadata={
                'user_id': request.user.id,
                'tool_id': tool.id,
                'plan': plan,
                'is_yearly': str(is_yearly),
            }
        )
        
        # Create subscription record
        end_date = timezone.now()
        if plan == '1-month':
            end_date += relativedelta(months=1)
        elif plan == '3-month':
            end_date += relativedelta(months=3)
        elif plan == '6-month':
            end_date += relativedelta(months=6)
        elif plan == '12-month':
            end_date += relativedelta(months=12)
        
        subscription = Subscription.objects.create(
            user=request.user,
            tool=tool,
            plan=plan,
            status='inactive',  # Will be activated after payment
            end_date=end_date
        )
        
        # Create payment record
        Payment.objects.create(
            user=request.user,
            subscription=subscription,
            amount=total_price,
            stripe_payment_intent_id=checkout_session.id
        )
        
        return Response({
            'checkout_url': checkout_session.url,
            'session_id': checkout_session.id
        })
        
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def stripe_webhook(request):
    """Handle Stripe webhook events"""
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError:
        return Response({'error': 'Invalid payload'}, status=status.HTTP_400_BAD_REQUEST)
    except stripe.error.SignatureVerificationError:
        return Response({'error': 'Invalid signature'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Handle the event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        
        # Get metadata
        user_id = session['metadata']['user_id']
        tool_id = session['metadata']['tool_id']
        plan = session['metadata']['plan']
        
        # Update subscription and payment status
        try:
            user = User.objects.get(id=user_id)
            tool = Tool.objects.get(id=tool_id)
            
            subscription = Subscription.objects.get(
                user=user,
                tool=tool,
                plan=plan,
                status='inactive'
            )
            subscription.status = 'active'
            subscription.stripe_subscription_id = session['id']
            subscription.save()
            
            payment = Payment.objects.get(
                user=user,
                subscription=subscription,
                stripe_payment_intent_id=session['id']
            )
            payment.status = 'succeeded'
            payment.save()
            
        except (User.DoesNotExist, Tool.DoesNotExist, Subscription.DoesNotExist, Payment.DoesNotExist):
            pass
    
    return Response({'status': 'success'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_subscription_status(request):
    """Check user's subscription status"""
    tool_name = request.GET.get('tool_name')
    if not tool_name:
        return Response({'error': 'tool_name parameter required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        tool = Tool.objects.get(name=tool_name)
        subscription = Subscription.objects.filter(
            user=request.user,
            tool=tool,
            status='active'
        ).first()
        
        if subscription and subscription.is_active():
            return Response({
                'has_access': True,
                'subscription': SubscriptionSerializer(subscription).data
            })
        else:
            return Response({'has_access': False})
            
    except Tool.DoesNotExist:
        return Response({'error': 'Tool not found'}, status=status.HTTP_404_NOT_FOUND)