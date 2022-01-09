
export default abstract class Controller {

  constructor() {}

  abstract handle(): Promise<any>
}