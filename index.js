const express = require('express')
const cors = require('cors')

const UserRoutes = require('./routes/UserRoutes')
const TaskRoutes = require('./routes/TaskRoutes')

const app = express();


app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))


app.use(express.json())

app.use(express.static('public'))

app.use('/users', UserRoutes)
app.use('/tasks', TaskRoutes)

app.listen(5000)