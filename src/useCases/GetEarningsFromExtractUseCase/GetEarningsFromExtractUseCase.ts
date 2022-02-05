import EarningsRepository from '../../externals/repositories/EarningsRepository'
import ExtractFileRepository from '../../externals/repositories/ExtractFileRepository'

export default class GetEarningsFromExtractUseCase {

  constructor(
    private extractFileRepository: ExtractFileRepository,
    private earningsRepository: EarningsRepository
  ) {}

  async execute(walletId: string, content: string) {
    const items = await this.extractFileRepository.extractEarnings(content)
    await this.earningsRepository.saveEarnings(walletId, items)
  }
}