import { UploadedFile } from 'express-fileupload'
import EarningsRepository from '../../externals/repositories/EarningsRepository'
import EarningsRepositoryPostgres from '../../externals/repositories/EarningsRepositoryPostgres'
import ExtractFileRepository from '../../externals/repositories/ExtractFileRepository'
import ExtractFileRepositoryClear from '../../externals/repositories/ExtractFileRepositoryClear'
import GetEarningsFromExtractUseCase from './GetEarningsFromExtractUseCase'

export default class GetEarningsFromExtractController {

  private extractFileRepository: ExtractFileRepository
  private earningsRepository: EarningsRepository

  constructor() {
    this.earningsRepository = new EarningsRepositoryPostgres()
    this.extractFileRepository = new ExtractFileRepositoryClear()
  }

  async handle(walletId: string, file: UploadedFile) {
    const useCase = new GetEarningsFromExtractUseCase(
      this.extractFileRepository,
      this.earningsRepository
    )
    return await useCase.execute(walletId, file.data.toString())
  }
}