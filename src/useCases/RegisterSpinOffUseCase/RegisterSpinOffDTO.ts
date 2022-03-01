export type SpinOffDTO = {
  date: Date,
  currency: string,
  origin: {
    ticker: string,
    rate: number,
  },
  spin: NewEnterpriseDTO
}

export type NewEnterpriseDTO = {
  ticker: string,
  quantity: number,
  averagePrice: number,
}