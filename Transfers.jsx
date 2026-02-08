import React, { useState } from 'react'

export default function Transfers({ user, setUser }) {
  const [recipientEmail, setRecipientEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    setMessage(null)
    setError(null)

    const value = parseFloat(amount)
    if (!recipientEmail || isNaN(value) || value <= 0) {
      setError('Enter a valid recipient and amount')
      return
    }
    if (value > user.balance) {
      setError('Insufficient balance')
      return
    }

    const users = JSON.parse(localStorage.getItem('users')) || []
    const recipientIndex = users.findIndex(u => u.email === recipientEmail)
    if (recipientIndex === -1) {
      setError('Recipient not found')
      return
    }

    // update recipient
    users[recipientIndex].balance = (users[recipientIndex].balance || 0) + value
    users[recipientIndex].transactions = users[recipientIndex].transactions || []
    users[recipientIndex].transactions.unshift({ type: 'deposit', amount: value, date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), description: `Transfer from ${user.email}` })

    // update sender
    const currentIndex = users.findIndex(u => u.id === user.id)
    if (currentIndex !== -1) {
      users[currentIndex].balance = (users[currentIndex].balance || 0) - value
      users[currentIndex].transactions = users[currentIndex].transactions || []
      users[currentIndex].transactions.unshift({ type: 'withdraw', amount: value, date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), description: `Transfer to ${recipientEmail}` })
    }

    // persist
    localStorage.setItem('users', JSON.stringify(users))

    // update currentUser in localStorage and state
    const updatedCurrent = users.find(u => u.id === user.id) || { ...user }
    localStorage.setItem('currentUser', JSON.stringify(updatedCurrent))
    if (setUser) setUser(updatedCurrent)

    setMessage('Transfer completed')
    setRecipientEmail('')
    setAmount('')
  }

  return (
    <div className="transfers-page">
      <h2>Transfers</h2>
      <form className="transfer-form" onSubmit={handleSubmit}>
        <label>
          Recipient Email
          <input type="email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} required />
        </label>

        <label>
          Amount
          <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </label>

        <button className="btn" type="submit">Send Transfer</button>
      </form>

      {message && <p className="success-msg">{message}</p>}
      {error && <p className="error-msg">{error}</p>}
    </div>
  )
}
