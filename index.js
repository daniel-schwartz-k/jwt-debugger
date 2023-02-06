import * as jose from 'jose'

async function calculateJwt() {
  setPayload()
  const isVerified = await isJwtVerified()
  if (!isVerified) {
    document.getElementById('decoded').classList.add('error')
  } else {
    document.getElementById('decoded').classList.remove('error')
  }
}

async function setEncodedJwt() {
  const payload = document.getElementById('decoded').value
  let parsed
  try {
    parsed = JSON.parse(payload)
    document.getElementById('decoded').classList.remove('error')
  } catch (e) { 
    // wait for payload to be valid json
    document.getElementById('decoded').classList.add('error')
    return 
  }
  const secret = document.getElementById('secret').value
  const enc = new TextEncoder()
  const jwt = await new jose.SignJWT(parsed)
    .setProtectedHeader({ alg: 'HS256', cty: 'JWT' })
    .sign(enc.encode(secret))
  document.getElementById('encoded').value = jwt
}

function setPayload() {
  const jwt = getEncodedJwt()
  let payload
  try {
    const decodedData = atob(jwt.split('.')[1], 'base64');
    payload = JSON.parse(decodedData)
  } catch(e) {}
  const decodedElemnt = document.getElementById('decoded')
  decodedElemnt.value = payload ? JSON.stringify(payload, null, 2) : 'Invalid payload!'
}

function getEncodedJwt() {
  const encodedElement = document.getElementById('encoded')
  return encodedElement.value
}

async function isJwtVerified() {
  const jwt = getEncodedJwt()
  const secret = document.getElementById('secret')
  return await verifyJwt(jwt, secret.value)
}

async function verifyJwt(token, secret) {
  const enc = new TextEncoder()
  try {
    const { payload, protectedHeader } = await jose.jwtVerify(token, enc.encode(secret))
    return true
  } catch (e) {
    return false
  }
}


function copyToClipboard() {
  const text = getEncodedJwt()
  navigator.clipboard.writeText(text);
}

document.addEventListener('DOMContentLoaded', () => {
  calculateJwt()
  document.getElementById('encoded').addEventListener("input", (event) => calculateJwt())
  document.getElementById('secret').addEventListener("input", (event) => setEncodedJwt())
  document.getElementById('decoded').addEventListener("input", (event) => setEncodedJwt())
  document.getElementById('copy-button').addEventListener("click", (event) => copyToClipboard())
});