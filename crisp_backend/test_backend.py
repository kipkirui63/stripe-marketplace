#!/usr/bin/env python
"""
Test script to verify Django backend functionality
"""
import os
import sys
import django
from django.conf import settings

# Add the crisp_backend directory to Python path
sys.path.insert(0, '/home/runner/workspace/crisp_backend')

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'crisp_backend.settings')
django.setup()

from django.contrib.auth.models import User
from payments.models import UserProfile, Tool, Subscription

def test_database_connection():
    """Test database connection"""
    try:
        user_count = User.objects.count()
        print(f"✓ Database connection successful. Users: {user_count}")
        return True
    except Exception as e:
        print(f"✗ Database connection failed: {e}")
        return False

def test_tools():
    """Test tools data"""
    try:
        tools = Tool.objects.all()
        print(f"✓ Tools loaded: {tools.count()}")
        for tool in tools:
            print(f"  - {tool.name}: ${tool.price}")
        return True
    except Exception as e:
        print(f"✗ Tools test failed: {e}")
        return False

def test_user_profiles():
    """Test user profiles"""
    try:
        profiles = UserProfile.objects.all()
        print(f"✓ User profiles: {profiles.count()}")
        return True
    except Exception as e:
        print(f"✗ User profiles test failed: {e}")
        return False

def main():
    print("Testing Django Backend...")
    print("=" * 50)
    
    tests = [
        test_database_connection,
        test_tools,
        test_user_profiles,
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
        print()
    
    print("=" * 50)
    print(f"Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("✓ All tests passed! Backend is ready.")
    else:
        print("✗ Some tests failed. Check the output above.")

if __name__ == '__main__':
    main()