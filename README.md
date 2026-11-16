# email-scheduler-service

**Developed by: Induja B**

A full-stack email scheduling system that allows users to compose, schedule, cancel, and automatically send emails at a specified date and time.

🔗 **Live Demo (Frontend):** [email-scheduler-frontend-li7b.onrender.com](https://email-scheduler-frontend-li7b.onrender.com)

🔌 **Backend API:** [email-scheduler-service-qirx.onrender.com](https://email-scheduler-service-qirx.onrender.com)

> **Note:** The app is hosted on Render's free tier, so the first load may take 30–60 seconds while the service wakes up.

## 🚀 Features

* User login interface
* Compose and send emails
* Schedule emails for a specific date and time
* **Cancel scheduled emails** before they are sent
* **Pop-up notifications** for actions such as scheduling, sending, cancelling, and errors
* **Confirmation pop-up** before cancelling a scheduled email
* Background worker for processing scheduled emails
* Automatic email sending using Gmail SMTP
* Sent email tracking
* Scheduled email management
* Prisma database integration
* Prisma Studio for database management
* REST API backend
* React frontend

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* JavaScript
* CSS

### Backend

* Node.js
* TypeScript
* Express.js
* Prisma ORM
* PostgreSQL

### Email Service

* Gmail SMTP
* Nodemailer
* Gmail App Password

### Deployment (Render)

| Service | Type | Purpose |
| --- | --- | --- |
| `email-scheduler-frontend` | Static Site | React + Vite frontend |
| `email-scheduler-service` | Web Service (Node) | Express REST API |
| `email-scheduler-db` | PostgreSQL 16 | Database |

The frontend reads the backend URL from the `VITE_API_URL` environment variable.

## 📁 Project Structure

```text
email-scheduler-service/
│
├── backend/
│   ├── src/
│   │   ├── workers/
│   │   │   └── emailWorker.ts
│   │   ├── services/
│   │   └── ...
│   ├── prisma/
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── ...
│   └── ...
│
└── README.md
```

## ⚙️ How It Works

```text
User
  ↓
Compose Email
  ↓
Schedule Email  ──→  Pop-up confirmation
  ↓
Database
  ↓
SCHEDULED  ──→  (Cancel button) ──→  CANCELLED
  ↓
Background Worker
  ↓
Gmail SMTP
  ↓
SENT
```

The application stores scheduled emails in the database. The background worker continuously checks for emails that are ready to be sent and sends them through Gmail SMTP. A scheduled email can be cancelled at any time before the worker sends it.

## 🔔 Pop-ups and Cancel Feature

### Pop-up notifications

The frontend shows pop-ups to give the user instant feedback:

* Email scheduled successfully
* Email sent successfully
* Email cancelled successfully
* Validation errors (for example, missing recipient, subject, or time)
* Failure messages if a request to the backend fails

### Cancel button

* Every email in the **Scheduled** list has a **Cancel** button.
* Clicking it opens a **confirmation pop-up** to prevent accidental cancellation.
* After confirming, the email status changes from `SCHEDULED` to `CANCELLED`, and the worker skips it.
* Emails that are already `SENT` cannot be cancelled.

## 📌 Email Status Flow

```text
              ┌──→ CANCELLED
              │   (user clicks Cancel)
SCHEDULED ────┤
              │
              └──→ Worker ──→ SEND ──→ SENT
```

| Status | Meaning |
| --- | --- |
| `SCHEDULED` | Waiting for its scheduled time |
| `SENT` | Delivered successfully by the worker |
| `CANCELLED` | Cancelled by the user before sending |

## 🧪 Testing

The system was tested by:

1. Creating scheduled emails through the frontend.
2. Verifying that a pop-up confirms the email was scheduled.
3. Checking the email records in Prisma Studio.
4. Cancelling a scheduled email and confirming the cancel pop-up and the `CANCELLED` status.
5. Running the email worker.
6. Confirming that the worker sends the remaining scheduled emails and skips cancelled ones.
7. Checking the email records through the backend API.
8. Confirming that the email status changes to `SENT`.
9. Displaying sent emails in the frontend.

## 🔑 Environment Variables

Create a `.env` file inside the `backend` folder and add the required database and Gmail configuration.

```env
DATABASE_URL="your_database_url"

GMAIL_USER="your_gmail_address"
GMAIL_APP_PASSWORD="your_16_character_app_password"
```

**Important:** Never upload your `.env` file or Gmail App Password to GitHub.

## ▶️ Running the Project

### Backend

Open a terminal and go to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Run the backend:

```bash
npm run dev
```

### Email Worker

Run the worker separately:

```bash
npx ts-node src/workers/emailWorker.ts
```

### Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Then open the local URL provided by Vite in your browser.

## 🗄️ Database

Prisma is used to manage the PostgreSQL database.

To open Prisma Studio:

```bash
npx prisma studio
```

Prisma Studio allows you to view and manage records such as:

* Users
* Senders
* Emails
* Email status (`SCHEDULED`, `SENT`, `CANCELLED`)
* Scheduled time
* Sent time

## 👩‍💻 Author

**Induja B**

Full-Stack Email Scheduling System
