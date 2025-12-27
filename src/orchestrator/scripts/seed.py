import sys
import os

# Append root directory (the one containing `src`) to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import asyncio
from datetime import date
from uuid6 import uuid7

from sqlalchemy import text
from src.core.database import engine, async_session
from src.models.version import Version
from src.models.api_key import ApiKey
from src.models.mcp_server import McpServer

async def seed():
    async with async_session() as session:
        # Clear existing data (optional for dev)
        await seed_version(session)
        await seed_apikey(session)
        await seed_mcpserver(session)

        await session.commit()
        print("✅ Database seeded successfully.")

async def seed_mcpserver(session):
    #await session.execute(text("DELETE FROM config.mcp_server"))

    # MCP Servers seed
    mcp_servers = [
        McpServer(
            id=uuid7(),
            name="File System",
            description="File server for MCP services",
            config_json={
                "command": "/usr/bin/npx",
                "args": [
                    "-y", 
                    "@modelcontextprotocol/server-filesystem", 
                    "/home/wtamimi/fileserver"
                    ]  
                },
            )
        ]

    for key in mcp_servers:
        session.add(key)

async def seed_apikey(session):
    #await session.execute(text("DELETE FROM config.api_key"))

    # API keys seed
    api_keys = [
            ApiKey(
                id=uuid7(),
                name="OpenAI Dev Key",
                provider_name="OpenAI",
                model_name="gpt-4o",
                base_url="https://api.openai.com/v1/",
                secret_key="secret-123",
            ),
            ApiKey(
                id=uuid7(),
                name="Groq Dev Key",
                provider_name="Groq",
                model_name="llama-3.3-70b-versatile",
                base_url="https://api.groq.com/openai/v1",
                secret_key="gsk_xxx",
            )
        ]

    for key in api_keys:
        session.add(key)
    
    #await session.flush()  # to ensure IDs are persisted before FK insert

    #return api_keys

async def seed_version(session):
    #await session.execute(text("DELETE FROM public.version"))

    # app version table
    versions = [
            Version(
                id=uuid7(),
                version_number="0.0.0",
                release_date=date(2025, 6, 28),
                release_description="Setup project structure"
            ),
            Version(
                id=uuid7(),
                version_number="0.0.1",
                release_date=date(2025, 7, 26),
                release_description="Initial MVP"
            )
        ]

    for v in versions:
        session.add(v)

if __name__ == "__main__":
    asyncio.run(seed())

