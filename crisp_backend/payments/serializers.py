from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Tool, Subscription, Payment


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['user', 'phone', 'is_verified', 'created_at', 'updated_at']


class ToolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tool
        fields = ['id', 'name', 'description', 'price', 'is_active', 'created_at', 'updated_at']


class SubscriptionSerializer(serializers.ModelSerializer):
    tool = ToolSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Subscription
        fields = ['id', 'user', 'tool', 'plan', 'status', 'start_date', 'end_date', 'created_at', 'updated_at']


class PaymentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    subscription = SubscriptionSerializer(read_only=True)
    
    class Meta:
        model = Payment
        fields = ['id', 'user', 'subscription', 'amount', 'currency', 'status', 'created_at', 'updated_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    phone = serializers.CharField(max_length=20, required=False)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'confirm_password', 'phone']
    
    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords don't match")
        return data
    
    def create(self, validated_data):
        phone = validated_data.pop('phone', '')
        validated_data.pop('confirm_password')
        
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user, phone=phone)
        
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()


class CheckoutSerializer(serializers.Serializer):
    tool_name = serializers.CharField()
    plan = serializers.CharField()
    is_yearly = serializers.BooleanField(default=False)