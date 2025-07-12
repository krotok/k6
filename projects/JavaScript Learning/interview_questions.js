// Question 1. 'null' and 'undefined'
let primitiveTypes = ['string', 'number', 'null', 'undefined', 'boolean', 'symbol', 'bigint']
console.log(!!null) // false
console.log(!!undefined) // false

console.log(Boolean(null)) // false
console.log(Boolean(undefined)) // false

let _thisIsUndefined
const doNothing = () => {}
const someObj = {
    a: 'ay',
    b: 'bee',
    c: 'si'
}
console.log(_thisIsUndefined) // undefined
console.log(doNothing()) // undefined
console.log(someObj['d']); // undefined

// fs.readFile('path/to/file', (e, data) => {
//     console.log(e) // здесь мы получаем null
// if(e) {
//     console.log(e)
// }
//     console.log(data)
// })

// console.log(null == undefined) // true
// console.log(null === undefined) // false



//Question 2. Для чего используется оператор "&&"
