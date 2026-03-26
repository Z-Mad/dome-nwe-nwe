// hooks/useProfile.ts
import { useState } from 'react'
import type { Account } from '@/types'
import type { ProfileData } from '../types/settings'

export const useProfile = (currentAccount: Account) => {
  const [profile, setProfile] = useState<ProfileData>({
    nickname: currentAccount.name,
    email: 'engineer@baosight.com',
    phone: '138****8888',
    orgName: currentAccount.orgName,
    isVerified: true,
  })

  const updateProfile = (updates: Partial<ProfileData>) => {
    setProfile(prev => ({ ...prev, ...updates }))
  }

  return { profile, updateProfile, setProfile }
}