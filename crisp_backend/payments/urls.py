from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    path('auth/logout/', views.logout, name='logout'),
    path('auth/user/', views.user_profile, name='user_profile'),
    path('auth/activate/<str:uidb64>/<str:token>/', views.activate, name='activate'),
    
    # Tools
    path('tools/', views.list_tools, name='list_tools'),
    
    # Subscriptions
    path('subscriptions/', views.my_subscriptions, name='my_subscriptions'),
    path('subscriptions/check/', views.check_subscription, name='check_subscription'),
    path('subscriptions/cancel/', views.cancel_subscription, name='cancel_subscription'),
    
    # Payments
    path('checkout/', views.create_checkout, name='create_checkout'),
    path('webhook/stripe/', views.stripe_webhook, name='stripe_webhook'),
    
    # Agent
    path('agent/gateway/', views.agent_gateway, name='agent_gateway'),
]