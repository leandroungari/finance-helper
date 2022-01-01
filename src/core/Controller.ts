
export default abstract class Controller<T = void> {

  constructor() {}

  abstract handle(data: T): Promise<any>
}