export type BrokageNote = {
  date: string
}

export type BrokageNoteData = {
  rows: string[]
}

export default interface BrokageNotesRepository {

  retrieveDataFromNote(note: BrokageNote): BrokageNoteData
}