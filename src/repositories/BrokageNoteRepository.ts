export type BrokageNote = {
  date: string
}

export type BrokageNoteData = {
  rows: string[]
}

export default interface BrokageNoteRepository {

  retrieveData(note: BrokageNote): Promise<BrokageNoteData>
}