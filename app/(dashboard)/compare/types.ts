export interface TenantConfig {
  [key: string]: any
}

export interface Tenant {
  id: string
  name: string
  config: TenantConfig
}

export interface TenantVersion {
  id: string
  version: number
  note: string | null
  config: TenantConfig
  savedAt: string
}
