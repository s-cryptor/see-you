import * as wss from './wss.js'

export const sendPreOffer = (calleePersonalCode, callType) => {
  const payload = { callType, calleePersonalCode }
  wss.sendPreOffer(payload)
}
