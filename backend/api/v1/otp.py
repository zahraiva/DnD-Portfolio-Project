from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from backend.utils.redis_client import redis_client
from backend.utils.otp import send_email_with_smtp
from backend.utils.otp import generate_otp
from backend.database import get_db
from backend.service import facades

router = APIRouter()

@router.post("/send-otp/")
async def send_otp(email: str, db: AsyncSession = Depends(get_db)):
    otp = await generate_otp()

    await redis_client.setex(f"otp:{email}", 600, otp)

    subject = "Your OTP for Email Verification"
    body = f"Your OTP is: {otp}. It is valid for 10 minutes."
    await send_email_with_smtp(email, subject, body)

    return {"message": "OTP sent successfully"}

@router.post("/verify-otp/")
async def verify_otp(email: str, otp: str, db: AsyncSession = Depends(get_db)):
    # Retrieve OTP from Redis
    stored_otp = await redis_client.get(f"otp:{email}")

    if not stored_otp:
        raise HTTPException(status_code=400, detail="OTP has expired or is invalid")

    if stored_otp != otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    user = await facades.get_dungeon_master_by_email(db, email)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await redis_client.delete(f"otp:{email}")

    return {"message": "Email verified successfully"}

@router.post("/resend-otp/")
async def resend_otp(email: str, db: AsyncSession = Depends(get_db)):
    user = await facades.get_dungeon_master_by_email(db, email)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.email_verified:
        raise HTTPException(status_code=400, detail="Email is already verified")

    otp = await generate_otp()

    await redis_client.setex(f"otp:{email}", 600, otp)

    subject = "Your New OTP for Email Verification"
    body = f"Your new OTP is: {otp}. It is valid for 10 minutes."
    await send_email_with_smtp(email, subject, body)

    return {"message": "A new OTP has been sent to your email"}