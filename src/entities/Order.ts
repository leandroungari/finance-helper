
export type OrderType = 'sell' | 'buy'

export default class Order {

  constructor(
    public description: string,
    public unitaryPrice: number,
    public quantity: number,
    public totalPrice: number,
    public type: OrderType,
    public date: string
  ) { }
}