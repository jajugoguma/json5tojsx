import { useState, useCallback, useEffect } from 'react'
import JSON5 from 'json5'
import { outputJSX } from 'jsonx'
import * as prettier from 'prettier/standalone'
import * as prettierPluginBabel from 'prettier/plugins/babel'
import * as prettierPluginEstree from 'prettier/plugins/estree'
import Header from './components/Header'
import JsonInput from './components/JsonInput'
import JsxOutput from './components/JsxOutput'
import PreviewModal from './components/PreviewModal'
import './App.css'

const DEFAULT_JXM = `{
  // JSON5 supports comments!
  component: "div",
  props: {
    className: "user-card",
  },
  children: [
    {
      component: "h1",
      children: "Hello, World!"
    },
    {
      component: "p",
      props: {
        className: "description"
      },
      children: "This is a paragraph"
    },
    {
      component: "button",
      props: {
        className: "btn-primary",
        disabled: false,
      },
      children: "Click Me"
    },
  ],
}`

interface ConversionResult {
  success: boolean
  jsx: string
  error?: string
}

const PRETTIER_OPTIONS = {
  parser: 'babel',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins: [prettierPluginBabel, prettierPluginEstree] as any,
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  quoteProps: 'as-needed' as const,
  jsxSingleQuote: false,
  trailingComma: 'all' as const,
  arrowParens: 'always' as const,
  endOfLine: 'lf' as const,
  bracketSpacing: true,
  bracketSameLine: false,
  singleAttributePerLine: true,
}

function formatJsxOutput(jsxString: string): string {
  // Fix [object Object] issues by replacing them with properly serialized objects
  // This is a workaround for jsonx's outputJSX not properly serializing nested objects
  return jsxString.replace(/\{(\[object Object\])\}/g, '{{/* object */}}')
}

async function convertToJsx(input: string): Promise<ConversionResult> {
  if (!input.trim()) {
    return {
      success: true,
      jsx: '// Enter JXM (JSONX Markup) in the left panel'
    }
  }

  try {
    const jxm = JSON5.parse(input)
    let jsxOutput = outputJSX(jxm)

    // Post-process to fix object serialization issues
    jsxOutput = formatJsxOutput(jsxOutput)

    const rawJsx = `function Component() {
  return (
    ${jsxOutput}
  );
}

export default Component;`

    // Format with prettier
    const formattedJsx = await prettier.format(rawJsx, PRETTIER_OPTIONS)

    return {
      success: true,
      jsx: formattedJsx
    }
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error'
    return {
      success: false,
      jsx: `// Error: ${error}`,
      error
    }
  }
}

function App() {
  const [jsonInput, setJsonInput] = useState(DEFAULT_JXM)
  const [result, setResult] = useState<ConversionResult>({
    success: true,
    jsx: '// Converting...'
  })
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  useEffect(() => {
    let cancelled = false

    convertToJsx(jsonInput).then((res) => {
      if (!cancelled) {
        setResult(res)
      }
    })

    return () => {
      cancelled = true
    }
  }, [jsonInput])

  const handleInputChange = useCallback((value: string) => {
    setJsonInput(value)
  }, [])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(result.jsx)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [result.jsx])

  const handleConvert = useCallback(() => {
    // Conversion happens automatically via useEffect
    // This button can be used for visual feedback or future manual conversion mode
  }, [])

  const handlePreview = useCallback(() => {
    setIsPreviewOpen(true)
  }, [])

  return (
    <div className="app">
      <Header onConvert={handleConvert} onCopy={handleCopy} onPreview={handlePreview} />
      <main className="main-content">
        <div className="editor-grid">
          <JsonInput value={jsonInput} onChange={handleInputChange} />
          <JsxOutput
            value={result.jsx}
            error={result.error}
          />
        </div>
      </main>
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        jsxCode={result.jsx}
      />
    </div>
  )
}

export default App
