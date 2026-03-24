# AI Content Creator - Local Setup

This project has been updated for local development on Windows.

## Prerequisites

- Node.js (v20+ recommended)
- npm

## Setup Instructions

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    -   Copy `.env.example` to `.env`.
    -   Add your `OPENAI_API_KEY` to the `.env` file.

3.  **Run the Application**:
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:5000`.

## Key Changes from Replit Version

-   Removed Replit-specific Vite plugins.
-   Updated OpenAI model to `gpt-4o`.
-   Configured for standard local environment variables.
