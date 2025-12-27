### FustatAI - Agent Studio (Next.js)

A builder’s environment for configuring, deploying, and experimenting with agents. Agent Studio provides a sandbox for:

- Authoring agents and agentic workflows
- Configuring MCP Server & LLM APIs
- Rapid experimentation and agents deployment iterations

## Prerequisites

Nodejs v22+

## Getting Started

1. open /src/studio folder in VS Code as a stand-alone project

```bash
# install dependncies
npm i
```

2. Environment Variables

Copy the example environment file and adjust the settings (if needed):

```bash
# For Windows Command Prompt:
copy .env.example .env

# For Git Bash/Linux/Mac:
cp .env.example .env
```

3. Run the development server:

```bash
npm run dev

# or
pnpm dev
```

4. Launch Agent Studio

The app will be available at http://localhost:8080
