import * as store from './store.js'
import * as ui from './ui.js'
import * as webRTCHandler from './webRTCHandler.js'
import * as constants from './constants.js'

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

  socket.on('pre-offer-answer', (data) => {
    webRTCHandler.handlePreOfferAnswer(data)
  })

  socket.on('webRTC-signaling', (data) => {
    switch (data.type) {
      case constants.webRTCSignaling.OFFER:
        webRTCHandler.handleWebRTCOffer(data)
        break
      default:
        return
    }
  })
}

export const sendPreOffer = (payload) => {
  socketIO.emit('pre-offer', payload)
}

export const sendPreOfferAnswer = (payload) => {
  socketIO.emit('pre-offer-answer', payload)
}

export const sendDataUsingWebRTCSignaling = (data) => {
  socketIO.emit('webRTC-signaling', data)
}
