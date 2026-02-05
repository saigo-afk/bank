export default function SuccessPopup({ isOpen, type, amount, description, balance, onClose }) {
  if (!isOpen) return null

  const typeText = type === 'deposit' ? 'Deposit' : 'Withdrawal'

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content success-popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-icon success">✓</div>
        <h3>{typeText} Successful! 🎉</h3>
        <p>Your {type} of ${amount.toFixed(2)} has been processed successfully.</p>
        
        <div className="popup-details">
          <div className="detail-row">
            <span><strong>Transaction Type:</strong></span>
            <span>{typeText}</span>
          </div>
          <div className="detail-row">
            <span><strong>Amount:</strong></span>
            <span>${amount.toFixed(2)}</span>
          </div>
          <div className="detail-row">
            <span><strong>Description:</strong></span>
            <span>{description}</span>
          </div>
          <div className="detail-row">
            <span><strong>Date & Time:</strong></span>
            <span>{new Date().toLocaleString()}</span>
          </div>
          <div className="detail-row highlight">
            <span><strong>New Balance:</strong></span>
            <span>${balance.toFixed(2)}</span>
          </div>
        </div>
        
        <button className="btn btn-primary" onClick={onClose}>Done</button>
      </div>
    </div>
  )
}
