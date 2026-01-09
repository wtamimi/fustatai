# FustatAI – Prerequisites (First-Time Setup)

This document covers **one-time system setup** required before working on FustatAI project.

> You only need to complete this once per machine.

---

## 1. Windows Setup (WSL)

> **Tested environment:** Windows 11 + WSL2 + Ubuntu 24.04

### 1.1 Install WSL

Open **PowerShell (Admin)**:

```powershell
# Check if WSL is already installed
wsl --list --verbose

# If not installed or wrong version:
wsl --install --no-distribution
wsl --set-default-version 2
```

Reboot when prompted.

### 1.2 Install Ubuntu 24.04

```powershell
wsl --install -d Ubuntu-24.04
```

### 1.3 Verify Installation

```powershell
wsl -l -v
```

Ensure Ubuntu is running on WSL 2.

### 1.4 Initialize Ubuntu (REQUIRED FIRST STEP)

Open Ubuntu 24.04 from the Start menu.

> ⚠️ IMPORTANT: You'll be prompted to create a UNIX username and password. This is separate from your Windows credentials.

Immediately after setting up your user, run:

```bash
sudo apt update && sudo apt upgrade -y
```

⚠️ Do not skip this step on a new distro. It prevents package, SSL, and dependency issues later.

### 1.5 Install Utilities

```bash
sudo apt install build-essential libssl-dev libffi-dev pkg-config -y
sudo apt install software-properties-common -y
```

---

## 2. System Dependencies

### 2.1 Git

Git comes pre-installed with Ubuntu. Verify:

```bash
git --version
```

> Expected: git version 2.43.x or higher

If not present (unlikely), install with:

```bash
sudo apt install git -y
```

### 2.2 Python 3.13+

Ubuntu ships with Python pre-installed (typically Python 3.12). 

FustatAI requires Python 3.13+, so we need to install it.

```bash
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt update
```

Install Python 3.13:

```bash
sudo apt install python3.13 python3.13-venv python3.13-dev -y
```

Verify:

```bash
python3.13 --version
```

### 2.3 uv (Python Package Manager)

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Restart terminal, then verify:

```bash
uv --version
```

### 2.4 PostgreSQL 16+

```bash
# Install PostgreSQL
sudo apt install postgresql-16 postgresql-client-16 libpq-dev -y
sudo service postgresql start
```

Verify PostgreSQL is running:

```bash
sudo service postgresql status
```

Configure PostgreSQL user account:

```bash
# After starting PostgreSQL (Use a stronger password)
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"

# Create a database with your username for personal testing (optional)
echo "Creating personal database '$(whoami)' for development testing"
sudo -u postgres createdb $(whoami) 2>/dev/null || true
```

### 2.5 Node.js v22+ (Direct Install)

```bash
# Install Node.js 22.x directly
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Install global npm packages (optional but useful)
sudo npm install -g npm@latest
```

Verify:

```bash
node -v
npm -v
```

---

## 3. Developer Tools

### 3.1 VS Code Setup (Recommended)

- Install VS Code on Windows

- Install these extensions in VS Code:

    - Python (ms-python.python)

    - Remote - WSL (ms-vscode-remote.remote-wsl)

    - REST Client (humao.rest-client)

    - ESLint (dbaeumer.vscode-eslint)

    - `(Optional)` PostgreSQL (ms-ossdata.vscode-pgsql)

### 3.2 WSL Development Workflow

Always open projects from Ubuntu terminal:

```bash
cd /path/to/project
code .
```

This ensures VS Code runs in WSL mode with proper environment.

---

## Verification Checklist

Run these commands to verify everything is installed correctly:

```bash
# 1. System
git --version

# 2. Python
python3.13 --version
uv --version

# 3. Database
pg_isready -h localhost

# 4. Node.js
node -v
npm -v
```

Your machine is now ready for FustatAI development.

Proceed to [Setup Guide](SETUP.md) to configure and run the projects.
