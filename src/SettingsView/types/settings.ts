// types/settings.ts

export interface ApiKey {
  id: string
  name: string
  prefix: string
  environment: 'production' | 'sandbox'
  ipWhitelist: string
  expiration: string
  lastUsed: string
  status: 'active' | 'expired'
}

export interface ProfileData {
  nickname: string
  email: string
  phone: string
  orgName: string
  isVerified: boolean
}

export interface SecurityData {
  mfaEnabled: boolean
  lastPasswordChange: string
}

export interface NotificationsData {
  marketing: boolean
  productUpdate: boolean
  security: boolean
  transactional: boolean
}