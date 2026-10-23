# Order Management API

A production-style RESTful backend built with **Spring Boot**, featuring JWT security, layered architecture, automated testing, API documentation, and an integrated AI agent (**Luna**).

## Tech Stack

**Backend:** Java · Spring Boot · Spring Data JPA · MySQL · H2 (dev/test) · JWT · BCrypt · JUnit · Mockito · MockMvc · JaCoCo · SonarQube · Swagger · Postman · Actuator · Git

**Frontend:** React.js · Vite · Tailwind CSS

## Features

- **REST APIs** – Full CRUD with DTO-based request/response design
- **Data Layer** – Spring Data JPA with pagination and sorting
- **Validation** – Bean Validation on request payloads
- **Exception Handling** – Global handler with consistent error responses
- **Security** – JWT authentication, BCrypt password hashing, registration and login
- **API Versioning** – Versioned endpoints (`/api/v1/...`)
- **Logging** – Structured logging across layers
- **Profiles** – Separate `dev`, `test`, and `prod` configurations
- **H2 Database** – In-memory H2 for local development and tests (console at `/h2-console`, dev only); MySQL for production
- **React Frontend** – Responsive UI with login/registration, JWT-based session handling, and product browsing, connected to the REST API
- **AI Agent (Luna)** – AI-powered assistant integrated into the application
- **Monitoring** – Spring Boot Actuator health and metrics endpoints

## Testing & Code Quality

- Unit tests with **JUnit** and **Mockito**
- Controller tests with **MockMvc**
- Coverage reports with **JaCoCo**
- Static analysis with **SonarQube**

## API Documentation

- **Swagger UI:** `http://localhost:8080/swagger-ui.html`
- **Postman:** import the collection from the `/postman` folder

## Getting Started

```bash
# Clone
git clone https://github.com/Rathoreshruti23/Order_Management.git
cd Order_Management

# Run (dev profile)
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Run tests with coverage
mvn clean test jacoco:report

# Run the React frontend
cd frontend
npm install
npm run dev
```

H2 console (dev profile): `http://localhost:8080/h2-console`

Coverage report: `target/site/jacoco/index.html`

## Authentication Flow

1. `POST /api/v1/auth/register` – create an account
2. `POST /api/v1/auth/login` – receive a JWT
3. Send the token as `Authorization: Bearer <token>` on protected endpoints

## Project Structure

```
controller/   REST endpoints
service/      Business logic
repository/   JPA repositories
dto/          Request/response models
entity/       JPA entities
security/     JWT and Spring Security config
exception/    Global exception handling
```
<img width="1882" height="925" alt="Screenshot 2026-10-23 134002" src="https://github.com/user-attachments/assets/543e8f44-c549-42c3-b7fe-596eeb8119fa" />
<img width="1881" height="916" alt="image" src="https://github.com/user-attachments/assets/fb7703b6-a706-4c4d-8a73-0ea85fe3891f" />
<img width="1887" height="913" alt="image" src="https://github.com/user-attachments/assets/30e3988b-0c05-4b67-b2ec-53193a443911" />
<img width="1877" height="912" alt="image" src="https://github.com/user-attachments/assets/2ad35860-922e-4610-9ef1-c9008e6f569d" />


## Author

**Shruti Rathore** – Full Stack Developer
[GitHub](https://github.com/Rathoreshruti23)
