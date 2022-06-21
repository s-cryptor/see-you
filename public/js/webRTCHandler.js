import * as wss from './wss.js'
import * as constants from './constants.js'
import * as ui from './ui.js'
import * as store from './store.js'

let connectedUserDetails
let peerConnection
let dataChannel

const defaultConstraints = {
  audio: true,
  video: true,
}
const config = {
  iceServer: [{ urls: 'stun:stun.l.google.com:13902' }],
}

export const getLocalPreview = () => {
  navigator.mediaDevices
    .getUserMedia(defaultConstraints)
    .then((stream) => {
      ui.updateLocalVideo(stream)
      store.setLocalStream(stream)
    })
    .catch((error) => {
      console.log('error occured when trying to get access to camera')
      console.log(error)
    })
}

const createPeerConnection = () => {
  peerConnection = new RTCPeerConnection(config)

  dataChannel = peerConnection.createDataChannel('chat')
  peerConnection.addEventListener('datachannel', (event) => {
    const channel = event.channel
    channel.addEventListener('open', () => {
      console.log('peer connection is ready to receive data channel messages')
    })
    channel.addEventListener('message', (event) => {
      const message = JSON.parse(event.data)
      console.log('message came from data channel', message)
    })
  })

  peerConnection.addEventListener('icecandidate', (event) => {
    console.log('getting ice candidates from stun server')
    if (event.candidate) {
      wss.sendDataUsingWebRTCSignaling({
        connectedUserSocketId: connectedUserDetails.socketId,
        type: constants.webRTCSignaling.ICE_CANDIDATE,
        candidate: event.candidate,
      })
    }
  })

  peerConnection.addEventListener('connectionstatechange', () => {
    if (peerConnection.connectionState === 'connected') {
      console.log('successfully connected with other peer')
    }
  })

  const remoteStream = new MediaStream()
  store.setRemoteStream(remoteStream)
  ui.updateRemoteVideo(remoteStream)

  peerConnection.addEventListener('track', (event) => {
    remoteStream.addTrack(event.track)
  })

  if (connectedUserDetails.callType === constants.callType.VIDEO_PERSONAL_CODE) {
    const localStream = store.getState().localStream

    for (const track of localStream.getTracks()) {
      peerConnection.addTrack(track, localStream)
    }
  }
}

export const sendMessageUsingDataChannel = (message) => {
  const stringifiedMessage = JSON.stringify(message)
  dataChannel.send(stringifiedMessage)
}

export const sendPreOffer = (calleePersonalCode, callType) => {
  connectedUserDetails = {
    callType,
    socketId: calleePersonalCode,
  }

  if (
    callType === constants.callType.CHAT_PERSONAL_CODE ||
    callType === constants.callType.VIDEO_PERSONAL_CODE
  ) {
    const payload = { callType, calleePersonalCode }
    ui.showCallingDialog(callingDialogRejectCallHandler)
    wss.sendPreOffer(payload)
  }
}

function sendPreOfferAnswer(preOfferAnswer) {
  const data = { callerSocketId: connectedUserDetails.socketId, preOfferAnswer }
  ui.removeAllDialogs()
  wss.sendPreOfferAnswer(data)
}

export const handlePreOffer = (data) => {
  const { callType, callerSocketId } = data
  connectedUserDetails = { socketId: callerSocketId, callType }

  if (
    callType === constants.callType.CHAT_PERSONAL_CODE ||
    callType === constants.callType.VIDEO_PERSONAL_CODE
  ) {
    ui.showIncomingCallDialog(callType, acceptCallHandler, rejectCallHandler)
  }
}

export const handlePreOfferAnswer = (data) => {
  const { preOfferAnswer } = data
  console.log('preoffer answer came', data)
  ui.removeAllDialogs()

  if (preOfferAnswer === constants.preOfferAnswer.CALLEE_NOT_FOUND) {
    ui.showInfoDialog(preOfferAnswer)
    // show dialog that callee has not been found
  }

  if (preOfferAnswer === constants.preOfferAnswer.CALL_UNAVAILABLE) {
    ui.showInfoDialog(preOfferAnswer)
    // show dialog that callee is not able to connect
  }

  if (preOfferAnswer === constants.preOfferAnswer.CALL_REJECTED) {
    ui.showInfoDialog(preOfferAnswer)
    // show dialog that call is rejected by the callee
  }

  if (preOfferAnswer === constants.preOfferAnswer.CALL_ACCEPTED) {
    ui.showCallElements(connectedUserDetails.callType)
    createPeerConnection()
    sendWebRTCOffer()
    // send WebRTC offer
  }
}

const sendWebRTCOffer = async () => {
  const offer = await peerConnection.createOffer()
  await peerConnection.setLocalDescription(offer)
  wss.sendDataUsingWebRTCSignaling({
    connectedUserSocketId: connectedUserDetails.socketId,
    type: constants.webRTCSignaling.OFFER,
    offer,
  })
}

export const handleWebRTCOffer = async (data) => {
  await peerConnection.setRemoteDescription(data.offer)
  const answer = await peerConnection.createAnswer()
  await peerConnection.setLocalDescription(answer)
  wss.sendDataUsingWebRTCSignaling({
    connectedUserSocketId: connectedUserDetails.socketId,
    type: constants.webRTCSignaling.ANSWER,
    answer,
  })
}

export const handleWebRTCAnswer = async (data) => {
  console.log('handling webRTC answer')
  await peerConnection.setRemoteDescription(data.answer)
}

export const handleWebRTCCandidate = async (data) => {
  try {
    await peerConnection.addIceCandidate(data.candidate)
  } catch (error) {
    console.error('error occured when trying to add received ice candidate', error)
  }
}

function acceptCallHandler() {
  console.log('call accepted')
  createPeerConnection()
  sendPreOfferAnswer(constants.preOfferAnswer.CALL_ACCEPTED)
  ui.showCallElements(connectedUserDetails.callType)
}

function rejectCallHandler() {
  console.log('call rejected')
  sendPreOfferAnswer(constants.preOfferAnswer.CALL_REJECTED)
}

function callingDialogRejectCallHandler() {
  console.log('rejecting the call')
}

export const toggleCameraAndScreenSharing = async (isScreenSharingActive) => {
  let screenSharingStream

  if (isScreenSharingActive) {
    const localStream = store.getState().localStream
    const sender = peerConnection
      .getSenders()
      .find((s) => s.track.kind === localStream.getVideoTracks()[0].kind)
    if (sender) {
      sender.replaceTrack(localStream.getVideoTracks()[0])
    }

    store
      .getState()
      .screenSharingStream.getTracks()
      .forEach((track) => track.stop())
    store.setScreenSharingActive(!isScreenSharingActive)
    ui.updateLocalVideo(localStream)
  } else {
    console.log('switching for screen sharing')
    try {
      screenSharingStream = await navigator.mediaDevices.getDisplayMedia({ video: true })
      store.setScreenSharingStream(screenSharingStream)

      const senders = peerConnection.getSenders()
      const sender = senders.find(
        (s) => s.track.kind === screenSharingStream.getVideoTracks()[0].kind
      )

      if (sender) {
        sender.replaceTrack(screenSharingStream.getVideoTracks()[0])
      }

      store.setScreenSharingActive(!isScreenSharingActive)
      ui.updateLocalVideo(screenSharingStream)
    } catch (error) {
      console.error('error occured when trying to set or get screen sharing screen', error)
    }
  }
}
