import Position from '../../entities/Position'
import Wallet from '../../entities/Wallet'
import PositionsRepository from '../../externals/repositories/PositionsRepository'
import RetrieveQuoteService from '../../externals/services/RetrieveQuoteService/RetrieveQuoteService'
import { QuoteResultDTO } from './UpdateQuotesDTO'

export default class UpdateQuotesUseCase {
  constructor(
    private positionsRepository: PositionsRepository,
    private retrieveQuoteService: RetrieveQuoteService
  ) { }

  async execute(walletId: string) {
    const wallet = new Wallet(walletId)
    const positions = await this.positionsRepository.getAllPositionsFromWallet(walletId)
    wallet.setPositions(positions)
    if (wallet.validate()) {
      const dataFromTickers = this.extractTickerDataFromPositions(wallet.getPositions())
      const result: QuoteResultDTO[] = []
      for(const item of dataFromTickers) {
        const value = await this.retrieveQuoteService.getCurrentPrice(item.ticker, item.currency)
        result.push({ value, ticker: item.ticker })
      }
      for (const item of result) {
        await this.positionsRepository.updateCurrentPrice(walletId, item.ticker, item.value)
      }
    }
  }

  private extractTickerDataFromPositions(positions: Position[]) {
    return positions.map((item) => ({ ticker: item.getTicker(), currency: item.getCurrency() }))
  }
}