declare module 'jsonx' {
  export interface JXMObject {
    component: string
    props?: Record<string, unknown>
    children?: JXMObject | JXMObject[] | string | number | boolean | null
  }

  export function getReactElement(jxm: JXMObject, options?: Record<string, unknown>): React.ReactElement
  export function getReactElementFromJSONX(jxm: JXMObject, options?: Record<string, unknown>): React.ReactElement
  export function outputJSX(jxm: JXMObject, resources?: Record<string, unknown>): string
  export function outputHTML(config: { jsonx: JXMObject; resources?: Record<string, unknown> }): string
  export function jsonToJSX(jxm: JXMObject, options?: Record<string, unknown>): string
  export function jsonxRender(config: { jsonx: JXMObject; querySelector: string; resources?: Record<string, unknown> }): void

  const jsonx: {
    outputJSX: typeof outputJSX
    outputHTML: typeof outputHTML
    getReactElement: typeof getReactElement
    getReactElementFromJSONX: typeof getReactElementFromJSONX
    jsonToJSX: typeof jsonToJSX
    jsonxRender: typeof jsonxRender
  }

  export default jsonx
}
