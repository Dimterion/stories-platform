/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STORIES_SAMPLES_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
