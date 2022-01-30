import PositionsRepository from '../../externals/repositories/PositionsRepository'

export default class GetPositionsOfWalletUseCase {

  constructor(
    private positionsRepository: PositionsRepository
  ) {}

  async execute(walletId: string, onlyActive: boolean) {
    const positions = await this.positionsRepository.getAllPositionsFromWallet(walletId, onlyActive)
    return positions
  }
}