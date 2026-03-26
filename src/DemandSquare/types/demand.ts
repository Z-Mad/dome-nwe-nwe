// types/demand.ts
export interface Demand {
  id: number
  title: string
  enterprise: string
  budget: string
  location: string
  deadline: string
  tags: string[]
  desc: string
  status: 'open' | 'urgent'
}