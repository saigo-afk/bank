import React, { useState } from 'react'

export default function Settings({ user, setUser, onLogout }) {
  const [name, setName] = useState(user.name || '')
  const [email, setEmail] = useState(user.email || '')
  const [phone, setPhone] = useState(user.phone || '')
  const [password, setPassword] = useState(user.password || '')
  const [msg, setMsg] = useState(null)

  const handleSave = (e) => {
    e.preventDefault()
    const users = JSON.parse(localStorage.getItem('users')) || []
    const idx = users.findIndex(u => u.id === user.id)
    if (idx !== -1) {
      users[idx] = { ...users[idx], name, email, phone, password }
      localStorage.setItem('users', JSON.stringify(users))
      const updated = { ...users[idx] }
      localStorage.setItem('currentUser', JSON.stringify(updated))
      if (setUser) setUser(updated)
      setMsg('Settings saved')
    } else {
      setMsg('Unable to update settings')
    }
  }

  return (
    <div className="settings-page">
      <h2>Settings</h2>
      <form className="settings-form" onSubmit={handleSave}>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Phone
          <input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>

        <div style={{ marginTop: '12px' }}>
          <button className="btn" type="submit">Save</button>
          <button type="button" className="btn btn-logout" style={{ marginLeft: '8px' }} onClick={onLogout}>Logout</button>
        </div>
      </form>
      {msg && <p style={{ marginTop: '8px' }}>{msg}</p>}
    </div>
  )
}
