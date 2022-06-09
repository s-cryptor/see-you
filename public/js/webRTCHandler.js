import * as wss from './wss.js'
import * as constants from './constants.js'
import * as ui from './ui.js'

let connectedUserDetails

export const sendPreOffer = (calleePersonalCode, callType) => {
  const payload = { callType, calleePersonalCode }
  wss.sendPreOffer(payload)
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

function acceptCallHandler() {
  console.log('call accepted')
}

function rejectCallHandler() {
  console.log('call rejected')
}
