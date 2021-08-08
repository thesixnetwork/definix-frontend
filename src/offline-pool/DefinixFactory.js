import Address from './Address'
import DefinixPair from './DefinixPair'

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < (array.length || array.size); index++) {
    // eslint-disable-next-line
    await callback(array[index] || array.docs[index], index, array)
  }
}

class DefinixFactory extends Address {
  pairMap = {}

  // constructor(_context) {
  //   super(_context)
  // }

  loadPair = async (..._pairAddress) => {
    await asyncForEach(_pairAddress, async (_address) => {
      const newPair = new DefinixPair(this.context)
      await newPair.initFromPair(_address)
      this.pairMap[_address] = newPair
      this.pairMap[`${newPair.token0}-${newPair.token1}`] = newPair
      this.pairMap[`${newPair.token1}-${newPair.token0}`] = newPair
    })
  }

  getReserves = (_token0, _token1) => {
    const pair = this.pairFor(_token0, _token1)
    return {
      reserve0: _token0 === pair.token0 ? pair.reserve0 : pair.reserve1,
      reserve1: _token0 === pair.token0 ? pair.reserve1 : pair.reserve0,
    }
  }

  pairFor = (_token0, _token1) => {
    return this.pairMap[`${_token0}-${_token1}`]
  }
}

export default DefinixFactory
