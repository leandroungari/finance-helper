export default class TickerConverter {

  private static readonly relations: {[key: string]: string} = {
    "BRASILAGRO ON": "AGRO3",
    "BB PRGII BBPO11": "BBPO11",
    "ITAUSA PN": "ITSA4",
    "WEG ON EJ": "WEGE3",
    "GRENDENE ON": "GRND3",
    "BBSEGURIDADE ON": "BBSE3",
    "TRAN PAULIST PN": "TRPL4",
    "MAGAZ LUIZA ON": "MGLU3",
    "KINEA KNRI11 CI": "KNRI11",
    "WEG ON": "WEGE3"
  }

  convert(key: string) {
    return TickerConverter.relations[key] ?? key
  }
}