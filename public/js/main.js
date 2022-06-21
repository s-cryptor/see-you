import * as store from './store.js'
import * as wss from './wss.js'
import * as webRTCHandler from './webRTCHandler.js'
import * as constants from './constants.js'
import * as ui from './ui.js'

const socket = io('/')
wss.registerSocketEvents(socket)

webRTCHandler.getLocalPreview()

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

const micButton = document.getElementById('mic_button')
micButton.addEventListener('click', () => {
  const localStream = store.getState().localStream
  const isMicEnabled = localStream.getAudioTracks()[0].enabled
  localStream.getAudioTracks()[0].enabled = !isMicEnabled
  ui.updateMicButton(isMicEnabled)
})

const cameraButton = document.getElementById('camera_button')
cameraButton.addEventListener('click', () => {
  const localStream = store.getState().localStream
  const isCameraEnabled = localStream.getVideoTracks()[0].enabled
  localStream.getVideoTracks()[0].enabled = !isCameraEnabled
  ui.updateCameraButton(isCameraEnabled)
})

const switchScreenSharingButton = document.getElementById('screen_sharing_button')
switchScreenSharingButton.addEventListener('click', () => {
  const isScreenSharingActive = store.getState().screenSharingActive
  webRTCHandler.toggleCameraAndScreenSharing(isScreenSharingActive)
})
