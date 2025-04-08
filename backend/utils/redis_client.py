import aioredis

redis_client = aioredis.from_url("redis://localhost", decode_responses=True)

async def store_otp_in_redis(email: str, otp: str, expiration: int = 600):
    await redis_client.setex(f"otp:{email}", expiration, otp)

async def get_otp_from_redis(email: str):
    return await redis_client.get(f"otp:{email}")

async def delete_otp_from_redis(email: str):
    await redis_client.delete(f"otp:{email}")
