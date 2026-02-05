import { useState } from 'react'

export default function TransactionModal({ isOpen, type, onClose, onConfirm }) {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('card')

  const handleSubmit = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount')
      return
    }
    onConfirm({
      amount: parseFloat(amount),
      description: description || (type === 'deposit' ? 'Deposit' : 'Withdrawal'),
      paymentMethod
    })
    setAmount('')
    setDescription('')
    setPaymentMethod('card')
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{type === 'deposit' ? '💳 Deposit Funds' : '💰 Withdraw Funds'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="amount">Amount ($)</label>
            <input
              type="number"
              id="amount"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.01"
              step="0.01"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <input
              type="text"
              id="description"
              placeholder="e.g., Salary deposit"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="method">Payment Method</label>
            <select
              id="method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="card">Debit Card</option>
              <option value="bank">Bank Transfer</option>
              <option value="check">Check</option>
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Confirm {type === 'deposit' ? 'Deposit' : 'Withdrawal'}
          </button>
        </div>
      </div>
    </div>
  )
}
