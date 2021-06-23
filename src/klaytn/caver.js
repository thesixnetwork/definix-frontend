/**
 * caver-js library helps making connection with klaytn node.
 * You can connect to specific klaytn node by setting 'rpcURL' value.
 * default rpcURL is 'https://api.baobab.klaytn.net:8651'.
 */
import Caver from 'caver-js'

// const rpcURL = process.env.REACT_APP_KLAYTN_RPC_URL;
// console.log("rpcURL = ", rpcURL);

window.addEventListener(
  'klaytn#initialized',
  () => {
    window.caver = new Caver(window.klaytn)
  },
  false,
)
// const caver = new Caver(rpcURL);

export default window.klaytn
