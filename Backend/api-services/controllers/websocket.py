import os
import redis.asyncio as redis
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, APIRouter
from config import ENDPOINTS_PREFIX
from utils.logger import logger

redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST"),
    port=int(os.getenv("REDIS_PORT")),
    decode_responses=True
)

ws_router = APIRouter(
    prefix="/ws",
    tags=["WebSocket"]
)

@ws_router.websocket("/llm/{incident_id}")
async def websocket_llm(websocket: WebSocket, incident_id: str):
    logger.info(f"⚡️ WebSocket attempt: /llm/{incident_id}")
    await websocket.accept()
    pubsub = redis_client.pubsub()
    logger.info(f"\n\n\n[📡] Subscribing to Redis channel llm:{incident_id}\n\n\n")
    await pubsub.subscribe(f"llm:{incident_id}")
    
    logger.info(f"[📡] Subscribed to Redis channel llm:{incident_id}")

    try:
        logger.info(f"[📡] Listening to Redis channel llm:{incident_id}")
        async for message in pubsub.listen():
            logger.info(f"[📡] Received message: {message}")
            if message["type"] == "message":
                await websocket.send_text(message["data"])
                break  # Only send once and close
    finally:
        await pubsub.unsubscribe(f"llm:{incident_id}")
        await websocket.close()