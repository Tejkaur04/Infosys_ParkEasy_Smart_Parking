# 🅿️ ParkWise — Smart Parking Spot Finder

A full-stack web application for finding, booking, and managing parking spots. Built with Spring Boot, React, and MySQL.

---

## 🗂️ Project Structure

```
smart-parking/
├── database/
│   └── schema.sql                  ← MySQL database schema + sample data
├── backend/
│   ├── pom.xml                     ← Maven dependencies
│   ├── application.yml             ← Spring Boot configuration
│   ├── entities.java               ← JPA entities (User, Booking, Payment, etc.)
│   ├── security.java               ← JWT auth, Spring Security config
│   ├── controllers.java            ← REST API controllers (all 6 pages)
│   └── services.java               ← Business logic services
└── frontend/
    └── SmartParkingApp.jsx         ← Complete React SPA (all 6 pages)
```

---

## 🗃️ Database Schema

### Tables & Relationships
```
users ──────────────────────────┐
  │                             │
  ├── vehicles                  │
  │                             │
  ├── bookings ─────────────────┤─── parking_spots ─── parking_locations
  │     │                       │
  │     └── payments            │
  │                             │
  ├── support_tickets           │
  ├── notifications             │
  └── reviews ─────────────────┘
```

| Table | Description |
|---|---|
| `users` | User accounts with roles (USER/ADMIN/OPERATOR) |
| `vehicles` | User's registered vehicles |
| `parking_locations` | Parking facilities with amenities & coords |
| `parking_spots` | Individual spots within a location |
| `bookings` | Reservations with status lifecycle |
| `payments` | Transaction records |
| `reviews` | User ratings for locations |
| `support_tickets` | Help desk tickets |
| `notifications` | User notification inbox |

---

## 🔧 Backend — Spring Boot

### Tech Stack
- **Spring Boot 3.2** + Java 17
- **Spring Security** with JWT (JJWT 0.12)
- **Spring Data JPA** + Hibernate
- **Flyway** for database migrations
- **Lombok** + MapStruct
- **MySQL 8**

### Project Package Structure
```
com.parkwise/
├── SmartParkingApplication.java
├── config/
│   └── AppConfig.java              ← Beans: PasswordEncoder, AuthManager
├── security/
│   ├── SecurityConfig.java         ← SecurityFilterChain, CORS
│   ├── JwtService.java             ← Token generation & validation
│   └── JwtAuthFilter.java         ← Per-request JWT filter
├── entity/                         ← JPA entities
│   ├── User.java (implements UserDetails)
│   ├── ParkingLocation.java
│   ├── ParkingSpot.java
│   ├── Booking.java
│   ├── Payment.java
│   ├── Vehicle.java
│   └── SupportTicket.java
├── repository/                     ← Spring Data JPA repos
├── service/                        ← Business logic
│   ├── AuthService.java
│   ├── BookingService.java
│   ├── PaymentService.java
│   ├── ParkingLocationService.java
│   ├── SupportService.java
│   ├── DashboardService.java
│   └── NotificationService.java
├── controller/                     ← REST endpoints
│   ├── AuthController.java
│   ├── BookingController.java
│   ├── PaymentController.java
│   ├── ParkingLocationController.java
│   ├── UserController.java
│   ├── SupportController.java
│   └── DashboardController.java
├── dto/                            ← Request/Response DTOs
└── exception/
    └── GlobalExceptionHandler.java
```

### REST API Endpoints

#### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, get JWT |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset with token |

#### Parking Locations (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/parking-locations/search` | Search with filters |
| GET | `/api/parking-locations/{id}` | Get location details |
| GET | `/api/parking-locations/{id}/spots` | Get spots with status |
| GET | `/api/parking-locations/nearby` | Find nearby locations |

#### Bookings (Authenticated)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings` | Get my bookings |
| GET | `/api/bookings/{id}` | Get booking details |
| POST | `/api/bookings/{id}/cancel` | Cancel booking |
| GET | `/api/bookings/active` | Get active booking |
| GET | `/api/bookings/stats` | Booking statistics |

#### Payments (Authenticated)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/process` | Process payment |
| GET | `/api/payments` | Payment history |
| GET | `/api/payments/{id}` | Payment details |
| POST | `/api/payments/{id}/refund` | Request refund |

#### User / Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/me` | Get profile |
| PUT | `/api/users/me` | Update profile |
| GET | `/api/dashboard` | Dashboard summary |
| GET | `/api/dashboard/spending` | Spending chart data |

#### Support
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/support/tickets` | Submit ticket (public) |
| GET | `/api/support/tickets` | My tickets |
| GET | `/api/support/faqs` | FAQ list |

---

## 🎨 Frontend — React SPA

### Pages & Components

| Page | Route | Features |
|------|-------|----------|
| **Landing** | `/` | Hero, features, how-it-works, CTA |
| **Search** | `/search` | Filters, list + map view, location cards |
| **Availability** | `/availability` | Interactive spot grid, booking summary |
| **Dashboard** | `/dashboard` | Stats, bookings, payments, profile tabs |
| **Payment** | `/payment` | Multi-step, card preview, order summary |
| **Help & Support** | `/help` | FAQ accordion, contact form |
| **Login/Register** | `/login` | Auth forms |

### Design System

**Color Palette:**
```css
--primary: #0A2540    /* Deep navy — authority, trust */
--accent:  #00C48C    /* Emerald green — available/action */
--danger:  #E53E3E    /* Red — warnings, cancellation */
--warning: #F6C90E    /* Yellow — reserved status */
--surface: #F7F9FC    /* Page background */
--border:  #DDE4EE    /* Subtle borders */
--text-muted: #6B7A99 /* Secondary text */
```

**Typography:**
- Headings: `DM Sans` (700/800 weight)
- Body: `DM Sans` (400/500)
- Code/References: `DM Mono`

**Component Library:**
- Buttons: primary, secondary, outline, ghost, danger (+ sm/lg/full variants)
- Cards: standard, flat, stat-card
- Forms: input, select, textarea with focus states
- Badges: green, red, yellow, blue, gray with dot indicator
- Tags: amenity chips
- Filter chips: toggle filters

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8+
- Maven 3.8+

### Backend Setup
```bash
# 1. Clone and configure
cd backend
cp src/main/resources/application.yml.example src/main/resources/application.yml
# Edit DB credentials

# 2. Create database
mysql -u root -p < ../database/schema.sql

# 3. Run
mvn spring-boot:run
# API available at http://localhost:8080/api
```

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm create vite@latest parkwise-ui -- --template react
cd parkwise-ui
npm install

# Copy SmartParkingApp.jsx into src/App.jsx
# Run
npm run dev
# App available at http://localhost:5173
```

### Environment Variables
```properties
# Backend
DB_USERNAME=root
DB_PASSWORD=your_password
JWT_SECRET=your-256-bit-secret-key-here

# Frontend (create .env)
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 🔐 Security Features

- JWT Bearer token authentication
- BCrypt password hashing (strength 12)
- Method-level authorization (`@PreAuthorize`)
- CORS configuration for frontend origin
- Input validation with Jakarta Validation
- Global exception handling with proper HTTP status codes
- Stateless session management
- SQL injection prevention via JPA/parameterized queries

---

## 🎯 Color-Coded Spot Status

| Status | Color | Meaning |
|--------|-------|---------|
| 🟢 AVAILABLE | Emerald | Ready to book |
| 🔴 OCCUPIED | Red | Currently in use |
| 🟡 RESERVED | Yellow | Pre-booked |
| ⬜ MAINTENANCE | Gray | Out of service |

---

## 📱 Responsive Breakpoints

- **Desktop:** 1200px+ — Full sidebar, 3-4 column grids
- **Tablet:** 768–1200px — 2 column grids, compact sidebar
- **Mobile:** <768px — Single column, hidden sidebar, stacked layouts

---

## 🔄 Booking Status Lifecycle

```
PENDING → CONFIRMED → ACTIVE → COMPLETED
                ↓
           CANCELLED
                ↓
           NO_SHOW
```

---

*Built with Spring Boot 3.2, React 18, MySQL 8*