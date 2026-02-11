# ZüriMove Elite

## Setup Instructions

Since Node.js was not installed in your environment at creation time, follow these steps to get the project running:

1.  **Install Node.js**: Download and install from [nodejs.org](https://nodejs.org/).
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Generate Assets**:
    Run the included script to generate the placeholder animation frames (SVGs).
    ```bash
    node scripts/generate-placeholders.mjs
    ```
4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
5.  **Open Browser**:
    Navigate to `http://localhost:3000`.

## Features
-   Sticky Canvas Scrollytelling
-   Framer Motion integration
-   Tailwind CSS styling with custom "Swiss" palette
