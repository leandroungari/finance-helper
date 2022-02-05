export type EarningTypeDTO = 'rendimento' | 'dividendo' | 'jscp' | 'cred-frac'

export type EarningDTO = {
  type: EarningTypeDTO,
  date: Date,
  value: number,
  ticker: string,
  currency: string
}