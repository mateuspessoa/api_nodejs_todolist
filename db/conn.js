const mongoose = require('mongoose');

async function main() {
    await mongoose.connect('mongodb://localhost:27017/todolist')
    console.log('Conectado ao mongoose')
}

main().catch((erro) => console.log(erro))

module.exports = mongoose