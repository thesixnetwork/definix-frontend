import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import getLibrary from 'utils/getLibrary'
import KlaytnWallet, { AvailableConnectors } from 'klaytn-wallets'
import dayjs from 'dayjs'
import useKlipModal from './useKlipModal'
import { useDispatch, useSelector } from 'react-redux'
import { setAccount, setConnector } from '../state/wallet'
import { State } from '../state/types'

const useWallet = () => {
  const dispatch = useDispatch()
  const account = useSelector((state: State) => {
    return state.wallet.account
  })
  const connector = useSelector((state: State) => {
    return state.wallet.connector
  })
  const wallet = useRef(
    new KlaytnWallet([AvailableConnectors.KAIKAS, AvailableConnectors.KLIP, AvailableConnectors.METAMASK]),
  )

  const [onPresentKlipModal, onDismissKlipModal] = useKlipModal({
    onHide: () => {
      wallet.current.closeKlip()
    },
  })

  useEffect(() => {
    if (!wallet.current) return
    wallet.current.initKlip(
      {
        renderTimeFormat(time: number) {
          const expireDuration = dayjs(time)
          return `
          ${expireDuration.minute()} min ${expireDuration.second()} sec
        `
        },
      },
      {
        show: () => onPresentKlipModal(),
        hide: () => onDismissKlipModal(),
        interval: (remainTime) => {
          console.log('interval', remainTime)
        },
      },
    )
  }, [wallet.current])

  const onActivate = useCallback(
    async (connectorId: string) => {
      await wallet.current.activate(connectorId)
      dispatch(setAccount(wallet.current.account))
      dispatch(setConnector(wallet.current.connectorId))
    },
    [wallet.current],
  )

  const onDeactivate = useCallback(() => {
    wallet.current.deactivate()
    dispatch(setAccount(wallet.current.account))
    dispatch(setConnector(wallet.current.connectorId))
  }, [wallet.current])

  const library = useMemo(() => getLibrary(window.klaytn), [])
  const klaytn = useMemo(() => library?.provider || undefined, [library])

  return {
    account,
    chainId: parseInt(process.env.REACT_APP_CHAIN_ID) || 1001,
    library,
    klaytn,
    connector,
    activate: onActivate,
    deactivate: onDeactivate,
  }
}

export default useWallet
