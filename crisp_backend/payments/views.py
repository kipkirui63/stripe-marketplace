import stripe
from django.conf import settings
from django.http import JsonResponse, HttpResponse
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.mail import EmailMultiAlternatives
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_str
from django.urls import reverse
from django.utils import timezone
from dateutil.relativedelta import relativedelta

from .models import UserProfile, Tool, Subscription, Payment
from .serializers import (
    UserSerializer, UserProfileSerializer, ToolSerializer,
    SubscriptionSerializer, PaymentSerializer, UserRegistrationSerializer,
    LoginSerializer, CheckoutSerializer
)
from .utils import generate_activation_link

# Set Stripe API key
stripe.api_key = settings.STRIPE_SECRET_KEY


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    """Enhanced user registration with email verification"""
    data = request.data
    required_fields = ["first_name", "last_name", "email", "phone", "password", "repeat_password"]

    for field in required_fields:
        if not data.get(field):
            return Response({"error": f"{field} is required"}, status=400)

    if data["password"] != data["repeat_password"]:
        return Response({"error": "Passwords do not match"}, status=400)

    # Check if user already exists
    if User.objects.filter(email=data["email"]).exists():
        return Response({"error": "User with this email already exists"}, status=400)

    try:
        user = User.objects.create(
            username=data["email"],
            email=data["email"],
            password=make_password(data["password"]),
            first_name=data["first_name"],
            last_name=data["last_name"],
            is_active=False  # Will be activated via email
        )

        # Create user profile
        UserProfile.objects.create(
            user=user,
            phone=data["phone"],
            is_verified=False
        )

        # Generate activation link
        activation_url = generate_activation_link(user, request)

        # Send activation email
        html_body = f"""
        <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Welcome to CRISPAI</title>
    <style>
        body {{
            margin: 0;
            padding: 20px;
            background: #f8fafc;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
        }}
        .container {{
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            overflow: hidden;
        }}
        .banner {{
            background: #f1f5f9;
            padding: 30px 20px;
            text-align: center;
            border-bottom: 1px solid #e2e8f0;
        }}
        .banner img {{
            max-width: 180px;
            height: auto;
        }}
        .content {{
            padding: 40px 30px;
            text-align: center;
        }}
        h1 {{
            color: #002B5B;
            font-size: 26px;
            margin-top: 0;
            margin-bottom: 20px;
            font-weight: 600;
        }}
        p {{
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 24px;
            color: #4a5568;
        }}
        .button-container {{
            margin: 32px 0;
        }}
        .activate-button {{
            background-color: #002B5B;
            color: white;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            display: inline-block;
            font-size: 16px;
        }}
        .footer {{
            text-align: center;
            padding: 24px;
            font-size: 13px;
            color: #718096;
            border-top: 1px solid #edf2f7;
            background: #f8fafc;
        }}
        .footer a {{
            color: #002B5B;
            text-decoration: none;
            font-weight: 500;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="banner">
            <img src="https://crispai.crispvision.org/media/crisp-logo.png" alt="CRISP AI Logo">
        </div>
        <div class="content">
            <h1>Hi {data['first_name']}, Welcome to CrispAI</h1>
            <p>We're excited to have you on board!</p>
            <p>Click the button below to activate your account:</p>
            <div class="button-container">
                <a href="{activation_url}" class="activate-button">Activate Account</a>
            </div>
            <p>If you didn't request this, please ignore this email.</p>
        </div>
        <div class="footer">
            © 2024 CrispAI. All rights reserved.<br>
            <a href="https://www.crispai.ca/">Visit our website</a> | <a href="mailto:support@crispai.ca">Contact Support</a>
        </div>
    </div>
</body>
</html>
        """

        subject = "🎉 Welcome to CRISP AI – Let's Build the Future Together!"
        text_body = f"Hi {data['first_name']},\n\nClick the link below to activate your account:\n\n{activation_url}"
        from_email = settings.DEFAULT_FROM_EMAIL
        
        msg = EmailMultiAlternatives(subject, text_body, from_email, [user.email])
        msg.attach_alternative(html_body, "text/html")
        msg.send()

        return Response({"detail": "Registration successful. Please check your email to activate your account."})
    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(["GET"])
@permission_classes([AllowAny])
def activate(request, uidb64, token):
    """Activate user account via email link"""
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return HttpResponse("Invalid activation link", status=400)

    if default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        
        # Update user profile
        profile, created = UserProfile.objects.get_or_create(user=user)
        profile.is_verified = True
        profile.save()
        
        return HttpResponse("""
            <html>
              <head>
                <title>Account Activated</title>
                <style>
                  body { font-family: 'Segoe UI', sans-serif; text-align: center; background: #f5f7fb; padding: 60px; }
                  .box { background: white; display: inline-block; padding: 40px 30px; border-radius: 8px; box-shadow: 0 0 15px rgba(0,0,0,0.1); }
                  h1 { color: #2ecc71; }
                  a { color: #002B5B; text-decoration: none; font-weight: bold; }
                </style>
              </head>
              <body>
                <div class="box">
                  <h1>Your account has been successfully activated!</h1>
                  <p>You can now return to <a href="https://marketplace.crispai.ca">CRISP AI Marketplace</a> and log in.</p>
                </div>
              </body>
            </html>
        """)
    else:
        return HttpResponse("Invalid or expired activation link.", status=400)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """Enhanced login with JWT tokens"""
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response({"detail": "Email and password are required"}, status=400)

    user = authenticate(request, username=email, password=password)

    if user is not None:
        if not user.is_active:
            return Response({"detail": "Please verify your email first"}, status=401)
        
        profile, created = UserProfile.objects.get_or_create(user=user)
        
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": profile.role,
                "is_verified": profile.is_verified,
            }
        })
    else:
        return Response({"detail": "Invalid credentials"}, status=401)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """User logout endpoint"""
    try:
        refresh_token = request.data.get("refresh")
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        return Response({'message': 'Logout successful'})
    except Exception:
        return Response({'message': 'Logout successful'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """Get current user profile"""
    try:
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        return Response({
            "id": request.user.id,
            "email": request.user.email,
            "first_name": request.user.first_name,
            "last_name": request.user.last_name,
            "phone": profile.phone,
            "role": profile.role,
            "is_verified": profile.is_verified,
        })
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(["GET"])
@permission_classes([AllowAny])
def list_tools(request):
    """Get list of available tools"""
    tools = Tool.objects.filter(is_active=True)
    serializer = ToolSerializer(tools, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def check_subscription(request):
    """Check user's subscription status"""
    user = request.user
    tool_name = request.GET.get('tool_name')
    
    if tool_name:
        # Check specific tool subscription
        try:
            tool = Tool.objects.get(name__iexact=tool_name)
            subscription = Subscription.objects.filter(
                user=user,
                tool=tool,
                status="active"
            ).first()
            
            if subscription and subscription.is_active():
                return Response({
                    "has_access": True,
                    "subscription": SubscriptionSerializer(subscription).data
                })
            else:
                return Response({"has_access": False})
        except Tool.DoesNotExist:
            return Response({"error": "Tool not found"}, status=404)
    
    # Get all active subscriptions
    active_subs = Subscription.objects.filter(user=user, status="active")
    tools = [sub.tool.id for sub in active_subs]

    return Response({
        "has_access": len(tools) > 0,
        "tools": tools
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_subscriptions(request):
    """Get user's subscriptions"""
    user = request.user
    subscriptions = Subscription.objects.filter(user=user)
    
    data = [{
        "id": sub.id,
        "tool": sub.tool.name,
        "tool_id": sub.tool.id,
        "status": sub.status,
        "plan": sub.plan,
        "created_at": sub.created_at,
        "updated_at": sub.updated_at,
        "end_date": sub.end_date
    } for sub in subscriptions]
    
    return Response(data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_checkout(request):
    """Create Stripe checkout session"""
    user = request.user
    tool_input = request.data.get("tool_id") or request.data.get("tool_name")
    plan = request.data.get("plan", "1-month")
    is_yearly = request.data.get("is_yearly", False)

    if not tool_input:
        return Response({"detail": "Missing tool_id or tool_name"}, status=400)

    try:
        # Find tool by ID or name
        if str(tool_input).isdigit():
            tool = Tool.objects.get(id=int(tool_input))
        else:
            tool = Tool.objects.get(name__iexact=tool_input)

        # Check if already subscribed
        if Subscription.objects.filter(user=user, tool=tool, status="active").exists():
            return Response({"detail": "Already subscribed"}, status=400)

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

        # Create Stripe checkout session
        session = stripe.checkout.Session.create(
            customer_email=user.email,
            payment_method_types=["card"],
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
            success_url="https://marketplace.crispai.ca/?status=success&session_id={CHECKOUT_SESSION_ID}",
            cancel_url="https://marketplace.crispai.ca/?status=cancel",
            metadata={
                "tool_id": str(tool.id),
                "user_id": str(user.id),
                "plan": plan,
                "is_yearly": str(is_yearly),
            }
        )

        # Create subscription record (inactive until payment)
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
            user=user,
            tool=tool,
            plan=plan,
            status="inactive",
            email=user.email,
            end_date=end_date
        )

        # Create payment record
        Payment.objects.create(
            user=user,
            subscription=subscription,
            amount=total_price,
            stripe_payment_intent_id=session.id
        )

        return Response({"checkout_url": session.url})

    except Tool.DoesNotExist:
        return Response({"detail": "Tool not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def cancel_subscription(request):
    """Cancel user subscription"""
    user = request.user
    tool_id = request.data.get("tool_id")
    
    if not tool_id:
        return Response({"detail": "tool_id is required"}, status=400)
    
    try:
        subscription = Subscription.objects.get(
            user=user,
            tool_id=tool_id,
            status="active"
        )
        
        subscription.status = "canceled"
        subscription.save()
        
        return Response({"detail": "Subscription canceled successfully"})
        
    except Subscription.DoesNotExist:
        return Response({"detail": "Active subscription not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def agent_gateway(request):
    """Agent gateway redirect"""
    user = request.user
    profile, created = UserProfile.objects.get_or_create(user=user)
    
    if profile.role == "agent":
        return redirect("https://crispai.crispvision.org/agent-dashboard")
    return Response({"detail": "Unauthorized"}, status=403)


@csrf_exempt
def stripe_webhook(request):
    """Handle Stripe webhook events"""
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except Exception:
        return HttpResponse(status=400)

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        email = session.get("customer_email")
        tool_id = session.get("metadata", {}).get("tool_id")
        user_id = session.get("metadata", {}).get("user_id")
        plan = session.get("metadata", {}).get("plan")

        try:
            user = User.objects.get(id=user_id)
            tool = Tool.objects.get(id=tool_id)
            
            # Find and activate the subscription
            subscription = Subscription.objects.filter(
                user=user,
                tool=tool,
                status="inactive"
            ).first()
            
            if subscription:
                subscription.status = "active"
                subscription.stripe_subscription_id = session.id
                subscription.save()
                
                # Update payment record
                payment = Payment.objects.filter(
                    user=user,
                    subscription=subscription,
                    stripe_payment_intent_id=session.id
                ).first()
                
                if payment:
                    payment.status = "succeeded"
                    payment.save()
                    
        except Exception:
            pass

    return HttpResponse(status=200)