import WalletRepository from '../../externals/repositories/WalletRepository'

export default class CreateWalletUseCase {

  constructor(
    private walletRepository: WalletRepository
  ) {}

  async execute(id: string, owner: string) {
    await this.walletRepository.createWallet(id, owner)
  }
}