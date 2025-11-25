import { useEffect, useState, useCallback } from 'react'
import * as Babel from '@babel/standalone'
import * as React from 'react'
import './PreviewModal.css'

interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
  jsxCode: string
}

export default function PreviewModal({ isOpen, onClose, jsxCode }: PreviewModalProps) {
  const [renderedContent, setRenderedContent] = useState<React.ReactNode>(null)
  const [error, setError] = useState<string | null>(null)

  const compileAndRender = useCallback(() => {
    if (!jsxCode || jsxCode.startsWith('//')) {
      setRenderedContent(<p className="preview-placeholder">No content to preview</p>)
      setError(null)
      return
    }

    try {
      // Extract just the return statement content
      const returnMatch = jsxCode.match(/return\s*\(\s*([\s\S]*?)\s*\);/m)
      if (!returnMatch) {
        throw new Error('Could not find JSX content in the code')
      }

      const jsxContent = returnMatch[1].trim()

      // Compile JSX to JavaScript
      const compiled = Babel.transform(`const element = ${jsxContent};`, {
        presets: ['react'],
        filename: 'preview.jsx',
      })

      if (!compiled.code) {
        throw new Error('Compilation failed')
      }

      // Create a function that returns the element
      const code = compiled.code.replace('const element = ', 'return ')

      // eslint-disable-next-line no-new-func
      const createElementFunc = new Function('React', code)
      const element = createElementFunc(React)

      setRenderedContent(element)
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      setRenderedContent(null)
    }
  }, [jsxCode])

  useEffect(() => {
    if (isOpen) {
      compileAndRender()
    }
  }, [isOpen, compileAndRender])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="modal-overlay animate-fadeIn" onClick={onClose}>
      <div
        className="modal-content glass-card animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">
            <span>👁️</span>
            Live Preview
          </h2>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          {error ? (
            <div className="preview-error">
              <span className="error-icon">⚠️</span>
              <div>
                <strong>Render Error</strong>
                <p>{error}</p>
              </div>
            </div>
          ) : (
            <div className="preview-content">{renderedContent}</div>
          )}
        </div>
      </div>
    </div>
  )
}
