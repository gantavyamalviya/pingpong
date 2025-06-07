<p align="center">
  <img src="pingpongFrontend/src/main/client/src/assets/pingpong-logo.png" width="200">
</p>
<p align="center">
    <h1 align="center">PingPost</h1>
</p>
<p align="center">
    <em>A full-stack web app to ping your friends</em>
</p>
<p align="center">
    <img src="https://img.shields.io/github/license/gantavyamalviya/pingpong?style=flat&logo=opensourceinitiative&logoColor=white&color=0080ff" alt="license">
    <img src="https://img.shields.io/github/last-commit/gantavyamalviya/pingpong?style=flat&logo=git&logoColor=white&color=0080ff" alt="last-commit">
    <img src="https://img.shields.io/github/languages/top/gantavyamalviya/pingpong?style=flat&color=0080ff" alt="repo-top-language">
    <img src="https://img.shields.io/github/languages/count/gantavyamalviya/pingpong?style=flat&color=0080ff" alt="repo-language-count">
<p>
<p align="center">
        <em>Developed with the software and tools below.</em>
</p>
<p align="center">    
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black" alt="JavaScript">
    <img src="https://img.shields.io/badge/Vite-646CFF.svg?style=flat&logo=Vite&logoColor=white" alt="Vite">
    <img src="https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=React&logoColor=black" alt="React">
    <img src="https://img.shields.io/badge/Redux-764ABC.svg?style=flat&logo=redux&logoColor=white" alt="Redux">
    <img src="https://img.shields.io/badge/React_Router-CA4245.svg?style=flat&logo=react-router&logoColor=white" alt="React Router">
    <img src="https://img.shields.io/badge/Axios-5A29E4.svg?style=flat&logo=Axios&logoColor=white" alt="Axios">
    <br> 
    <img src="https://img.shields.io/badge/Java-ED8B00.svg?style=flat&logo=openjdk&logoColor=black" alt="Java">
    <img src="https://img.shields.io/badge/Spring_Boot-6DB33F.svg?style=flat&logo=spring-boot&logoColor=white" alt="Spring Boot">
    <img src="https://img.shields.io/badge/JPA-Hibernate-59666C.svg?style=flat&logo=hibernate&logoColor=white" alt="JPA-Hibernate">
    <img src="https://img.shields.io/badge/JWT-3BBAF1.svg?style=flat&logo=jsonwebtokens&logoColor=white" alt="JWT">
    <img src="https://img.shields.io/badge/MariaDB-003545?style=flat&logo=mariadb&logoColor=white" alt="MariaDB">
    <br>   
    <img src="https://img.shields.io/badge/Docker-2496ED.svg?style=flat&logo=Docker&logoColor=white" alt="Docker">
    <img src="https://img.shields.io/badge/Git-F05032.svg?style=flat&logo=git&logoColor=white" alt="Git">
    <img src="https://img.shields.io/badge/GitHub%20Actions-2088FF.svg?style=flat&logo=GitHub-Actions&logoColor=white" alt="GitHub Actions">
    <img src="https://img.shields.io/badge/JUnit-25A162.svg?style=flat&logo=junit5&logoColor=white" alt="JUnit">
    <img src="https://img.shields.io/badge/Testcontainers-3186A1.svg?style=flat&logo=linuxcontainers&logoColor=white" alt="Testcontainers">
</p>

<br><!-- TABLE OF CONTENTS -->

<details>
  <summary>Table of Contents</summary><br>

- [📕 Overview](#-overview)

- [⭐ Features](#-features)

- [🧩 Architecture](#-architecture)

- [🚀 Getting Started](#-getting-started)

    - [⚙️ Running App Locally](#️-running-app-locally)
    - [📖 Usage](#-usage)
    - [📘 Swagger UI](#-swagger-ui)
    - [🧪 Tests](#-tests)

- [👏 Acknowledgments](#-acknowledgments)

  </details>
  <hr>

## 📕 Overview

PingPong is a robust social media currently in dev stage.

---

## ⭐ Features

- Coming soon...

---

## 🧩 Architecture

The application utilizes a client-server architecture with React for the frontend and Spring Boot for the backend. It follows a clear separation of concerns and uses a RESTful API for communication between the frontend and backend.

### Frontend

- **Framework**: React
- **UI Component Library**: Material UI
- **State Management**: Redux Toolkit
- **Routing**: React Router
- **HTTP Client**: Axios
- **Build Tool**: Vite

### Backend

- **Framework**: Spring Boot
- **Database**: MariaDB
- **ORM**: Hibernate
- **Testing**: Testcontainers
- **Build Tool**: Maven

### DevOps

- Docker (Containerization)

---

## 🚀 Getting Started

**Prerequisites**

- Node.js: `v18.17.x or later`
- npm or yarn
- Java Development Kit (JDK): `v17 or later`
- MariaDB: `latest`
- Docker
- Git

### ⚙️ Running App Locally

> Clone the repository:
>
> ```console
>  git clone https://github.com/gantavyamalviya/pingpong.git
> ```

> Navigate to the project directory:
>
> ```console
>  cd pingpong
> ```

<h4>Configure <code>Maria Database & Docker</code></h4>

> 1. Use Docker Compose to set up and start containers for **auth_db** database, instead of creating those databases in your local instance:
>
>    ```console
>    cd pingpongBackend
>    docker-compose up -d
>    ```
     
<h4>Setup <code>Backend</code></h4>

> 1. In the project root, navigate to the backend directory (if not done in previous step):
     
>    ```console
>    cd pingpongBackend
>    ```
>
> 2. Build and run the backend:
>
>    ```console
>    ./mvnw clean install
>    ./mvnw spring-boot:run
>    ```
>
> 4. The backend will be available at `http://localhost:8080`.

<h4>Setup <code>Frontend</code></h4>

> 1. Open new terminal then, In the project root, navigate to the frontend directory:
     
>    ```console
>    cd pingpongFrontend/src/main/client
>    ```
>
> 2. Install the dependencies:
>    ```console
>    npm install
>    ```
>
> 3. Start the development server:
>    ```console
>    npm run dev
>    ```
>
> 5. The frontend will be available at `http://localhost:3000`.

### 📖 Usage

> To use the application, open your browser and access the frontend interface at `http://localhost:3000`. Ensure the backend server is running at `http://localhost:8080` to enable API interactions.


### 📘 Swagger UI
> To explore the backend REST API interactively:
> 
> 📌 Visit: http://localhost:8080/swagger-ui/index.html
> 
>This page offers a complete listing and testing interface for all available API endpoints using Springdoc OpenAPI

### 🧪 Tests

<h4>Backend</h4>

> Run the test suite for backend using the commands below:
>
> ```console
> cd pingpongBackend
> ./mvnw test
> ```

---

## 👏 Acknowledgments

- Special thanks to the open-source community for providing the tools and frameworks that made this project possible.

<p align="right">
  <a href="#-overview"><b>Return</b></a>
</p>

---
