# 🌐 Full Stack App — React + Material UI + Spring Boot + PostgreSQL

This project is a full-featured CRUD application built with:

- ⚛️ React + Material UI for the frontend
- 🚀 Spring Boot for the backend
- 🐘 PostgreSQL for data persistence

---

## 🧱 Tech Stack

- **Frontend**: React, Material UI, Axios.
- **Backend**: Spring Boot, Java 21, Spring Web, Spring Data JPA
- **Database**: PostgreSQL

---

## 🐋 Setup with Docker Compose

### 1. .env
```.env
POSTGRES_USER=your-data
POSTGRES_PASSWORD=your-data
POSTGRES_DB=your-data
```

### 2. Run app
```bash
 docker-compose up --build
```

## 📁 Project Structure

```
/diploma-vehicle-rental-system
  ├── backend
  └── frontend
```

---

## ⚙️ Requirements

- Java 21
- Maven 3.8+
- Node.js 18+
- PostgreSQL

---

## 🖥️ Backend Setup (Spring Boot) (local)

### 1. Configure PostgreSQL

Create a database:

```sql
CREATE DATABASE vehicle-rental-system;
```

### 2. Set up `application.properties`

Inside `backend/src/main/resources/application.yaml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/vehicle-rental-db
    username: postgres
    password: q11q
```

### 3. Run the backend server

```bash
cd backend
./mvnw spring-boot:run
```

API will be available at: `http://localhost:8888/api`

---

## 🌐 Frontend Setup (React + Material UI) (local)

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Configure environment variables

```js
export const API_BASE_URL = 'http://localhost:8888/api/v1';
```

### 3. Start the React app

```bash
npm run dev
```

App will be running at: `http://localhost:3000`

---

## ✅ Summary

- React App: http://localhost:3000
- Spring Boot API: http://localhost:8880/api
