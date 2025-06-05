
from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from db import get_db
from models import User, Subscription, Tool
from utils import hash_password, create_token, verify_password, verify_token
from flask_mail import Message
from mail_config import mail

auth_bp = Blueprint('auth', __name__)

@auth_bp.route("/auth/register", methods=["POST"])
def register():
    data = request.get_json()
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    email = data.get("email")
    phone = data.get("phone")
    password = data.get("password")
    repeat_password = data.get("repeat_password")

    if not all([first_name, last_name, email, password, repeat_password]):
        return jsonify({"detail": "All required fields must be filled"}), 400

    if password != repeat_password:
        return jsonify({"detail": "Passwords do not match"}), 400

    with next(get_db()) as db:
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            return jsonify({"detail": "Email already registered"}), 400

        user = User(
            first_name=first_name,
            last_name=last_name,
            email=email,
            phone=phone,
            password=hash_password(password),
            role="user"
        )
        db.add(user)
        db.commit()

        # Send welcome email
        msg = Message("Welcome to CRISP AI", recipients=[email])
        msg.body = f"Hi {first_name},\n\nWelcome to CRISP AI! Your account has been successfully created."
        mail.send(msg)

        return jsonify({"message": "User registered successfully", "token": create_token(user.id)})

@auth_bp.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    with next(get_db()) as db:
        user = db.query(User).filter(User.email == email).first()
        if not user or not verify_password(password, user.password):
            return jsonify({"detail": "Invalid credentials"}), 401

        return jsonify({"token": create_token(user.id)})


@auth_bp.route("/auth/check-subscription", methods=["GET"])
def check_subscription():
    token = request.args.get("token")
    if not token:
        return jsonify({"purchased_apps": [], "detail": "Missing token"}), 400

    try:
        user_id = verify_token(token)
    except Exception:
        return jsonify({"purchased_apps": [], "detail": "Invalid token"}), 403

    with next(get_db()) as db:
        # Get all active subscriptions for the user with tool information
        subscriptions = db.query(Subscription, Tool).join(Tool).filter(
            Subscription.user_id == user_id,
            Subscription.status == "active"
        ).all()
        
        # Map tool names to frontend app names
        tool_to_app_mapping = {
            "bi_agent": "Business Intelligence Agent",
            "crispwrite": "CrispWrite", 
            "sop_agent": "SOP Assistant",
            "resume_analyzer": "Resume Analyzer",
            "recruitment_assistant": "AI Recruitment Assistant"
        }
        
        purchased_apps = []
        subscription_end = None
        
        for subscription, tool in subscriptions:
            # Map tool name to frontend app name
            app_name = tool_to_app_mapping.get(tool.name, tool.name)
            if app_name not in purchased_apps:
                purchased_apps.append(app_name)
            
            # For subscription_end, you might want to get this from Stripe
            # For now, we'll set a placeholder - you should integrate with Stripe to get actual end dates
            if not subscription_end:
                subscription_end = "2024-12-31T23:59:59Z"  # Placeholder
        
        return jsonify({
            "purchased_apps": purchased_apps,
            "subscription_end": subscription_end if purchased_apps else None
        })
