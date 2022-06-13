import * as wss from './wss.js'
import * as constants from './constants.js'
import * as ui from './ui.js'

let connectedUserDetails

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
  sendPreOfferAnswer(constants.preOfferAnswer.CALL_ACCEPTED)
}

function rejectCallHandler() {
  console.log('call rejected')
  sendPreOfferAnswer(constants.preOfferAnswer.CALL_REJECTED)
}

function callingDialogRejectCallHandler() {
  console.log('rejecting the call')
}

function sendPreOfferAnswer(preOfferAnswer) {
  const data = { callerSocketId: connectedUserDetails.socketId, preOfferAnswer }
  wss.sendPreOfferAnswer(data)
}
