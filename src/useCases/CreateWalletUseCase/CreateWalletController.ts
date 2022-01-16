import WalletRepository from '../../externals/repositories/WalletRepository'
import WalletRepositoryPostgres from '../../externals/repositories/WalletRepositoryPostgres'
import { WalletItemDTO } from './CreateWalletDTO'
import CreateWalletUseCase from './CreateWalletUseCase'

export default class CreateWalletController {

  private walletRepository: WalletRepository

  constructor() {
    this.walletRepository = new WalletRepositoryPostgres()
  }

  async handle(data: WalletItemDTO) {
    const useCase = new CreateWalletUseCase(this.walletRepository)
    return await useCase.execute(data.id, data.owner)
  }
}