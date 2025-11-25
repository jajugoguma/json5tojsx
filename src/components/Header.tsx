import './Header.css'

interface HeaderProps {
  onConvert?: () => void
  onCopy?: () => void
  onPreview?: () => void
}

export default function Header({ onConvert, onCopy, onPreview }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-text">
          <h1 className="header-title">JSON5 → JSX</h1>
          <p className="header-subtitle">
            Transform structured data into elegant React components
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-convert" onClick={onConvert}>
            <span className="btn-icon">✦</span>
            Convert
          </button>
          <button className="btn btn-preview" onClick={onPreview}>
            <span className="btn-icon">👁️</span>
            Preview
          </button>
          <button className="btn btn-copy" onClick={onCopy}>
            <span className="btn-icon">◇</span>
            Copy JSX
          </button>
        </div>
      </div>
    </header>
  )
}
