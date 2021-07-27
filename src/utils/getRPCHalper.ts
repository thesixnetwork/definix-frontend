/* eslint no-await-in-loop: 0 */
/* eslint no-restricted-syntax: 0 */
import axios from 'axios'

const RPCS = [
  process.env.REACT_APP_NODE_3,
  process.env.REACT_APP_NODE_2,
  process.env.REACT_APP_NODE_1,
]

const checkHeartBeat = async (rpc: string): Promise<number> => {
  return new Promise((reslove) => {
    axios
      .get(rpc)
      .then((res) => {
        reslove(res.status)
      })
      .catch(function (error) {
        if (error.response) {
          reslove(error.response.status)
        }
      })
  })
}

const checkHeartBeatStatue = (status: number): boolean => status === 200

const getRPCurlIsWorking = async () => {
  for (const rpc of RPCS) {
    const status = await checkHeartBeat(rpc)
    if (checkHeartBeatStatue(status)) {
      return rpc
    }
  }
  return 'all node rpc not work'
}
const getRPCurl = async (): Promise<string> => {
  try {
    return await getRPCurlIsWorking()
  } catch (error) {
    return '' // all rpc is die
  }
}

export default getRPCurl
