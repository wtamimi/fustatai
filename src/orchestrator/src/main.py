from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from src.api import version, api_key, mcp_server, agent, orchestrator, apps, chat

# Async SQLite injection
from contextlib import asynccontextmanager
from src.orchestrator.core.lite_memory.sqlite_cp import DB_PATH, set_saver, clear_saver, get_saver#, saver, get_saver #init_saver, shutdown_saver
from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with AsyncSqliteSaver.from_conn_string(DB_PATH) as cp:
        set_saver(cp)         # assign once
        yield
    clear_saver()             # reset on shutdown


app = FastAPI(title="FustatAI - Orchestration Service", lifespan=lifespan)

origins = [
    # add production domains here when ready
    "http://localhost:3000",  # your frontend domain
    "http://127.0.0.1:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # or ["*"] for all origins (no credentials)
    allow_credentials=True,
    allow_methods=["*"],         # GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],         # includes Content-Type, Authorization, etc.
)

url_prefix = "/api/v1"

app.include_router(version.router)
app.include_router(api_key.router, prefix=url_prefix)
app.include_router(mcp_server.router, prefix=url_prefix)
app.include_router(agent.router, prefix=url_prefix)
app.include_router(orchestrator.router, prefix=url_prefix)
app.include_router(apps.router, prefix=url_prefix)
app.include_router(chat.router, prefix=url_prefix)

@app.get("/")
def health_check():
    return {"status": "healthy"}
