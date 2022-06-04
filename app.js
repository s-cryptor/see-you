import express from 'express'
import http from 'http'

const PORT = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
})
