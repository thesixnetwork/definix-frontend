import { useEffect, useMemo, useRef, useCallback } from 'react'
import getLibrary from 'utils/getLibrary'
import KlaytnWallet, { AvailableConnectors, WalletError } from 'klaytn-wallets'
import useKlipModal, { renderKlipTimeFormat } from './useKlipModal'
import { useDispatch, useSelector } from 'react-redux'
import { setAccount, setConnector } from '../state/wallet'
import { State } from '../state/types'
import { useToast } from '../state/toasts/hooks'
import { useTranslation } from 'react-i18next'

const useWallet = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch()
  const { toastError } = useToast();
  const account = useSelector((state: State) => {
    return state.wallet.account
  })
  const connector = useSelector((state: State) => {
    return state.wallet.connector
  })
  const wallet = useRef(
    new KlaytnWallet([AvailableConnectors.KAIKAS, AvailableConnectors.KLIP, AvailableConnectors.METAMASK, AvailableConnectors.DCENT, AvailableConnectors.TOKENPOCKET]),
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
          return renderKlipTimeFormat(time)
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
      try {
        if (wallet.current.isAvailable(connectorId)) {
          await wallet.current.activate(connectorId)
          dispatch(setAccount(wallet.current.account))
          dispatch(setConnector(wallet.current.connectorId))
        } else {
          toastError(
            t('Provider Error'),
          )
        }
      } catch (e: any) {
        if (e.message === WalletError.USER_DENIED) {
          toastError(
            t('Authorization Error'),
          )
        }
        console.error(e.message);
      }
    },
    [wallet.current],
  )

  const onDeactivate = useCallback(() => {
    wallet.current.deactivate()
    dispatch(setAccount(wallet.current.account))
    dispatch(setConnector(wallet.current.connectorId))
  }, [wallet.current])

  const library = useMemo(() => window.caver ? getLibrary(window.klaytn) : undefined, [])
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
