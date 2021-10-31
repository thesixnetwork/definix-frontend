import axios from 'axios'

export const sendAnalyticsData = (
    pid: number,
    address: string,
    deviceId: string
) => {
    const PID_FINIX_SIX = 2
    const PID_WKLAY_FINIX = 3
    if (pid === PID_FINIX_SIX || pid === PID_WKLAY_FINIX) {
        axios.post(`${process.env.REACT_APP_DEFINIX_ANALYTICS_URL}`, { address, pid ,deviceId}).then((res) => {
            console.log("res", res)
        }).catch((e) => {
            console.log("err ", e)
        })
    }
}
export default sendAnalyticsData