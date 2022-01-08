/* eslint no-await-in-loop: 0 */
/* eslint no-restricted-syntax: 0 */
import axios from "axios"
// 'http://localhost:8080/rpc',
const RPCS = [`${process.env.REACT_APP_SIX_KLAYTN_EN_URL}`,`${process.env.REACT_APP_NETWORK_URL}`]

const checkHeartBeat = async (rpc: string): Promise<number> => {
    return new Promise(reslove => {
        axios.get(rpc)
            .then((res) => {
                reslove(res.status)
            })
            .catch(function (error) {
                if (error.response) {
                    reslove(error.response.status);
                }
            });
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
   return "all node rpc not work"
}
const getRPCurl = async():Promise<string> => {
    try {
        const x= await getRPCurlIsWorking()
        // console.log(x)
        return x
    } catch (error) {
        return "" // all rpc is die
    }
}

export default getRPCurl