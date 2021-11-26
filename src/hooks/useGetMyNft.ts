/* eslint-disable no-shadow */
import { useEffect, useState, useCallback, useContext } from 'react'
import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import _ from 'lodash'
import { useSelector, useDispatch } from 'react-redux'
import { fetchNFTUser } from '../state/actions'
import useRefresh from './useRefresh'
import { State } from '../state/types'

const useNFTUser = () => {
  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  const { account } = useWallet()

  useEffect(() => {
    if (account) {
      dispatch(fetchNFTUser(account))
    }
  }, [fastRefresh, account, dispatch])

  const nftUser = useSelector((state: State) => state.nft)
  return { nftUser }
}

export default useNFTUser
