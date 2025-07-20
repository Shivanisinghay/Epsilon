# Epsilon Marketing Content Generation - Frontend

This is the frontend for the Epsilon project, a platform to generate various types of marketing content.

## Features

- User registration and login
- Generate marketing emails
- Generate push notifications
- Generate video transcripts
- Generate images from prompts
- Generate audio ads from text

## Tech Stack

- **React.js**: A JavaScript library for building user interfaces.
- **Chakra UI**: A simple, modular and accessible component library for React.
- **React Router**: For declarative routing in React.
- **Axios**: For making HTTP requests to the backend.
- **React Hot Toast**: For user-friendly notifications.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or newer)
- [npm](https://www.npmjs.com/) or [Yarn](https/yarnpkg.com/)
- A running instance of the [backend server](https://github.com/shivanisinghay/epsilon/tree/main/backend).

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd epsilon-frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

    or

    ```bash
    yarn install
    ```

3.  **Create an environment file:**

    Create a file named `.env.development` in the root of the project and add the following, pointing to your backend server's URL:

    ```
    REACT_APP_BACKEND_URL=http://localhost:5000
    ```

4.  **Start the development server:**

    ```bash
    npm start
    ```

    or

    ```bash
    yarn start
    ```

The application will be running at `http://localhost:3000`.

## Folder Structure