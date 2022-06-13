import * as store from './store.js'
import * as ui from './ui.js'
import * as webRTCHandler from './webRTCHandler.js'

let socketIO = null

export const registerSocketEvents = (socket) => {
  socketIO = socket

  socket.on('connect', () => {
    store.setSocketId(socket.id)
    ui.updatePersonalCode(socket.id)
  })

  socket.on('pre-offer', (data) => {
    webRTCHandler.handlePreOffer(data)
  })
}

export const sendPreOffer = (payload) => {
  socketIO.emit('pre-offer', payload)
}

export const sendPreOfferAnswer = (payload) => {
  socketIO.emit('pre-offer-answer', payload)
}
