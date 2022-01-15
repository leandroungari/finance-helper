import { UploadedFile } from 'express-fileupload'
import BrokageNotesFileRepository from '../../externals/repositories/BrokageNotesFileRepository'
import BrokageNotesFileRepositoryClear from '../../externals/repositories/BrokageNotesFileRepositoryClear'
import BrokageNotesRepository from '../../externals/repositories/BrokageNotesRepository'
import BrokageNotesRepositoryPostgres from '../../externals/repositories/BrokageNotesRepositoryPostgres'
import UploadBrokageNotesUseCase from './UploadBrokageNotesUseCase'

export default class UploadBrokageNotesController {
  private brokageNotesRepository: BrokageNotesRepository
  private brokageNotesFileRepository: BrokageNotesFileRepository

  constructor() {
    this.brokageNotesFileRepository = new BrokageNotesFileRepositoryClear()
    this.brokageNotesRepository = new BrokageNotesRepositoryPostgres()
  }

  async handle(walletId: string, files: UploadedFile[]) {
    const useCase = new UploadBrokageNotesUseCase(
      this.brokageNotesFileRepository,
      this.brokageNotesRepository,
    )
    return await useCase.execute(walletId, files)
  }

}