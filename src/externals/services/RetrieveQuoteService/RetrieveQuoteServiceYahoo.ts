import yahooFinance from 'yahoo-finance2'
import RetrieveQuoteService from './RetrieveQuoteService'

export default class RetrieveQuoteServiceYahoo
  implements RetrieveQuoteService {

  async getCurrentPrice(ticker: string, currency: string): Promise<number> {
    let quote = ''
    if (currency === 'BRL') quote = `${ticker}.SA`
    else quote = ticker
    const result = await yahooFinance.quote(quote)
    if (result) return result.regularMarketPrice!
    return 0
  }
}