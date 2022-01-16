
export default interface BrokageNotesRepository {

  registerNotes(walletId: string, dates: Date[]): Promise<boolean>

  getNotProcessedNotes(walletId: string, limit: number): Promise<Date[]>

  markNotesAsProcessed(walletId: string, dates: Date[]): Promise<boolean>
}