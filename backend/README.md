# Quick Beaver Dive API

This is the backend API for the Quick Beaver Dive application, built with FastAPI and MongoDB.

## Prerequisites

- Python 3.8+
- MongoDB instance (local or Atlas)

## Setup

1.  **Navigate to the project root directory:**

    ```bash
    cd quick-beaver-dive
    ```

2.  **Create a virtual environment:**

    ```bash
    python -m venv venv
    ```

3.  **Activate the virtual environment:**

    *   **Windows:**
        ```powershell
        .\venv\Scripts\Activate.ps1
        ```
    *   **macOS/Linux:**
        ```bash
        source venv/bin/activate
        ```

4.  **Install dependencies:**

    ```bash
    pip install -r backend/requirements.txt
    ```

## Configuration

1.  Create a `.env` file in the `backend` directory (i.e., `backend/.env`).
2.  Add the following environment variables:

    ```env
    MONGODB_URI=mongodb://localhost:27017
    DB_NAME=quick_beaver_dive
    JWT_SECRET=your_super_secret_jwt_key_here
    ACCESS_TOKEN_EXPIRE_MINUTES=30
    CORS_ORIGINS=["http://localhost:5173"]
    GEMINI_API_KEY=your_gemini_api_key_here
    ```

    *   Replace `your_super_secret_jwt_key_here` with a secure secret key.
    *   Replace `your_gemini_api_key_here` with your Google Gemini API key.
    *   Adjust `MONGODB_URI` if your database is hosted elsewhere.

## Running the Server

To start the development server with hot-reload enabled:

```bash
uvicorn backend.main:app --reload
```

The API will be available at `http://localhost:8000`.

## API Documentation

Once the server is running, you can access the interactive API documentation at:

*   **Swagger UI:** `http://localhost:8000/api/v1/docs`
*   **ReDoc:** `http://localhost:8000/api/v1/redoc`