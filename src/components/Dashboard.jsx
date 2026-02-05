import { useState, useEffect } from 'react'
import TransactionModal from './TransactionModal'
import SuccessPopup from './SuccessPopup'
import ErrorPopup from './ErrorPopup'

export default function Dashboard({ user, setUser, onLogout }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [transactionType, setTransactionType] = useState('')
  const [successPopupOpen, setSuccessPopupOpen] = useState(false)
  const [errorPopupOpen, setErrorPopupOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [lastTransaction, setLastTransaction] = useState(null)

  const initializeDemoData = () => {
    const users = localStorage.getItem('users')
    if (!users) {
      const demoUsers = [
        {
          id: 1,
          name: 'John Doe',
          email: 'test@example.com',
          phone: '555-0123',
          password: 'password123',
          balance: 10500.00,
          transactions: [
            { type: 'deposit', amount: 500, date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), description: 'Salary' },
            { type: 'withdraw', amount: 200, date: new Date(Date.now() - 86400000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), description: 'ATM Withdrawal' },
            { type: 'deposit', amount: 1000, date: new Date(Date.now() - 172800000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), description: 'Transfer' }
          ]
        }
      ]
      localStorage.setItem('users', JSON.stringify(demoUsers))
    }
  }

  useEffect(() => {
    initializeDemoData()
  }, [])

  const handleOpenModal = (type) => {
    setTransactionType(type)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
  }

  const handleConfirmTransaction = (transactionData) => {
    const { amount, description, paymentMethod } = transactionData

    // Validation
    if (transactionType === 'withdraw' && amount > user.balance) {
      setErrorMessage(`Insufficient balance. Your balance is $${user.balance.toFixed(2)}`)
      setErrorPopupOpen(true)
      return
    }

    // Process transaction
    const newBalance = transactionType === 'deposit' 
      ? user.balance + amount 
      : user.balance - amount

    const transaction = {
      type: transactionType,
      amount: amount,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      description: description
    }

    const updatedUser = {
      ...user,
      balance: newBalance,
      transactions: [transaction, ...user.transactions]
    }

    setUser(updatedUser)
    localStorage.setItem('currentUser', JSON.stringify(updatedUser))

    // Update users database
    const users = JSON.parse(localStorage.getItem('users')) || []
    const userIndex = users.findIndex(u => u.id === user.id)
    if (userIndex !== -1) {
      users[userIndex].balance = newBalance
      users[userIndex].transactions = updatedUser.transactions
      localStorage.setItem('users', JSON.stringify(users))
    }

    setLastTransaction({
      type: transactionType,
      amount: amount,
      description: description,
      balance: newBalance
    })

    setModalOpen(false)
    setSuccessPopupOpen(true)
  }

  const calculateMonthlyStats = () => {
    const currentYear = new Date().getFullYear().toString()
    let totalDeposits = 0
    let totalWithdrawals = 0

    user.transactions.forEach(tx => {
      if (tx.date.includes(currentYear)) {
        if (tx.type === 'deposit') {
          totalDeposits += tx.amount
        } else {
          totalWithdrawals += tx.amount
        }
      }
    })

    return { totalDeposits, totalWithdrawals }
  }

  const { totalDeposits, totalWithdrawals } = calculateMonthlyStats()

  return (
    <div className="dashboard-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <h1>🏦 SecureBank</h1>
        </div>
        <div className="navbar-menu">
          <a href="#" className="nav-link active">Dashboard</a>
          <a href="#" className="nav-link">Accounts</a>
          <a href="#" className="nav-link">Transfers</a>
          <a href="#" className="nav-link">Settings</a>
        </div>
        <div className="navbar-user">
          <span id="user-greeting">Welcome, {user.name.split(' ')[0]}</span>
          <button className="btn btn-logout" onClick={onLogout}>Logout</button>
        </div>
      </nav>

      {/* Main Dashboard Content */}
      <div className="dashboard-main">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-section">
            <h3>Quick Actions</h3>
            <button className="sidebar-btn" onClick={() => handleOpenModal('deposit')}>💳 Deposit</button>
            <button className="sidebar-btn" onClick={() => handleOpenModal('withdraw')}>💰 Withdraw</button>
            <button className="sidebar-btn">📊 View Transactions</button>
          </div>
          <div className="sidebar-section">
            <h3>Account Info</h3>
            <p><strong>Account Type:</strong> Savings</p>
            <p><strong>Account Number:</strong> ****1234</p>
            <p><strong>Member Since:</strong> 2020</p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="dashboard-content">
          {/* Balance Section */}
          <div className="balance-section">
            <div className="balance-card primary">
              <div className="card-header">
                <h3>Total Balance</h3>
                <span className="card-icon">💰</span>
              </div>
              <p className="balance-amount">${user.balance.toFixed(2)}</p>
              <p className="balance-label">Available for transactions</p>
            </div>
            <div className="balance-card">
              <div className="card-header">
                <h3>This Month</h3>
                <span className="card-icon">📈</span>
              </div>
              <p className="balance-amount">${totalDeposits.toFixed(2)}</p>
              <p className="balance-label">Total deposits</p>
            </div>
            <div className="balance-card">
              <div className="card-header">
                <h3>Withdrawals</h3>
                <span className="card-icon">📉</span>
              </div>
              <p className="balance-amount">${totalWithdrawals.toFixed(2)}</p>
              <p className="balance-label">This month</p>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="transactions-section">
            <h2>Recent Transactions</h2>
            <div className="transactions-list">
              {user.transactions && user.transactions.length > 0 ? (
                user.transactions.map((tx, idx) => (
                  <div key={idx} className={`transaction-item ${tx.type}`}>
                    <div className="transaction-info">
                      <span className="transaction-type">
                        {tx.type === 'deposit' ? '💳' : '💰'} {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                      </span>
                      <span className="transaction-date">
                        {tx.date}{tx.description ? ' - ' + tx.description : ''}
                      </span>
                    </div>
                    <span className={`transaction-amount ${tx.type === 'deposit' ? 'green' : 'red'}`}>
                      {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </span>
                  </div>
                ))
              ) : (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No transactions yet</p>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={modalOpen}
        type={transactionType}
        onClose={handleCloseModal}
        onConfirm={handleConfirmTransaction}
      />

      {/* Success Popup */}
      {lastTransaction && (
        <SuccessPopup
          isOpen={successPopupOpen}
          type={lastTransaction.type}
          amount={lastTransaction.amount}
          description={lastTransaction.description}
          balance={lastTransaction.balance}
          onClose={() => setSuccessPopupOpen(false)}
        />
      )}

      {/* Error Popup */}
      <ErrorPopup
        isOpen={errorPopupOpen}
        message={errorMessage}
        onClose={() => setErrorPopupOpen(false)}
      />
    </div>
  )
}
