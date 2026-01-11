
# FustatAI – Local Development Setup

This guide walks you through setting up **FustatAI** locally, including:

- **Orchestration Service** (FastAPI backend & agent runtime)
- **Agent Studio** (Next.js agent builder)
- **Agent Hub** (Next.js agent interaction workspace)

---

## 1. Prerequisites

Follow our [guide here](PREREQUISITES.md) for setting up a new Windows WSL distro with prerequisites, or skip if you already have pre-requisites in-place: 

- Python 3.13+
- `uv` installed
- Nodejs v22+
- PostgreSQL 16+
- VS Code [download VS Code](https://code.visualstudio.com/) or use your favorite code editor

---

## 2. Clone the repo

```bash
git clone https://github.com/wtamimi/fustatai.git
```

### 2.1 Repo Structure

```bash
src/
├── orchestrator/   # Backend – API & agents runtime
├── studio/         # Agent Studio – AI builders
└── hub/            # Agent Hub – users workspace
```

Each folder is opened as a standalone project in VS Code.

### 2.2 Recommended run order

1. Orchestration Service — uvicorn
2. Agent Studio — npm
3. Agent Hub — npm

---

## 3. FustatAI - Orchestration Service

### 3.1 Create Database

In your linux terminal, run the following commands:

```bash
sudo -u postgres psql
```

```sql
-- Create PostgreSQL database
CREATE DATABASE llm;
\q
```

### 3.2 Open Project

Open /src/orchestrator folder in VS Code as a stand-alone project

```bash
# navigate to project folder
cd /src/orchestrator
# open in VS Code
code .
```

### 3.3 Install Dependencies

In VS Code terminal, run the following command:

```bash
# run uv sync to install dependencies
uv sync
```

### 3.4 Enable Virtual Environment

```bash
# For Windows Command Prompt:
.venv\Scripts\activate

# For Git Bash/Linux/Mac:
source .venv/bin/activate
```

### 3.5 Configure Environment Variables

Copy the example environment file and adjust the settings:

```bash
# For Windows Command Prompt:
copy .env.example .env

# For Git Bash/Linux/Mac:
cp .env.example .env
```

Then edit the .env file and set your environment variables.

Optional: Create a Langsmith account to enable traces, generate API Key and set it in .env file. [Register or Login to LangSmith](https://smith.langchain.com/). This step is optional and can be skipped.

### 3.6 Initialize Database

```bash
alembic upgrade head
```

### 3.7 Run Database Seed Script (Optional)

```bash
# DB seed with sample API Key and MCP Server
uv run ./scripts/seed.py
```

### 3.8 Run Application

```bash
# start the server
uv run run.py
```

### 3.9 Validate

Open your browser and navigate to: http://127.0.0.1:8000/docs

### 3.10 Troubleshooting

Database connection failures: Verify .env file and PostgreSQL service status

Migration errors: Run alembic upgrade head --sql to see generated SQL

Missing dependencies: Re-run uvsync

---

## 4. FustatAI - Agent Studio

### 4.1 Open Project

Open /src/studio folder in VS Code as a stand-alone project

```bash
# naviagte to project folder
cd /src/studio
# open in VS Code
code .
```

### 4.2 Install Dependencies

In VS Code terminal, run the following command:

```bash
# install dependencies
npm i
```

### 4.3 Environment Variables

Copy the example environment file and adjust the settings (if needed):

```bash
# For Windows Command Prompt:
copy .env.example .env

# For Git Bash/Linux/Mac:
cp .env.example .env
```

### 4.4 Start the Development Server

```bash
npm run dev

# or
pnpm dev
```

### 4.5 Launch Agent Studio

The app will be available at http://localhost:8080

---

## 5. FustatAI - Agent Hub

### 5.1 Open Project

Open /src/hub folder in VS Code as a stand-alone project

```bash
# naviagte to project folder
cd /src/hub
# open in VS Code
code .
```

### 5.2 Install Dependencies

In VS Code terminal, run the following command:

```bash
# install dependencies
npm i
```

### 5.3 Environment Variables

Copy the example environment file and adjust the settings (if needed):

```bash
# For Windows Command Prompt:
copy .env.example .env

# For Git Bash/Linux/Mac:
cp .env.example .env
```

### 5.4 Start the Development Server

```bash
npm run dev

# or
pnpm dev
```

### 5.5 Launch Agent Hub

The app will be available at http://localhost:3000
