import PositionsRepository from '../../externals/repositories/PositionsRepository'
import PositionsRepositoryPostgres from '../../externals/repositories/PositionsRepositoryPostgres'
import GetPositionsOfWalletUseCase from './GetPositionsOfWalletUseCase'

export default class GetPositionsOfWalletController {
  private positionsRepository: PositionsRepository
  constructor() {
    this.positionsRepository = new PositionsRepositoryPostgres()
  }

  async handle(walletId: string, notOnlyActive: boolean) {
    const useCase = new GetPositionsOfWalletUseCase(this.positionsRepository)
    return await useCase.execute(walletId, notOnlyActive)
  }
}