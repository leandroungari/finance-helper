import Position from '../Position'

export type OrderType = 
    'sell' 
  | 'buy' 
  | 'new-position' 
  | 'adjustment-position'
  | 'bonus'

export type OrderTypeCode = 'B' | 'S' | 'N' | 'O' | 'A'


export default abstract class Order {

  constructor(
    protected description: string,
    protected date: Date
  ) { }

  public getDescription() {
    return this.description
  }

  public abstract getType(): OrderType

  public abstract getTypeCode(): OrderTypeCode

  public getDate() {
    return this.date
  }

  public abstract recalculate(position: Position | undefined): Position
}