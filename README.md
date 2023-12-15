# Todo List Application

## Overview

This Todo List application is a mobile app developed as part of the selection process for the "Student Intern Mobile App Developer" role at Team Zenfeat. It is built using React Native and TypeScript, presenting the ability to create a functional and well-structured mobile application.

## Features

The application includes the following features:

1. **Display of Tasks**: Users can view a list of tasks, each with a checkbox to indicate completion status.
2. **Add New Tasks**: Users have the ability to add new tasks to the list.
3. **Mark Tasks as Completed**: Users can mark tasks as completed by tapping the checkboxes.
4. **Delete Tasks**: Users can delete tasks from the list.

## Technology Stack

- **Frontend**: React Native, TypeScript
- **State Management**: useState, useRef (React Hooks)
- **Database**: SQLite for local persistent storage
- **Version Control**: Git

## Architecture

- **Components**: The application is structured into reusable components like `TaskItem` for individual tasks.
- **Database Management**: SQLite is used for local data storage, allowing tasks to be persisted across app restarts.
- **State Management**: React Hooks (`useState`, `useRef`) are used for managing state within the app.

## Setup and Installation

Ensure you have Node.js and React Native environment set up on your machine. Then, follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the `client` directory:

   ```bash
   cd client
3. Read the README.md file located in that directory