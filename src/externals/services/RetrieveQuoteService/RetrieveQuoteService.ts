export default interface RetrieveQuoteService {
  getCurrentPrice(ticker: string, currency: string): Promise<number>
}