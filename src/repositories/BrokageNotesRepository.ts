
export default interface BrokageNotesRepository {

  registerNotes(walletId: string, dates: Date[]): Promise<boolean>
}