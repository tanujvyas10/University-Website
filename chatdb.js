const {MongoClient}=require('mongodb')
const url='mongodb://localhost:27017'

const connectdb=(dbname)=>{
    return MongoClient.connect(url).then(client=>client.db(dbname))
}

const insertMsg=(msg)=>
    connectdb('chatdb')
    .then(db=>db.collection('chat').insertOne(msg))

// insertMsg()

const getAllMsg=()=>
    connectdb('chatdb')
    .then(db=>db.collection('chat').find({from: 'task'}))
    .then(b => b.toArray())
    .then(e=> console.log(e))

getAllMsg()

// const delTodo=()=>
//     connectdb('todosdb')
//     .then(db=>db.collection('todo').deleteMany({
//         striked: {
//             $eq: true
//         }
//     }))

// // delTodo()

// const updateTodo=(todotask)=>
//     connectdb('todosdb')
//     .then(db=>db.collection('todo').updateOne(
//         {
//             task: {$eq: todotask}
//         },
//         {
//             $set: {striked: true}
//         }
//     ))
//     .then(b=>console.log(b))

// const updateTodoF=(todotask)=>
//     connectdb('todosdb')
//     .then(db=>db.collection('todo').updateOne(
//         {
//             task: {$eq: todotask}
//         },
//         {
//             $set: {striked: false}
//         }
//     ))
//     .then(b=>console.log(b))

// // updateTodo()
// // getAllTodos()

module.exports={
    insertMsg,
    getAllMsg
}