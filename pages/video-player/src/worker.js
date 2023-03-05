await import("https://unpkg.com/@tensorflow/tfjs-core@2.4.0/dist/tf-core.js")
await import("https://unpkg.com/@tensorflow/tfjs-converter@2.4.0/dist/tf-converter.js")
await import("https://unpkg.com/@tensorflow/tfjs-backend-webgl@2.4.0/dist/tf-backend-webgl.js")
await import("https://unpkg.com/@tensorflow-models/face-landmarks-detection@0.0.1/dist/face-landmarks-detection.js")

import Service from "./service.js"

const { tf, faceLandmarksDetection } = self
tf.setBackend('webgl')

const service = new Service({ faceLandmarksDetection })

console.log('tf model loading')
await service.loadModel()
console.log('tf model loaded')

postMessage('tf ready')

onmessage = async ({ data: video }) => {
  const blinked = await service.handBlinked(video)

  if(!blinked) return
  
  postMessage({ blinked })
}