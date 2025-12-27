# FustatAI - Orchestration Service

FustatAI Orchestration Service is a lightweight runtime engine powering agents configuration and runtime. Orchestration Service enables:

- API-first interaction with Hub & Studio
- Multi-agent patterns and agents runtime
- MCP Servers support
- Context routing
- Memory & state management

## Prerequisites

Python 3.13+

PostgreSQL 16+

`uv` installed [Instructions Here](https://docs.astral.sh/uv/getting-started/installation/)

VS Code (recommended)

Windows 11 WSL Ubuntu24 (tested environment), Linux and Mac should be fine.

## Project Setup

1. open /src/orchestrator folder in VS Code as a stand-alone project

```bash
# run uv sync to install dependncies
uv sync
```

2. Configure Virtual Environment

```bash
# For Windows Command Prompt:
.venv\Scripts\activate

# For Git Bash/Linux/Mac:
source .venv/bin/activate
```

3. Database Setup

```sql
-- Create PostgreSQL database
CREATE DATABASE llm;
```

4. Environment Configuration

Copy the example environment file and adjust the settings:

```bash
# For Windows Command Prompt:
copy .env.example .env

# For Git Bash/Linux/Mac:
cp .env.example .env
```

Then edit the .env file and set your environment variables.

Optional: Create a Langsmith account to enable traces, generate API Key and set it in .env file. [Register or Login to LangSmith](https://smith.langchain.com/). This step is optional and can be skipped.

5. Initialize Database

```bash
alembic upgrade head
```

6. Run Database Seed Script (Optional)

```bash
# DB seed with initial API Key and MCP Server
uv run ./scripts/seed.py
```

7. Run Application

```bash
# run uv sync to install dependncies
uv run run.py
```

8. Validate

Open your browser and navigate to:
http://127.0.0.1:8000/docs


## Project Structure

```bash
WebApi/
├── src/
│   ├── api/               # API endpoints and routers
│   ├── core/              # Core functionality
│   │   └── database.py    # Database connection and session management
│   ├── crud/              # Database operations
│   ├── models/            # SQLAlchemy database models
│   ├── orchestrator/      # Agents runtime logic
│   ├── schemas/           # Pydantic schemas for data validation
│   └── main.py            # Main application entry point
├── migrations/            # Database migration scripts
├── scripts/               # Database seed
├── run.py                 # Web API runner
└── test.http              # API test cases
```

## DB Changes

```bash
alembic revision --autogenerate -m "describe changes"
alembic upgrade head

# get migration history
alembic current

alembic history

# rollback migration
alembic downgrade a1b2c3d4e5f6

alembic downgrade base
```

## Coding Guidelines

### General Principles

- Follow PEP 8 style guide
- Use async/await for all database operations
- Validate all inputs with Pydantic schemas
- Use UUIDs instead of integer primary keys

### Naming Conventions

- Models: PascalCase (e.g., UserAccount)
- Schemas: PascalCase with suffix (e.g., UserCreate, UserOut)
- CRUD operations: snake_case (e.g., get_agent_by_id)
- API endpoints: snake_case URLs

## Dev Extensions 

 Steps:

 1. Create a new model in models directory, and set the schema to 'config' or 'agents'

 2. Create a pydantic schema in schemas directory

 3. Create CRUD operations in crud directory

 4. Create API endpoints in api directory (CRUD operations)

 5. Update the alembic setup to handle multiple schemas (if necessary) and generate migration

### Creating a New CRUD API Example

Step 1: Create a Model
src/models/user_model.py

```python
from .base import BaseModel
from sqlalchemy import Column, String, Boolean

class UserAccount(BaseModel):
    __tablename__ = "user_account"
    
    email = Column(String(255), unique=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
```

Step 2: Create Schemas
src/schemas/user_schema.py

```python
from pydantic import BaseModel, EmailStr
from uuid import UUID

class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: UUID
    is_active: bool

    class Config:
        orm_mode = True
```

Step 3: Create CRUD Operations
src/crud/user_crud.py

```python
from sqlalchemy.future import select
from models.user_model import UserAccount
from .security import get_password_hash

async def create_user(db, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = UserAccount(
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_password
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

async def get_user_by_email(db, email: str):
    result = await db.execute(
        select(UserAccount).filter(UserAccount.email == email)
    )
    return result.scalars().first()
```

Step 4: Create API Endpoints
src/api/user_api.py

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db
from schemas.user_schema import UserCreate, User
from crud.user_crud import create_user, get_user_by_email

router = APIRouter()

@router.post("/users", response_model=User)
async def create_new_user(user: UserCreate, db: AsyncSession = Depends(get_db)):
    db_user = await get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return await create_user(db=db, user=user)
```

Step 5: Register Router in Main
src/main.py

```python
# ... existing imports ...
from api.user_api import router as user_router

app = FastAPI()

# ... existing code ...

app.include_router(user_router, prefix="/api")
```

Step 6: Create Migration

```bash
alembic revision --autogenerate -m "Add user_account table"
alembic upgrade head
```

Testing APIs with test.http
Add Tests to test.http

```http
### Create new user
POST http://localhost:8000/api/users
Content-Type: application/json

{
  "email": "test@example.com",
  "full_name": "Test User",
  "password": "securepassword123"
}
```

### Using VS Code REST Client

Install "REST Client" extension

Open test.http file

Click "Send Request" above each request definition

## Troubleshooting

Database connection failures: Verify .env file and PostgreSQL service status

Migration errors: Run alembic upgrade head --sql to see generated SQL

Missing dependencies: Re-run uvsync
