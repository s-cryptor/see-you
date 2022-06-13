import * as store from './store.js'
import * as wss from './wss.js'
import * as webRTCHandler from './webRTCHandler.js'
import * as constants from './constants.js'
import { getIncomingCallDialog } from './elements.js'

const socket = io('/')
wss.registerSocketEvents(socket)

const personalCodeCopyButton = document.getElementById('personal_code_copy_button')
personalCodeCopyButton.addEventListener('click', () => {
  const personalCode = store.getState().socketId
  navigator.clipboard && navigator.clipboard.writeText(personalCode)
})

const personalCodeChatButton = document.getElementById('personal_code_chat_button')
personalCodeChatButton.addEventListener('click', () => {
  const calleePersonalCode = document.getElementById('personal_code_input').value
  const callType = constants.callType.CHAT_PERSONAL_CODE
  webRTCHandler.sendPreOffer(calleePersonalCode, callType)
})

const personalCodeVideoButton = document.getElementById('personal_code_video_button')
personalCodeVideoButton.addEventListener('click', () => {
  const calleePersonalCode = document.getElementById('personal_code_input').value
  const callType = constants.callType.VIDEO_PERSONAL_CODE
  webRTCHandler.sendPreOffer(calleePersonalCode, callType)
})

getIncomingCallDialog(
  'VIDEO',
  () => {},
  () => {}
)
