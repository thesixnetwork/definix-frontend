/* eslint eqeqeq: 0 */
import QRcode from 'qrcode'
import axios from 'axios'
import {
  isMobile
} from "react-device-detect";


let requestKey = ""
let responseData: any | null = null
let intervalCheckResult: NodeJS.Timeout
let account: string
const initData = () => {
  requestKey = ""
  responseData = null
}

export const genQRcode = () => {
  initData()
  const mockData = {
    bapp: {
      name: 'definix',
    },
    type: 'auth',
  }
  axios.post('https://a2a-api.klipwallet.com/v2/a2a/prepare', mockData).then((response) => {
    requestKey = response.data.request_key
    alert(`ismobile ${isMobile}`)
    if (isMobile === true) {
      window.location.href = `https://klipwallet.com/?target=/a2a?request_key=${response.data.request_key}`
    } else {
      QRcode.toCanvas(
        document.getElementById('qrcode'),
        `https://klipwallet.com/?target=/a2a?request_key=${response.data.request_key}`,
        () => {
          intervalCheckResult = setInterval(getResult, 1000)
        }
      )
    }
  })
}
const getResult = async () => {
  console.log('setInterval KlipProvider')
  const url = `https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${requestKey}`
  // const url = `http://localhost:8080`
  const res = await axios.get(url)
  // console.log("request status : ", res.data.status)
  if (res.data.status == "completed") {
    account = res.data.result.klaytn_address
    responseData = res.data.result.klaytn_address

    // const modalELement = document.getElementById("modal")
    // if (modalELement != null)
    // ReactDOM.createPortal( null,modalELement)
    clearInterval(intervalCheckResult)
  }

}


export const getAccount = () => account
export const getRequestKey = () => requestKey


export const checkResponse = async (): Promise<string> => {
  return new Promise(resolve => {
    const interCheck = setInterval(() => {
      // console.log("setInterval KlipProvider checkResponse")
      if (responseData != undefined) {
        clearInterval(interCheck)
        resolve(responseData);
      }
    }, 1000)

  });
}


export const getResultContract = async () => {
  // console.log('setInterval KlipProvider getResultContract')
  const url = `https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${requestKey}`
  // const url = `http://localhost:8080/con`
  const res = await axios.get(url)

  if (res.data.status == "completed") {
    // account = res.data.result.klaytn_address
    responseData = res.data.result.tx_hash

    // const modalELement = document.getElementById("modal")
    // if (modalELement != null)
    // ReactDOM.createPortal( null,modalELement)
    clearInterval(intervalCheckResult)
  }

}
export const genQRcodeContactInteract = async (contractAddress: string, abi: string, input: string, value: string, setShowModal: (bool: boolean) => void) => {
  initData()
  const mockData = {
    "bapp": {
      "name": "definix"
    },
    "type": "execute_contract",
    "transaction": {
      "to": contractAddress,
      "value": value,
      "abi": abi,
      "params": input
    }
  }
  return axios.post('https://a2a-api.klipwallet.com/v2/a2a/prepare', mockData).then(async (response) => {
    requestKey = response.data.request_key
    if (isMobile === true) {
      const url = `https://klipwallet.com/?target=/a2a?request_key=${response.data.request_key}`
      // await axios.get(url)
      intervalCheckResult = setInterval(getResultContract, 1000)
      openDeeplink(url)

    } else {
      setShowModal(true)
      await QRcode.toCanvas(
        document.getElementById('qrcode'),
        `https://klipwallet.com/?target=/a2a?request_key=${response.data.request_key}`,
        () => {
          intervalCheckResult = setInterval(getResultContract, 1000)
        }
      )
    }
    return "success"
  }).catch(e => {
    return "error"
  })
}
const openDeeplink = (url: string) => {
  const checkRedirect = window.open(url, "_blank")
  if (checkRedirect === null) {
    window.location.href = `kakaotalk://klipwallet/open?url=${url}`
    setTimeout(function () {
      if (document.hasFocus()) {
        window.location.replace("https://apps.apple.com/kr/app/%EC%B9%B4%EC%B9%B4%EC%98%A4%ED%86%A1-kakaotalk/id362057947")
      }
    }, 4500);
  }

}
