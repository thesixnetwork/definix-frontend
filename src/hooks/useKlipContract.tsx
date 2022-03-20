import QRcode from 'qrcode'
import axios from 'axios'
import dayjs, { Dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

const BAPP_NAME = 'Definix'
const KLIP_BASE_URL = 'https://a2a-api.klipwallet.com/v2/a2a'

interface KlipContractProps {
  contractAddress: string
  abi: string
  input: string
  value?: string
}

enum RESPONSE_STATE {
  PREPARED = 'prepared',
  REQUESTED = 'requested',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

class KlipConnector {
  private _klipRequestKey: string | undefined
  private _interval: any = null
  private _$qrElem: HTMLCanvasElement | undefined

  public closeRequest() {
    this._onCloseReponse()
  }

  async requestContract(props: KlipContractProps) {
    this._onCloseReponse()
    await this._getRequestKey(props)
    try {
      this._onRenderingQR()
      await this._onWaitResponse()
    } catch (e) {
      console.error(e)
    }
  }

  public getResult(klipRequestKey: string): Promise<{
    status: RESPONSE_STATE
    expiration_time: number
  }> {
    return axios.get(`${KLIP_BASE_URL}/result?request_key=${klipRequestKey}`)
  }

  private async _getRequestKey({ contractAddress, abi, input, value }: KlipContractProps) {
    try {
      const data = {
        bapp: {
          name: BAPP_NAME,
        },
        type: 'execute_contract',
        transaction: {
          to: contractAddress,
          value: value || '0',
          abi: abi,
          params: input,
        },
      }
      return axios.post(`${KLIP_BASE_URL}/prepare`, data).then(({ data }) => {
        this._klipRequestKey = data.request_key
      })
    } catch (error) {
      console.error(error)
    }
  }

  private _onRenderingQR() {
    const url = `https://klipwallet.com/?target=/a2a?request_key=${this._klipRequestKey}`
    const elem = document.createElement('canvas')
    QRcode.toCanvas(elem, url)
    this._$qrElem = elem
  }

  private _onRenderingInterval(expireDuration: Dayjs) {
    // this._callback.interval(expireDuration.valueOf())
    // @ts-ignore
    document.querySelector('.' + this._options.intervalClassName)?.innerHTML = this._options.renderTimeFormat(
      expireDuration.valueOf(),
    )
  }

  private _onWaitResponse() {
    this._interval && clearInterval(this._interval)
    this._interval = setInterval(async () => {
      try {
        const res = await this.getResult(this._klipRequestKey)
        const expireDuration = dayjs.unix(res.expiration_time - dayjs().unix())
        this._onRenderingInterval(expireDuration)
        if (expireDuration.unix() < 0) {
          this._onCloseReponse()
          return
        }
        if (res?.status === RESPONSE_STATE.COMPLETED) {
          this._onCloseReponse()
        } else if (res?.status === RESPONSE_STATE.CANCELED) {
          this._onCloseReponse()
        }
      } catch (error) {
        console.error(error)
        this._onCloseReponse()
      }
    }, 1000)
  }

  private _onCloseReponse() {
    this._klipRequestKey = undefined
    this._interval && clearInterval(this._interval)
    // if (this._$qrElem) {
    //   this._$qrElem.remove();
    //   this._$qrElem = undefined;
    // }
  }
}

const { requestContract, closeRequest } = new KlipConnector()

const useKlipContract = () => {
  return {
    reuest: requestContract,
    close: closeRequest,
  }
}

export default useKlipContract
