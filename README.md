# MiniTask

MiniTask is a small full-stack task manager built as a learning project. It connects a React frontend to a Spring Boot REST API backed by PostgreSQL, and it shows every HTTP request the UI makes so the client/server interaction is visible while using the app.

> **Educational project.** This repository exists purely for practice with the tech stack listed below. It is not intended for production use. It has no authentication, no authorization, and no test suite beyond a context-load check.

## Purpose

The goal was to understand how a React application and a Spring Boot backend actually talk to each other:

- how a `fetch` call becomes an HTTP request;
- how Spring MVC maps that request to a controller method;
- how Spring Data JPA persists an entity to PostgreSQL;
- how the JSON response flows back and updates React state.

To make that interaction explicit, the interface includes an **API activity** panel that logs the real method, path, status code, and duration of every request.

## Tech stack

**Backend**

| Technology | Role |
| --- | --- |
| Java 21 | Language and runtime |
| Spring Boot 4.1.2 | Application framework |
| Spring Web MVC | REST controllers and routing |
| Spring Data JPA / Hibernate | Persistence layer |
| PostgreSQL | Relational database |
| Maven | Build and dependency management |

**Frontend**

| Technology | Role |
| --- | --- |
| React 19 | UI and state management |
| Vite 8 | Development server and build tool |
| JavaScript | No TypeScript, to keep the focus on the interaction |
| Plain CSS | Styling |
| Fetch API | HTTP communication with the backend |

## Features

- List all tasks
- Create a task with a title and an optional description
- Edit a task inline
- Mark a task as completed
- Reopen a completed task
- Delete a task
- Live counters for total, open, and completed tasks
- Connection indicator for the backend
- API activity log showing method, path, status, and latency
- Responsive layout

## API

Base URL: `http://localhost:8080`

| Method | Endpoint | Description | Success |
| --- | --- | --- | --- |
| `GET` | `/api/tasks` | Return every task | `200` |
| `GET` | `/api/tasks/{id}` | Return a single task | `200` / `404` |
| `POST` | `/api/tasks` | Create a task from a JSON body | `201` |
| `PUT` | `/api/tasks/{id}` | Replace the title, description, and completed flag | `200` / `404` |
| `PATCH` | `/api/tasks/{id}/complete` | Mark a task as completed | `200` / `404` |
| `DELETE` | `/api/tasks/{id}` | Delete a task | `204` / `404` |

A task is represented as:

```json
{
  "id": 1,
  "title": "Review Spring Data JPA",
  "description": "Read the repository abstraction docs",
  "completed": false
}
```

## Project structure

```
minitask/
├── src/main/java/com/example/minitask/
│   ├── MiniTaskApplication.java
│   ├── config/CorsConfig.java
│   ├── controller/TaskController.java
│   ├── model/Task.java
│   ├── repository/TaskRepository.java
│   └── service/TaskService.java
├── src/main/resources/application.properties
├── src/test/java/com/example/minitask/
├── frontend/
│   ├── public/favicon.svg
│   ├── src/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── components/
│   │       ├── ActivityLog.jsx
│   │       ├── Icons.jsx
│   │       └── TaskCard.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── pom.xml
└── README.md
```

## Getting started

### Prerequisites

- JDK 21
- Node.js 20.19+ (or 22.12+)
- PostgreSQL running locally

### 1. Create the database

Connect to PostgreSQL as a superuser and run:

```sql
CREATE USER minitask WITH PASSWORD 'minitask';
CREATE DATABASE minitask OWNER minitask;
```

The `tasks` table is created automatically by Hibernate on startup.

If you prefer different credentials, set the `DB_USER` and `DB_PASSWORD` environment variables, or edit `src/main/resources/application.properties`.

### 2. Start the backend

From the project root:

```bash
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080`.

### 3. Start the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

CORS is configured in `CorsConfig.java` for `http://localhost:5173` and `http://127.0.0.1:5173`.

## Configuration

`src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/minitask
spring.datasource.username=${DB_USER:minitask}
spring.datasource.password=${DB_PASSWORD:minitask}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.open-in-view=false
```

`spring.jpa.hibernate.ddl-auto=update` lets Hibernate manage the schema automatically. This is convenient for learning but should be replaced with a migration tool such as Flyway in a real application.

## Notes and limitations

- The backend exposes the JPA entity directly; there are no DTOs yet.
- Input is validated only in the frontend; the API accepts blank titles.
- Errors are returned with Spring's default error response.
- The API activity log is kept in memory in the browser and is cleared on refresh.
- This project is intentionally small and does not aim to cover every production concern.

## Disclaimer

This code is provided for educational purposes only. It was written as an exercise to practice Java, Spring Boot, Spring Data JPA, PostgreSQL, React, and the HTTP interaction between a frontend and a backend. Use it as a learning reference, not as production software.
