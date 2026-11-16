import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import './App.css'

const API = `${import.meta.env.VITE_API_URL ?? 'http://localhost:5001'}/api/emails`

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState('Scheduled')

  const [sender, setSender] = useState('')
  const [recipient, setRecipient] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')

  const [scheduledEmails, setScheduledEmails] = useState([])
  const [sentEmails, setSentEmails] = useState([])
  const [loading, setLoading] = useState(false)

  const userId = '37261c7b-2bcb-4f9e-bddc-e89bf90528af'
  const senderId = 'f118cd9c-76e9-4154-9e3a-93a0dead8fea'

  // ---------- Validation ----------
  const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
  const nowLocal = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16)

  const valid =
    isEmail(sender) &&
    isEmail(recipient) &&
    subject.trim() !== '' &&
    body.trim() !== '' &&
    scheduledAt !== '' &&
    new Date(scheduledAt) > new Date()

  // ---------- Fetching ----------
  const fetchScheduledEmails = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API}/scheduled?userId=${userId}`)
      const data = await response.json()
      if (!response.ok) {
        console.error(data.message)
        return
      }
      setScheduledEmails(data)
    } catch (error) {
      console.error('Failed to fetch scheduled emails:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSentEmails = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API}/sent?userId=${userId}`)
      const data = await response.json()
      if (!response.ok) {
        console.error(data.message)
        return
      }
      setSentEmails(data)
    } catch (error) {
      console.error('Failed to fetch sent emails:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!loggedIn) return
    if (activeTab === 'Scheduled') fetchScheduledEmails()
    if (activeTab === 'Sent') fetchSentEmails()
  }, [loggedIn, activeTab])

  // ---------- Actions ----------
  const handleScheduleEmail = async () => {
    if (!valid) {
      toast.error('Please fill in all fields with a valid future time')
      return
    }

    try {
      const response = await fetch(`${API}/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          senderId,
          recipient,
          subject,
          body,
          scheduledAt: new Date(scheduledAt).toISOString(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || 'Failed to schedule email')
        return
      }

      toast.success('Email scheduled')

      setSender('')
      setRecipient('')
      setSubject('')
      setBody('')
      setScheduledAt('')

      await fetchScheduledEmails()
      setActiveTab('Scheduled')
    } catch (error) {
      console.error(error)
      toast.error('Could not connect to the backend')
    }
  }

  const handleCancel = async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, { method: 'DELETE' })
      if (!response.ok) {
        toast.error('Could not cancel')
        return
      }
      toast.success('Cancelled')
      fetchScheduledEmails()
    } catch (error) {
      console.error(error)
      toast.error('Could not connect to the backend')
    }
  }

  // ---------- Reusable card ----------
  const renderCard = (email, timeLabel, timeValue, canCancel) => (
    <div className="email-card" key={email.id}>
      <div className="email-card-header">
        <strong>{email.subject}</strong>
        <span className={`badge ${String(email.status).toLowerCase()}`}>
          {email.status}
        </span>
      </div>

      <p className="meta">
        <strong>To:</strong> {email.recipient} · <strong>From:</strong>{' '}
        {email.sender?.email ?? email.senderId}
      </p>

      <p className="meta">
        <strong>{timeLabel}:</strong>{' '}
        {timeValue ? new Date(timeValue).toLocaleString() : 'N/A'}
      </p>

      <p className="email-body">
        {email.body.length > 120 ? email.body.slice(0, 120) + '…' : email.body}
      </p>

      {canCancel && email.status === 'SCHEDULED' && (
        <button className="cancel-email" onClick={() => handleCancel(email.id)}>
          Cancel
        </button>
      )}
    </div>
  )

  // ---------- Login screen ----------
  if (!loggedIn) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h1>Login</h1>

          <button className="google-button">
            <span>G</span>
            Login with Google
          </button>

          <div className="divider">
            <span>or login with email</span>
          </div>

          <input type="email" placeholder="Email ID" />
          <input type="password" placeholder="Password" />

          <button className="login-button" onClick={() => setLoggedIn(true)}>
            Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <Toaster />

      {/* Sidebar */}
      <aside className="sidebar">
        <h2>ONE</h2>

        <div className="user-box">
          <div className="avatar">A</div>
          <div>
            <strong>Admin</strong>
            <p>admin@example.com</p>
          </div>
        </div>

        <nav>
          <button
            className={activeTab === 'Scheduled' ? 'active' : ''}
            onClick={() => setActiveTab('Scheduled')}
          >
            📅 Scheduled
          </button>

          <button
            className={activeTab === 'Sent' ? 'active' : ''}
            onClick={() => setActiveTab('Sent')}
          >
            ✉️ Sent
          </button>
        </nav>

        <button className="logout-button" onClick={() => setLoggedIn(false)}>
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === 'Compose' ? (
          <>
            <header className="top-header">
              <div>
                <h1>Compose New Email</h1>
                <p>Create and schedule an email</p>
              </div>

              <button
                className="cancel-button"
                onClick={() => setActiveTab('Scheduled')}
              >
                Cancel
              </button>
            </header>

            <section className="compose-section">
              <div className="compose-form">
                <label>Sender</label>
                <input
                  type="email"
                  placeholder="sender@example.com"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                />

                <label>Recipient</label>
                <input
                  type="email"
                  placeholder="recipient@example.com"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />

                <label>Subject</label>
                <input
                  type="text"
                  placeholder="Enter subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />

                <label>Email Body</label>
                <textarea
                  placeholder="Write your email..."
                  rows="8"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />

                <label>Schedule Date & Time</label>
                <input
                  type="datetime-local"
                  min={nowLocal}
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                />

                <button
                  className="schedule-button"
                  onClick={handleScheduleEmail}
                  disabled={!valid}
                >
                  Schedule Email
                </button>
              </div>
            </section>
          </>
        ) : (
          <>
            <header className="top-header">
              <div>
                <h1>{activeTab} Emails</h1>
                <p>Manage your emails</p>
              </div>

              <button
                className="compose-button"
                onClick={() => setActiveTab('Compose')}
              >
                + Compose New Email
              </button>
            </header>

            <section className="email-section">
              {/* SCHEDULED */}
              {activeTab === 'Scheduled' && (
                <>
                  <div className="section-header">
                    <h2>Scheduled Emails</h2>
                    <span>{scheduledEmails.length} emails</span>
                  </div>

                  {loading ? (
                    <div className="empty-state">
                      <p>Loading…</p>
                    </div>
                  ) : scheduledEmails.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">📭</div>
                      <h3>No scheduled emails</h3>
                      <p>Your scheduled emails will appear here.</p>
                    </div>
                  ) : (
                    <div className="email-list">
                      {scheduledEmails.map((email) =>
                        renderCard(email, 'Scheduled', email.scheduledAt, true)
                      )}
                    </div>
                  )}
                </>
              )}

              {/* SENT */}
              {activeTab === 'Sent' && (
                <>
                  <div className="section-header">
                    <h2>Sent Emails</h2>
                    <span>{sentEmails.length} emails</span>
                  </div>

                  {loading ? (
                    <div className="empty-state">
                      <p>Loading…</p>
                    </div>
                  ) : sentEmails.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">📨</div>
                      <h3>No sent emails</h3>
                      <p>Your sent emails will appear here.</p>
                    </div>
                  ) : (
                    <div className="email-list">
                      {sentEmails.map((email) =>
                        renderCard(email, 'Sent', email.sentAt, false)
                      )}
                    </div>
                  )}
                </>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default App