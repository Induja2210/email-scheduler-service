# Email Scheduler

A full-stack app to schedule emails for a future date and time. Scheduled emails are stored in PostgreSQL and sent automatically by a background worker.

## Tech Stack

- **Frontend:** React (Vite), react-hot-toast
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Email delivery:** Nodemailer (Gmail SMTP)

## Features

- Schedule an email for a future date and time
- Separate **Scheduled** and **Sent** views with colored status badges
- **Cancel** a scheduled email before it is sent
- Validation on both frontend and backend (valid email, non-empty fields, time must be in the future)
- Toast notifications, loading states, and empty states
- Idempotency key per email to avoid duplicate sends

## How Scheduling Works

1. The frontend sends the email details to `POST /api/emails/schedule`.
2. The backend validates the input and saves the email in PostgreSQL with status `SCHEDULED`.
3. A background worker (`emailWorker.ts`) runs on a `setInterval`, finds emails with status `SCHEDULED` whose `scheduledAt` time has passed, sends them through Gmail SMTP, and marks them `SENT`.
4. Cancelling an email deletes it while it is still `SCHEDULED`, so the worker never picks it up.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/emails/scheduled?userId=` | List scheduled emails |
| GET | `/api/emails/sent?userId=` | List sent emails |
| POST | `/api/emails/schedule` | Schedule a new email |
| DELETE | `/api/emails/:id` | Cancel a scheduled email |

## Setup

### Prerequisites

- Node.js
- PostgreSQL
- A Gmail account with an [app password](https://support.google.com/accounts/answer/185833)

### Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DB_NAME"
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

Then run:

```bash
npx prisma migrate dev
npm run dev
```

The API runs on `http://localhost:5001`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Screenshots

![Scheduled emails](screenshots/scheduled.png)
![Compose email](screenshots/compose.png)

## Future Improvements

- Retries with backoff and a `FAILED` status
- Per-sender rate limiting
- Recurring emails and CSV bulk scheduling
- Real authentication (Google login) and showing the sender's email address