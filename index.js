import teleWorker from './src/handlers/teleWorker'
import Router from './router'

addEventListener('fetch', event => {
  return event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {

  const r = new Router()

  r.post('/teleworker', teleWorker)

  let response = await r.route(request)

  if (!response) {
    response = new Response('Not Found', { status: 404})
  }

  return response

}