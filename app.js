import express from 'express'
import http from 'http'
import { Server } from 'socket.io'

const PORT = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})

let connectedPeers = []

io.on('connection', (socket) => {
  connectedPeers.push(socket.id)
  console.log(connectedPeers)

  socket.on('disconnect', () => {
    console.log('user disconnected')

    const newConnectedPeers = connectedPeers.filter((peerSocketId) => {
      peerSocketId !== socket.id
    })

    connectedPeers = newConnectedPeers
    console.log(connectedPeers)
  })
})

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
})
