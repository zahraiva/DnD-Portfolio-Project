import random
import aiosmtplib
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv

load_dotenv()

async def generate_otp():
    return str(random.randint(100000, 999999))

async def send_email_with_smtp(to_email: str, subject: str, body: str):
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    sender_email = "alimustafayev05211@gmail.com"
    app_password = os.getenv('APP_PASSWORD')

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = sender_email
    msg["To"] = to_email

    try:
        await aiosmtplib.send(
            message=msg,
            hostname=smtp_server,
            port=smtp_port,
            start_tls=True,
            username=sender_email,
            password=app_password,
        )
        print("Email sent successfully!")
    except Exception as e:
        print(f"Failed to send email: {e}")