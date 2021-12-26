export type BrokageNote = {
  date: string
}

export type OrderType = 'sell' | 'buy'

export type FinancialProperties = {
  description: string,
  unitaryPrice: number,
  quantity: Number,
  totalPrice: number
}

export type Order = {
  description: string,
  unitaryPrice: number,
  quantity: Number,
  totalPrice: number,
  type: OrderType,
  date: string
}