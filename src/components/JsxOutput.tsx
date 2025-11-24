import Editor from '@monaco-editor/react'
import './JsxOutput.css'

interface JsxOutputProps {
  value: string
  error?: string
}

export default function JsxOutput({ value, error }: JsxOutputProps) {
  return (
    <div className={`jsx-output glass-card ${error ? 'has-error' : ''}`}>
      <div className="panel-header">
        <span className="panel-label">JSX OUTPUT</span>
        <span className="panel-hint">Ready for React</span>
      </div>
      <div className="editor-container">
        <Editor
          height="100%"
          defaultLanguage="typescript"
          value={value}
          theme="vs"
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'var(--font-mono)',
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            padding: { top: 16, bottom: 16 },
            renderLineHighlight: 'none',
            smoothScrolling: true,
            domReadOnly: true,
          }}
        />
      </div>
      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}
    </div>
  )
}
