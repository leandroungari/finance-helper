import { UploadedFile } from 'express-fileupload'
import BrokageNotesFileRepository from '../../externals/repositories/BrokageNotesFileRepository'
import BrokageNotesRepository from '../../externals/repositories/BrokageNotesRepository'

export default class UploadBrokageNotesUseCase {
  
  constructor(
    private brokageNotesFileRepository: BrokageNotesFileRepository,
    private brokageNotesRepository: BrokageNotesRepository
  ) {}

  public async execute(walletId: string, files: UploadedFile[]) {
    const names = await this.brokageNotesFileRepository.upload(walletId, files)
    const dates = this.extractFilenames(names)
    await this.brokageNotesRepository.registerNotes(walletId, dates)
  }

  private extractFilenames(names: string[]) {
    return names.map((name) => new Date(name.replace('.pdf', '')))
  }
}