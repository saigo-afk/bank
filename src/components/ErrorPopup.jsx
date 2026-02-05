export default function ErrorPopup({ isOpen, message, onClose }) {
  if (!isOpen) return null

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content error-popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-icon error">✕</div>
        <h3>Error</h3>
        <p>{message}</p>
        <button className="btn btn-primary" onClick={onClose}>Close</button>
      </div>
    </div>
  )
}
