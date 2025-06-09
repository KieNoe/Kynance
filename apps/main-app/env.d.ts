/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_VERSION: string
  readonly VITE_FEATURE_TOGGLE: 'on' | 'off'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
