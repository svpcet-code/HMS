# HMS - Hospital Management System

A modern, full-stack Hospital Management System (HMS) built with **Next.js 15**, **Prisma**, and **PostgreSQL**. This system provides a comprehensive dashboard for managing patients, doctors, appointments, and hospital infrastructure with a focus on security and performance.

## 🚀 App Architecture

The system is built using the **Next.js App Router** architecture, leveraging Server Actions for secure database communication and NextAuth for robust authentication.

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js (App Router), React, TypeScript |
| **Styling** | Tailwind CSS, Shadcn UI (Radix UI) |
| **Database** | PostgreSQL |
| **ORM** | Prisma (v7+) |
| **Authentication** | NextAuth.js (Credentials Provider) |
| **Icons** | Lucide React |

## ✨ Core Features

### 1. Authentication Suite
- **Secure Login/Logout**: Role-based access control.
- **User Registration**: Create new accounts for Patients or Staff.
- **Forgot Password**: Password reset workflow with secure token generation (Simulated Email Mode).

### 2. Dashboard Modules
- **Patients Management**: Add and view patient records, including contact info and blood group.
- **Doctors Directory**: Manage medical staff profiles linked to user accounts.
- **Appointments System**: Real-time booking linking doctors and patients with status tracking.
- **Infrastructure Management**: Track Beds, Blood Bank, and Laboratory events.

## 🛠️ Database Schema (pgAdmin)

The project uses a structured relational database. Key tables include:

- **User**: Stores authentication credentials and roles (Admin, Doctor, Patient).
- **Patient**: Patient profiles linked to user records.
- **Doctor**: Medical staff details linked to user records.
- **Appointment**: Junction table linking Patients, Doctors, and Timestamps.
- **Bed & Admission**: Tracks hospital room availability and patient stays.

## 🚀 Getting Started

### Prerequisites
- Node.js installed.
- PostgreSQL running locally (default port 5432).

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd DBMS(HMS)
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/hms_db"
   NEXTAUTH_SECRET="your_secret_key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Database Sync**:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 📈 Usage in pgAdmin
To view your data in pgAdmin:
1. Connect to your `hms_db`.
2. Navigate to **Schemas > public > Tables**.
3. Right-click any table (e.g., `User`) and select **View/Edit Data > All Rows**.

---

Developed with ❤️ for Advanced Hospital Management.
