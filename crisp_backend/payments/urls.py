from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    path('auth/logout/', views.logout, name='logout'),
    path('auth/user/', views.user_profile, name='user_profile'),
    
    # Tools
    path('tools/', views.tools_list, name='tools_list'),
    
    # Subscriptions
    path('subscriptions/', views.user_subscriptions, name='user_subscriptions'),
    path('subscriptions/check/', views.check_subscription_status, name='check_subscription_status'),
    
    # Payments
    path('checkout/', views.create_checkout_session, name='create_checkout_session'),
    path('webhook/stripe/', views.stripe_webhook, name='stripe_webhook'),
]