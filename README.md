# AI Teaching Assistant

Dyad is a comprehensive full-stack application designed to assist educators in generating high-quality educational content. By leveraging AI technology, Dyad streamlines the creation of Lesson Plans, Worksheets, and Parent Updates, allowing teachers to focus more on their students.

## Key Features

*   **User Authentication**: Secure user registration and login functionality to manage personal workspaces.
*   **Project Management**: Organize educational materials into distinct projects for better workflow management.
*   **AI Content Generators**:
    *   **Lesson Plans**: Generate structured lesson plans tailored to specific subjects and grade levels.
    *   **Worksheets**: Create interactive worksheets to reinforce learning objectives.
    *   **Parent Updates**: Draft professional and informative updates for parents regarding student progress or class activities.

## Tech Stack

### Frontend
*   **Framework**: React + TypeScript + Vite
*   **Styling**: Tailwind CSS
*   **UI Library**: shadcn/ui
*   **State Management**: Context API

### Backend
*   **Framework**: FastAPI (Python)
*   **Database**: MongoDB (using Motor for async driver)
*   **Authentication**: JWT (JSON Web Tokens)

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites
*   Node.js (v16+)
*   Python (v3.8+)
*   MongoDB (Local instance or Atlas connection string)
*   pnpm (recommended) or npm

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Create and activate a virtual environment:
    ```bash
    # Windows
    python -m venv venv
    .\venv\Scripts\activate

    # macOS/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4.  Configure Environment Variables:
    *   Create a `.env` file in the `backend` directory.
    *   Add your MongoDB connection string and other necessary variables (e.g., `MONGODB_URL`, `SECRET_KEY`).

5.  Run the server:
    ```bash
    uvicorn main:app --reload
    ```
    The backend API will be available at `http://localhost:8000`.

### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    pnpm install
    # or if you use npm
    npm install
    ```

3.  Configure Environment Variables:
    *   Copy `.env.example` to `.env`.
    *   Ensure the API URL points to your backend (default is usually `http://localhost:8000`).

4.  Run the development server:
    ```bash
    pnpm dev
    # or
    npm run dev
    ```
    The frontend application will be available at `http://localhost:5173`.

## Project Structure

```
/
├── backend/            # FastAPI backend application
│   ├── api/            # API routes and dependencies
│   ├── core/           # Core configuration and security
│   ├── db/             # Database connection handling
│   ├── models/         # Pydantic models and database schemas
│   └── services/       # Business logic and AI generation services
│
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── api/        # API client and requests
│   │   ├── components/ # Reusable UI components
│   │   ├── contexts/   # React contexts (Auth, Content, Project)
│   │   ├── pages/      # Application pages/routes
│   │   └── utils/      # Utility functions
│
└── README.md           # Project documentation
```

## Current Status

**Note:** This project is currently in the **prototype phase**.
*   The core infrastructure for the full-stack application is in place.
*   AI generation features are currently simulated using templates for demonstration purposes. Future updates will integrate live LLM API calls for dynamic content generation.