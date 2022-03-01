export default interface DataMapper<A, B> {

  to(item: A): B
  
  from(data: B): A
}