import React from 'react'

export default function Accounts({ user }) {
  return (
    <div className="accounts-page">
      <h2>Accounts</h2>
      <div className="account-card">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Account Type:</strong> Savings</p>
        <p><strong>Account Number:</strong> ****1234</p>
        <p><strong>Balance:</strong> ${user.balance.toFixed(2)}</p>
      </div>

      <h3 style={{ marginTop: '1.25rem' }}>Recent Transactions</h3>
      <div className="transactions-list">
        {user.transactions && user.transactions.length > 0 ? (
          user.transactions.map((tx, i) => (
            <div key={i} className={`transaction-item ${tx.type}`}>
              <div className="transaction-info">
                <span className="transaction-type">{tx.type === 'deposit' ? '💳' : '💰'} {tx.type}</span>
                <span className="transaction-date">{tx.date}{tx.description ? ' - ' + tx.description : ''}</span>
              </div>
              <span className={`transaction-amount ${tx.type === 'deposit' ? 'green' : 'red'}`}>{tx.type === 'deposit' ? '+' : '-'}${tx.amount.toFixed(2)}</span>
            </div>
          ))
        ) : (
          <p style={{ color: 'var(--text-secondary)' }}>No transactions yet.</p>
        )}
      </div>
    </div>
  )
}
