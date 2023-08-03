# Angular and Laravel Chat Project

This project is a chat application built using Angular on the frontend and Laravel on the backend. It utilizes the Chatify backend and Pusher to provide real-time messaging functionality.

For the Angular frontend, we have used a custom boilerplate project that provides a basic structure and configuration to kickstart Angular development. You can find the Angular boilerplate project in the following repository:

[Angular Boilerplate Project](https://github.com/your-username/your-angular-boilerplate-repo)

Please follow the instructions in the repository's README.md file to set up and run the Angular frontend.

The Laravel backend for this chat application can be found in the following repository:

[Laravel Chat Repository](https://github.com/your-username/your-laravel-chat-repo)

Please follow the instructions in the repository's README.md file to set up and run the Laravel backend.

## Prerequisites

Before you begin, ensure you have the following software installed:

- Node: 18.10.0
- Angular CLI: 15.2.8
- Package Manager: npm 8.19.2
- PHP: 8.1
- Composer: 2.2.18
- Database: MySQL 8.x


## Features

- **Angular 15.2.8 and Material Angular 15.2.9**: The frontend is built using the latest versions of Angular and Material Angular, providing a modern and responsive user interface.
- **Basic Authentication & Authorization**: The Angular frontend integrates with the Laravel backend to provide basic authentication and authorization using Laravel Sanctum.
- **Well-Organized Project Structure**: The frontend follows a well-organized project structure that promotes modularity and reusability of components and services.
- **Routing and Navigation**: The application utilizes Angular's routing and navigation system to provide a seamless user experience.
- **Lazy Loading**: The frontend implements lazy loading to load modules on-demand, improving application performance.
- **HTTP Communication**: The Angular frontend communicates with the Laravel backend using HTTP requests to fetch data and send messages.
- **Basic Forms and Validation**: Forms in the frontend are designed using Angular's form modules and include basic validation.
- **Error Handling**: The application has error handling mechanisms to gracefully handle errors and display appropriate messages to users.
- **Deployment and Build Process**: The frontend can be easily built and deployed to various environments using Angular's build process.


## Getting Started

Follow the steps below to set up and run the project:

### 1. Clone the Repository

```bash
git clone [repository-url]
```

### 2. Set Up the Angular Frontend

Follow the instructions in the [Angular Boilerplate Project](https://github.com/your-username/your-angular-boilerplate-repo) repository to set up and run the Angular frontend.

- After setting up, you should configure pusher configuration in the environment file.

### 3. Set Up the Laravel Backend

Follow the instructions in the [Laravel Chat Repository](https://github.com/your-username/your-laravel-chat-repo) repository to set up and run the Laravel backend.

- After setting up, you should configure pusher configuration in the .env file.

### 4. Customization.

To customize chat functionality, you can customize it in the `./src/app/dashboard/components/chats/`



Feel free to customize and extend the provided boilerplate code to suit your specific chat project needs. Happy coding!

## Screenshots
### Chat Screenshot
![Alt text](./src/assets/images/screenshots/chat.png?raw=true "Chat Screen")
