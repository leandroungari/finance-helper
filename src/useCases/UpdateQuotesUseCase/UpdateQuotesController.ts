import PositionsRepository from '../../externals/repositories/PositionsRepository'
import PositionsRepositoryPostgres from '../../externals/repositories/PositionsRepositoryPostgres'
import RetrieveQuoteService from '../../externals/services/RetrieveQuoteService/RetrieveQuoteService'
import RetrieveQuoteServiceYahoo from '../../externals/services/RetrieveQuoteService/RetrieveQuoteServiceYahoo'
import UpdateQuotesUseCase from './UpdateQuotesUseCase'

export default class UpdateQuotesController {
  private positionsRepository: PositionsRepository
  private retrieveQuoteService: RetrieveQuoteService

  constructor() {
    this.positionsRepository = new PositionsRepositoryPostgres()
    this.retrieveQuoteService = new RetrieveQuoteServiceYahoo()
  }

  async handle(walletId: string) {
    const useCase = new UpdateQuotesUseCase(
      this.positionsRepository, 
      this.retrieveQuoteService
    )
    return await useCase.execute(walletId)
  }
}