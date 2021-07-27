// code is separated to index.js and app.js files, to prevent app.listen to execute while testing using supertest 

const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT

// app.use((req, res, next) => {
//     res.status(503).send('Site down temporarily. Check back after some time!')
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

module.exports = app