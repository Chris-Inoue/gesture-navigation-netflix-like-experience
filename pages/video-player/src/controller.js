export default class Controller {
  #view
  #worker
  #camera
  #blinkCounter = 0
  constructor({ view, worker, camera }) {
    this.#view = view
    this.#worker = this.#configureWorker(worker)
    this.#camera = camera

    this.#view.configureOnBtnClick(this.onBtnStart.bind(this))
  }
  
  static async initialize(deps) {
    const controller = new Controller(deps)
    controller.log('not yet detecting eye blink. Click in the button to start')
    return controller.init()
  }

  #configureWorker(worker) {
    let ready = false
    worker.onmessage = ({data}) => {
      if(data === 'tf ready'){
        this.#view.enableButton()
        ready = true
        return
      }
      const blinked = data.blinked
      this.#blinkCounter += blinked
      this.#view.tooglePlayVideo()
      console.log('blinked', blinked)
    }

    return {
      send (msg) {
        if(!ready) return
        worker.postMessage(msg)
      }
    }
  }

  async init() {
    console.log('controller initiated')
  }

  loopToGetFrames() {
    const video = this.#camera.video
    const img = this.#view.getVideoFrame(video)
    this.#worker.send(img)
    this.log('detecting eye blink...')

    setTimeout(() => this.loopToGetFrames(), 100)
  }

  log(text) {
    const times = `     - blinked times: ${this.#blinkCounter}`
    this.#view.log(`logger: ${text}`.concat(this.#blinkCounter ? times : ""))
  }

  onBtnStart() {
    this.log('Detection initiated...')
    this.#blinkCounter = 0
    this.loopToGetFrames()
  }
}