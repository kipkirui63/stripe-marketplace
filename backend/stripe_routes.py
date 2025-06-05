
import stripe
from flask import Blueprint, request, jsonify, redirect
from sqlalchemy.orm import Session
from db import get_db
from models import User, Subscription, Tool
from utils import verify_token
import os
from dotenv import load_dotenv

load_dotenv()
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

stripe_bp = Blueprint('stripe', __name__)
webhook_bp = Blueprint("stripe_webhook", __name__)

@stripe_bp.route("/stripe/create-checkout", methods=["POST"])
def create_checkout():
    token = request.args.get("token")
    product = request.args.get("product")
    user_id = verify_token(token)

    with next(get_db()) as db:
        user = db.query(User).filter(User.id == user_id).first()
        
        # Check if user already has this specific tool
        tool = db.query(Tool).filter(Tool.name == product.lower()).first()
        if tool:
            existing_sub = db.query(Subscription).filter(
                Subscription.user_id == user_id,
                Subscription.tool_id == tool.id,
                Subscription.status == "active"
            ).first()
            if existing_sub:
                return jsonify({"detail": f"You already have an active subscription for {product}"}), 400

        price_ids = {
            "bi_agent": os.getenv("PRICE_ID_BI_AGENT"),
            "crispwrite": os.getenv("PRICE_ID_CRISPWRITE"),
            "sop_agent": os.getenv("PRICE_ID_SOP_AGENT"),
            "resume_analyzer": os.getenv("PRICE_ID_RESUME_ANALYZER"),
            "recruitment_assistant": os.getenv("PRICE_ID_RECRUITMENT_ASSISTANT")
        }

        price_id = price_ids.get(product.lower())
        if not price_id:
            return jsonify({"detail": "Invalid product key"}), 400

        # Add tool_id to metadata so webhook can identify which tool was purchased
        if not tool:
            # Create tool if it doesn't exist
            tool = Tool(name=product.lower(), description=f"{product} tool", price_id=price_id)
            db.add(tool)
            db.commit()

        session = stripe.checkout.Session.create(
            customer_email=user.email,
            payment_method_types=["card"],
            line_items=[{
                'price': price_id,
                'quantity': 1
            }],
            mode='subscription',
            subscription_data={"trial_period_days": 7},
            metadata={
                "tool_id": str(tool.id),
                "user_id": str(user_id)
            },
            success_url="https://crispai.crispvision.org/success",
            cancel_url="http://localhost:8080/cancel"
        )
        return jsonify({"checkout_url": session.url})


@webhook_bp.route("/stripe/webhook", methods=["POST"])
def stripe_webhook():
    payload = request.data
    sig_header = request.headers.get("Stripe-Signature")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except ValueError:
        return "Invalid payload", 400
    except stripe.error.SignatureVerificationError:
        return "Invalid signature", 400

    # Handle checkout.session.completed
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        customer_email = session.get("customer_email")
        metadata = session.get("metadata", {})
        tool_id = metadata.get("tool_id")
        user_id = metadata.get("user_id")

        if not tool_id or not customer_email or not user_id:
            return "Missing tool ID, user ID, or email", 400

        with next(get_db()) as db:
            user = db.query(User).filter(User.id == int(user_id)).first()
            if user:
                # Check if subscription already exists
                existing_sub = db.query(Subscription).filter(
                    Subscription.user_id == user.id,
                    Subscription.tool_id == int(tool_id)
                ).first()
                
                if existing_sub:
                    existing_sub.status = "active"
                else:
                    subscription = Subscription(
                        user_id=user.id,
                        tool_id=int(tool_id),
                        status="active",
                        email=customer_email
                    )
                    db.add(subscription)
                db.commit()

    return "Success", 200


@stripe_bp.route("/agent/gateway")
def agent_gateway():
    token = request.args.get("token")
    user_id = verify_token(token)

    with next(get_db()) as db:
        user = db.query(User).filter(User.id == user_id).first()
        if user and user.role == "agent":
            return redirect("https://crispai.crispvision.org/agent-dashboard")
        return jsonify({"detail": "Unauthorized"}), 403
