import * as store from './store.js'

const socket = io('/')

socket.on('connect', () => {
  console.log('successfully connected to wss server')
  store.setSocketId(socket.id)
  console.log(store.getState())
})
