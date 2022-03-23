import QRcode from 'qrcode'
import axios from 'axios'
import dayjs, { Dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useSelector } from 'react-redux'
import { isAndroid, isIOS, isMobile } from 'react-device-detect'
import { State } from '../state/types'
import useKlipModal, { renderKlipTimeFormat } from './useKlipModal'

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

enum ERROR_STATE {
  TIMEOUT = 'timeout',
  CANCELED = 'canceled',
  UNKNOWN = 'unknown',
}

class KlipConnector {
  private _klipRequestKey: string | undefined
  private _interval: any = null

  public isKlip(connector) {
    return connector === 'klip'
  }

  public closeRequest() {
    this._onCloseReponse()
  }

  async requestContract(
    props: KlipContractProps,
    {
      onShow,
      onHide,
    }: {
      onShow: () => void
      onHide: () => void
    },
  ): Promise<string> {
    this._onCloseReponse()
    try {
      await this._getRequestKey(props)
      this._onRenderingQR(onShow)
      return await this._onWaitResponse()
    } catch (e) {
      throw e
    } finally {
      onHide()
    }
  }

  public getResult(klipRequestKey: string): Promise<{
    status: RESPONSE_STATE
    expiration_time: number
    result?: {
      tx_hash: string
      stats: string
    }
  }> {
    return axios.get(`${KLIP_BASE_URL}/result?request_key=${klipRequestKey}`).then(({ data }) => data)
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
    } catch (e) {
      throw e
    }
  }

  private _onRenderingQR(onShow: () => void) {
    let url
    if (!isMobile) {
      onShow()
      const elem = document.createElement('canvas')
      url = `https://klipwallet.com/?target=/a2a?request_key=${this._klipRequestKey}`
      QRcode.toCanvas(elem, url)
      document.querySelector('.klip-qr').appendChild(elem)
    } else {
      if (isIOS) {
        url = `kakaotalk://klipwallet/open?url=https://klipwallet.com/?target=/a2a?request_key=${this._klipRequestKey}`
      } else if (isAndroid) {
        url = `intent://klipwallet/open?url=https://klipwallet.com/?target=/a2a?request_key=${this._klipRequestKey}#Intent;scheme=kakaotalk;package=com.kakao.talk;end`
      }
      ;(window as any).location.href = url
    }
  }

  private _onRenderingInterval(expireDuration: Dayjs) {
    // this._callback.interval(expireDuration.valueOf())
    // @ts-ignore
    if (!isMobile) {
      document.querySelector('.klip-interval').innerHTML = renderKlipTimeFormat(expireDuration.valueOf())
    }
  }

  private _onWaitResponse(): Promise<string> {
    return new Promise((resolve, reject) => {
      this._interval && clearInterval(this._interval)
      this._interval = setInterval(async () => {
        try {
          const res = await this.getResult(this._klipRequestKey)
          const expireDuration = dayjs.unix(res.expiration_time - dayjs().unix())
          this._onRenderingInterval(expireDuration)
          if (expireDuration.unix() < 0) {
            reject({
              status: ERROR_STATE.TIMEOUT,
            })
            this._onCloseReponse()
          }
          if (res?.status === RESPONSE_STATE.COMPLETED) {
            resolve(res.result.tx_hash)
            this._onCloseReponse()
          } else if (res?.status === RESPONSE_STATE.CANCELED) {
            reject({
              status: ERROR_STATE.CANCELED,
            })
            this._onCloseReponse()
          }
        } catch (e) {
          console.error(e)
          reject({
            status: ERROR_STATE.UNKNOWN,
            e,
          })
          this._onCloseReponse()
        }
      }, 1000)
    })
  }

  private _onCloseReponse() {
    this._klipRequestKey = undefined
    this._interval && clearInterval(this._interval)
    this._interval = null
  }
}

const klipConnector = new KlipConnector()

const useKlipContract = () => {
  const connector = useSelector((state: State) => {
    return state.wallet.connector
  })
  const [onPresentKlipModal, onDismissKlipModal] = useKlipModal()
  return {
    isKlip: () => klipConnector.isKlip(connector),
    request: (props) =>
      klipConnector.requestContract(props, {
        onShow: () => onPresentKlipModal(),
        onHide: () => onDismissKlipModal(),
      }),
    close: () => klipConnector.closeRequest(),
  }
}

export default useKlipContract
