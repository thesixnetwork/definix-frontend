/* eslint-disable no-param-reassign */
import BigNumber from 'bignumber.js'
import Utils from './Utils'

class Address {
  context

  balances

  constructor(_context) {
    this.context = _context
    this.balances = {}
  }

  safeTransfer = (_token, _to, _amount) => {
    // this._require(
    //   this.balances[_token] && this.balances[_token].isGreaterThan(_amount),
    //   'INSUFFICIENT BALANCE',
    // )
    if (!_to.balances[_token]) {
      _to.balances[_token] = new BigNumber(0)
    }
    this.balances[_token] = this.balances[_token].minus(_amount)
    _to.balances[_token] = _to.balances[_token].plus(_amount)

    this.context.addRollBackOperation(() => {
      _to.balances[_token] = _to.balances[_token].minus(_amount)
      this.balances[_token] = this.balances[_token].plus(_amount)
    })
  }

  getBalance = (_token) => {
    if (!this.balances[_token]) {
      this.balances[_token] = new BigNumber(0)
    }
    return this.balances[_token]
  }

  _require = (cond, message) => {
    Utils._require(this.context, cond, message)
  }
}

export default Address
