# 🚗 ParkEase — Smart Parking Management System

ParkEase is a **Smart Parking Management System** developed as part of the **Infosys Virtual Internship**.

The goal of this project is to provide a digital solution for managing parking spaces efficiently through:

* User Authentication (Login / Signup)
* Smart Parking Slot Management
* Real-time Parking Visualization
* Backend API using Spring Boot
* Modern Web UI using HTML, CSS, and JavaScript

---

## 🧠 Tech Stack

### Backend

* Java 17+
* Spring Boot
* Spring Web
* Spring Data JPA
* JDBC
* H2 Database (Development)

### Frontend

* HTML
* CSS (Dark Professional UI)
* JavaScript (Fetch API)

### Tools

* VS Code
* Maven
* Git & GitHub

---

## ✅ Features Implemented So Far

### 🔐 Authentication System

* User Signup
* User Login
* Backend validation
* User data stored in database

### 🗄 Database

* H2 in-memory database connected via JDBC
* JPA Entity: `User`
* Repository layer implemented

### 🧱 Backend Architecture

Project follows standard Spring Boot layered architecture:

```
com.parkease
│
├── controller     → REST APIs
├── service        → Business logic
├── repository     → Database layer
├── model          → Entities
└── ParkeaseApplication.java
```

### 🎨 Frontend

* Professional Dark Theme UI
* Login Page
* Signup Page
* Backend API integration

---

## 📂 Project Structure

```
parkease/
│
├── src/main/java/com/parkease
│   ├── controller
│   ├── service
│   ├── repository
│   └── model
│
├── src/main/resources
│   ├── static
│   │   ├── login.html
│   │   ├── signup.html
│   │   ├── style.css
│   │   └── auth.js
│   └── application.properties
│
└── pom.xml
```

---

## ⚙️ Setup Guide (For Teammates)

Follow these steps carefully after cloning the repository.

---

### 1️⃣ Clone Repository

```bash
git clone <repo-url>
cd parkease
```

---

### 2️⃣ Install Requirements

Make sure your system has:

* Java **17 or higher**
* VS Code
* Maven (not required separately — wrapper included)

Check Java:

```bash
java -version
```

---

### 3️⃣ Open Project

Open **parkease** folder in VS Code.

Wait for Maven dependencies to download automatically.

---

### 4️⃣ Run Application

Inside project root:

```bash
.\mvnw.cmd spring-boot:run
```

(or click **Run** on `ParkeaseApplication.java`)

---

### 5️⃣ Open Application

Login Page:

```
http://localhost:8080/login.html
```

Signup Page:

```
http://localhost:8080/signup.html
```

---

### 6️⃣ Open Database Console

```
http://localhost:8080/h2-console
```

Use:

```
JDBC URL: jdbc:h2:mem:parkease
User: sa
Password: (empty)
```

---

## ⚠️ Important Note About H2 Database

This project currently uses an **in-memory database**.

Meaning:

* Data exists only while the server is running.
* Restarting the app clears the database.

This is intentional for development.

---

## 👨‍💻 Contribution Workflow

To maintain clean collaboration, follow these rules.

---

### ✅ Step 1 — Pull Latest Code

Before starting work:

```bash
git pull origin main
```

---

### ✅ Step 2 — Create Your Own Branch

Never work directly on main.

```bash
git checkout -b feature/your-feature-name
```

Example:

```
feature/dashboard-ui
feature-booking-system
```

---

### ✅ Step 3 — Make Changes

Implement your feature.

---

### ✅ Step 4 — TEST BEFORE PUSHING (MANDATORY)

Always verify:

* Application starts successfully
* Login/Signup works
* No backend errors
* Console shows no crashes

Run:

```bash
.\mvnw.cmd spring-boot:run
```

Only proceed if the app works.

---

### ✅ Step 5 — Commit Changes

```bash
git add .
git commit -m "Added dashboard UI"
```

---

### ✅ Step 6 — Push Branch

```bash
git push origin feature/your-feature-name
```

---

### ✅ Step 7 — Update CONTRIBUTIONS File

After pushing, add your work inside:

```
CONTRIBUTIONS.md
```

Example:

```
Teammate Name:
- Implemented dashboard layout
- Added parking slot cards
- Improved UI responsiveness
```

---

### ✅ Step 8 — Create Pull Request

Open GitHub → Create Pull Request → Merge after review.

---

## 🚫 Team Rules

* ❌ Do NOT push broken code
* ❌ Do NOT commit secrets/passwords
* ❌ Do NOT work directly on main branch
* ✅ Always test locally first
* ✅ Keep commits meaningful
* ✅ Update CONTRIBUTIONS.md after work

---

## 🚀 Upcoming Features

* Smart Parking Dashboard
* Slot Booking System
* Admin Panel
* Role-Based Access
* Persistent MySQL Database
* Live Slot Availability

---

## 👥 Team Collaboration Goal

Each member works independently on features while maintaining:

* Clean architecture
* Stable application
* Clear contribution history

---

## 📌 Project Objective

Build a **realistic smart parking platform** demonstrating:

* Full-stack development
* Backend API design
* Database integration
* Team collaboration practices

---

## ⭐ Maintained For

**Infosys Virtual Internship Project**
