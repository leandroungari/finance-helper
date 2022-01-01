import { readFileSync } from 'fs'
import pdf from 'pdf-parse'
import BrokageNoteRepository, { BrokageNote, BrokageNoteData } from './BrokageNoteRepository'

export default class BrokageNoteRepositoryFile
  implements BrokageNoteRepository {
  
  async retrieveData(note: BrokageNote): Promise<BrokageNoteData> {
    const directory = process.env.BROKAGE_NOTES_DIR
    const path = `${directory}/${note.date}.pdf`

    const input = readFileSync(path)

    const result = await pdf(input)
    const items = result.text.split('\n')

    return {
      rows: items
    }
  }

}