import Editor, { type Monaco } from '@monaco-editor/react'
import './JsonInput.css'

interface JsonInputProps {
  value: string
  onChange: (value: string) => void
}

function handleEditorWillMount(monaco: Monaco) {
  // Disable JSON validation to support JSON5 syntax
  // (comments, trailing commas, unquoted keys, single quotes)
  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: false,
  })
}

export default function JsonInput({ value, onChange }: JsonInputProps) {
  return (
    <div className="json-input glass-card">
      <div className="panel-header">
        <span className="panel-label">JSON5 INPUT</span>
        <span className="panel-hint">Comments • Trailing commas • Unquoted keys</span>
      </div>
      <div className="editor-container">
        <Editor
          height="100%"
          defaultLanguage="json"
          value={value}
          onChange={(val) => onChange(val || '')}
          theme="vs"
          beforeMount={handleEditorWillMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'var(--font-mono)',
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            padding: { top: 16, bottom: 16 },
            renderLineHighlight: 'gutter',
            cursorBlinking: 'smooth',
            smoothScrolling: true,
          }}
        />
      </div>
    </div>
  )
}
