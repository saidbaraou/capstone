# Zentry - Visitor Management SaaS
#### CS50W Capstone Project

**Zentry** is a full-stack web application designed to streamline and professionalize the visitor check-in process for offices, coworking spaces, or events.

## Distinctiveness and Complexity

Zentry stands out by its architecture and its feature set, fulfilling the requirements for both distinctiveness and complexity:

1.  **Architecture:** Unlike previous projects in the course (like Mail or Network), Zentry is built as a **decoupled application**. It uses a **Django REST Framework (DRF)** backend acting as a pure API, and a modern **React** frontend built with **TypeScript** and **Vite**. This separation reflects real-world SaaS development.
2.  **Complexity in Frontend:** The frontend utilizes **TypeScript** for type safety, **Tailwind CSS** for a professional responsive design, and **Axios** for asynchronous communication with the backend. It manages complex states for visitor registration and dashboard real-time updates.
3.  **Complexity in Backend:** The Django backend implements **Serializers** to handle data transformation, custom **ViewSets**, and environment-based configurations using `.env` files for security.
4.  **Security:** The project implements security best practices, including **CORS** (Cross-Origin Resource Sharing) headers to allow the frontend to communicate securely with the API, and protection of sensitive keys through environment variables.

## Project Structure

- `backend/`: The Django project directory.
    - `zentry_project/`: Main project configuration (settings, URLs).
    - `visitors/`: App managing the visitor models, serializers, and API views.
    - `.env`: (Excluded from Git) Contains sensitive secret keys and database URLs.
    - `requirements.txt`: Python dependencies.
- `frontend-web/`: The React + TypeScript application.
    - `src/`: Contains React components, hooks, and services.
    - `tailwind.config.js`: Configuration for the utility-first CSS framework.
    - `package.json`: Node.js dependencies and scripts.
- `.gitignore`: Ensures that `node_modules`, `venv`, `__pycache__`, and `.env` files are not uploaded to GitHub.

## Features

- **Visitor Registration:** A clean, intuitive form for visitors to sign in.
- **Admin Dashboard:** A real-time view for administrators to monitor current visitors and check-in history.
- **Responsive Design:** Fully optimized for desktops, tablets, and smartphones.
- **Secure API:** A robust REST API providing endpoints for all CRUD operations.

## Installation and Setup

### ⚠️ Mandatory Configuration
Before running the backend, you **must** create a `.env` file in the `backend/` directory.

1. Create the file: `touch backend/.env`
2. Add the following required variables:
   ```env
   DEBUG=True
   SECRET_KEY=your_random_secret_key_here
   ALLOWED_HOSTS=localhost,127.0.0.1
   DATABASE_URL=sqlite:///db.sqlite3

   Note: You can generate a new secret key using the command:
    python -c 'from django.core.management.utils import get_random_secret_key;     print(get_random_secret_key())'

### Backend
1. Navigate to the `backend` folder.
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/Scripts/activate # On Windows
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
4. Create a .env file based on the provided examples and run migrations:
   ```bash
   python manage.py migrate
4. Start the server:
   ```bash
   python manage.py runserver

   
### Frontend
1. Navigate to the `front` folder.
2. Install dependencies:
   ```bash
   npm install
3. Run environment server:
   ```bash
   npm run dev
   
