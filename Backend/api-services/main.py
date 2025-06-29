## External imports
import uvicorn
from fastapi import FastAPI, Request
from fastapi.openapi.utils import get_openapi
from fastapi.middleware.cors import CORSMiddleware

## Internal imports
from utils.logger import logger
from controllers.auth import auth_router
from controllers.users import users_router
from controllers.incidents import incidents_router
from controllers.occurrences import occurrences_router
from controllers.organizations import organizations_router
from controllers.photos import photos_router
from controllers.videos import videos_router
from controllers.websocket import ws_router
from config import API_PORT, HTTPS_ENABLED

# ======================== MAIN ========================

# TODO: Remove this when deploying to production
app = FastAPI(title="FixAI API",
              docs_url='/api/v1/docs',
              openapi_url='/api/v1/openapi.json')

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Incoming request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Response status: {response.status_code}")
    return response

CHECK_NEARBY_STATS_HTTP = "null"

app.add_middleware(
    CORSMiddleware,
    allow_origins=['file://', 'http://localhost:5173', CHECK_NEARBY_STATS_HTTP],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], 
)

app.include_router(users_router)
app.include_router(occurrences_router)
app.include_router(incidents_router)
app.include_router(auth_router)
app.include_router(organizations_router)
app.include_router(photos_router)
app.include_router(videos_router)
app.include_router(ws_router)

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="FixAI API",
        version="1.0.0",
        description="API with JWT Authentication",
        routes=app.routes,
    )
    # Define the security scheme
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "apiKey",
            "in": "header",
            "name": "Authorization",
            "description": "Enter your JWT token in the format: Bearer <token>"
        }
    }
    # Apply the security scheme to all endpoints
    openapi_schema["security"] = [{"BearerAuth": []}]
    app.openapi_schema = openapi_schema
    return app.openapi_schema

if __name__ == "__main__":
    app.openapi = custom_openapi
    logger.info(f"Running server.. at port {API_PORT}")
    uvicorn.run("main:app", host="0.0.0.0", port=API_PORT, reload=True, log_level="debug")
