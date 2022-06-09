import * as store from './store.js'
import * as ui from './ui.js'

let socketIO = null

export const registerSocketEvents = (socket) => {
  socket.on('connect', () => {
    socketIO = socket
    store.setSocketId(socket.id)
    ui.updatePersonalCode(socket.id)
  })
}

export const sendPreOffer = (payload) => {
  socketIO.emit('pre-offer', payload)
}
