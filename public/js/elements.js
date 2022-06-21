export const getIncomingCallDialog = (callTypeInfo, acceptCallHandler, rejectCallHandler) => {
  console.log('getting income call dialog')
  const dialog = document.createElement('div')
  dialog.classList.add('dialog_wrapper')

  const dialogContent = document.createElement('div')
  dialogContent.classList.add('dialog_content')

  const title = document.createElement('p')
  title.classList.add('dialog_title')
  title.innerHTML = `Incoming ${callTypeInfo} call`

  const imageContainer = document.createElement('div')
  imageContainer.classList.add('dialog_image_container')

  const image = document.createElement('img')
  const avatarImagePath = './utils/images/dialogAvatar.png'
  image.src = avatarImagePath

  const buttonContainer = document.createElement('div')
  buttonContainer.classList.add('dialog_button_container')

  const acceptCallButton = document.createElement('button')
  acceptCallButton.classList.add('dialog_accept_call_button')
  const acceptCallImage = document.createElement('img')
  acceptCallImage.classList.add('dialog_accept_call_image')
  const acceptCallImagePath = './utils/images/acceptCall.png'
  acceptCallImage.src = acceptCallImagePath

  const rejectCallButton = document.createElement('button')
  rejectCallButton.classList.add('dialog_reject_call_button')
  const rejectCallImage = document.createElement('img')
  rejectCallImage.classList.add('dialog_reject_call_image')
  const rejectCallImagePath = './utils/images/rejectCall.png'
  rejectCallImage.src = rejectCallImagePath

  acceptCallButton.appendChild(acceptCallImage)
  rejectCallButton.appendChild(rejectCallImage)
  buttonContainer.appendChild(acceptCallButton)
  buttonContainer.appendChild(rejectCallButton)
  imageContainer.appendChild(image)
  dialogContent.appendChild(title)
  dialogContent.appendChild(imageContainer)
  dialogContent.appendChild(buttonContainer)
  dialog.appendChild(dialogContent)

  acceptCallButton.addEventListener('click', () => {
    acceptCallHandler()
  })
  rejectCallButton.addEventListener('click', () => {
    rejectCallHandler()
  })

  return dialog
}

export const getCallingDialog = (rejectCallHandler) => {
  const dialog = document.createElement('div')
  dialog.classList.add('dialog_wrapper')

  const dialogContent = document.createElement('div')
  dialogContent.classList.add('dialog_content')

  const title = document.createElement('p')
  title.classList.add('dialog_title')
  title.innerHTML = 'Calling'

  const imageContainer = document.createElement('div')
  imageContainer.classList.add('dialog_image_container')

  const image = document.createElement('img')
  const avatarImagePath = './utils/images/dialogAvatar.png'
  image.src = avatarImagePath

  const buttonContainer = document.createElement('div')
  buttonContainer.classList.add('dialog_button_container')

  const hangUpCallButton = document.createElement('button')
  hangUpCallButton.classList.add('dialog_reject_call_button')
  const hangUpCallImage = document.createElement('img')
  hangUpCallImage.classList.add('dialog_reject_call_image')
  const hangUpCallImagePath = './utils/images/rejectCall.png'
  hangUpCallImage.src = hangUpCallImagePath

  hangUpCallButton.appendChild(hangUpCallImage)
  buttonContainer.appendChild(hangUpCallButton)
  imageContainer.appendChild(image)
  dialogContent.appendChild(title)
  dialogContent.appendChild(imageContainer)
  dialogContent.appendChild(buttonContainer)
  dialog.appendChild(dialogContent)

  return dialog
}

export const getInfoDialog = (dialogTitle, dialogDescription) => {
  const dialog = document.createElement('div')
  dialog.classList.add('dialog_wrapper')

  const dialogContent = document.createElement('div')
  dialogContent.classList.add('dialog_content')

  const title = document.createElement('p')
  title.classList.add('dialog_title')
  title.innerHTML = dialogTitle

  const imageContainer = document.createElement('div')
  imageContainer.classList.add('dialog_image_container')

  const image = document.createElement('img')
  const avatarImagePath = './utils/images/dialogAvatar.png'
  image.src = avatarImagePath

  const description = document.createElement('p')
  description.classList.add('dialog_description')
  description.innerHTML = dialogDescription

  imageContainer.appendChild(image)
  dialogContent.appendChild(title)
  dialogContent.appendChild(imageContainer)
  dialogContent.appendChild(description)
  dialog.appendChild(dialogContent)

  return dialog
}

export const getLeftMessage = (message) => {
  const messageContainer = document.createElement('div')
  messageContainer.classList.add('message_left_container')
  const messageParagraph = document.createElement('p')
  messageParagraph.classList.add('message_left_paragraph')
  messageParagraph.innerHTML = message
  messageContainer.appendChild(messageParagraph)

  return messageContainer
}

export const getRightMessage = (message) => {
  const messageContainer = document.createElement('div')
  messageContainer.classList.add('message_right_container')
  const messageParagraph = document.createElement('p')
  messageParagraph.classList.add('message_right_paragraph')
  messageParagraph.innerHTML = message
  messageContainer.appendChild(messageParagraph)

  return messageContainer
}
