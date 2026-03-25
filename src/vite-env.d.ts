/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADMIN_PIN?: string
  /** Optionnel : numéro WhatsApp boutique (chiffres, ex. +212655363549). Si absent ou invalide, le défaut du code est utilisé. */
  readonly VITE_WHATSAPP_PHONE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
