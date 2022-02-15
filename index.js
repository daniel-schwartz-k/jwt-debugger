import * as jose from 'jose'

async function calculateJwt() {
  setPayload()
  const isVerified = await isJwtVerified()
  if (isVerified) {
    markAsVerified()
  } else {
    markAsNotVerified()
  }
}

async function setEncodedJwt() {
  const payload = document.getElementById('decoded').value
  let parsed
  try {
    parsed = JSON.parse(payload)
  } catch (e) { 
    // wait for payload to be valid json
    markAsNotVerified()
    return 
  }
  const secret = document.getElementById('secret').value
  const enc = new TextEncoder()
  const jwt = await new jose.SignJWT(parsed)
    .setProtectedHeader({ alg: 'HS256', cty: 'JWT' })
    .sign(enc.encode(secret))
  document.getElementById('encoded').value = jwt
  await markJwtVerification()
}

async function markJwtVerification() {
  const isVerified = await isJwtVerified()
  if (isVerified) {
    markAsVerified()
  } else {
    markAsNotVerified()
  }
}

function markAsNotVerified() {
  document.getElementById('decoded').classList.add('not-verified')
  document.getElementById('decoded').classList.remove('verified')
}

function markAsVerified() {
  document.getElementById('decoded').classList.add('verified')
  document.getElementById('decoded').classList.remove('not-verified')
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

document.addEventListener('DOMContentLoaded', () => {
  calculateJwt()
  document.getElementById('secret').addEventListener("input", (event) => calculateJwt());
  document.getElementById('encoded').addEventListener("input", (event) => calculateJwt());
  document.getElementById('decoded').addEventListener("input", (event) => setEncodedJwt());
});