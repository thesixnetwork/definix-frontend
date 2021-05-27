import { getCaver } from './caver'

/**
 * Accepts an array of contract method calls and batches them
 *
 * Example:
 *
 * [
 *  contract.method.balanceOf().call,
 *  contract.method.startBlockNumber().call
 * ]
 */
const makeBatchRequest = (calls: any[]) => {
  try {
    const caver = getCaver()
    const batch = new caver.BatchRequest()

    const promises = calls.map((call) => {
      return new Promise((resolve, reject) => {
        batch.add(
          call.request({}, (err, result) => {
            if (err) {
              reject(err)
            } else {
              resolve(result)
            }
          }),
        )
      })
    })

    batch.execute()

    return Promise.all(promises)
  } catch {
    return null
  }
}

export default makeBatchRequest
