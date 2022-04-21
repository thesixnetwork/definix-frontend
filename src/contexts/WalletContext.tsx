import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import KlaytnWallet, { AvailableConnectors, WalletError } from '@fingerlabs/klaytn-wallets'
import { useToast } from 'state/toasts/hooks'
import { useTranslation } from 'react-i18next'
import getLibrary from 'utils/getLibrary'
import { renderKlipTimeFormat } from 'hooks/useKlipModal'
import { Text } from '@fingerlabs/definixswap-uikit-v2'
import { getCaver } from 'utils/caver'

interface WalletState {
  wallet: KlaytnWallet
  account: string
  connector: string
  chainId: number
  library: any
  klaytn: any
  activate: (connectorId: AvailableConnectors | string) => Promise<void>
  deactivate: () => void
  initKlip: (callback: { show: () => void; hide: () => void }) => void
}

const WalletContext = createContext<WalletState>({
  wallet: null,
  account: null,
  connector: null,
  chainId: parseInt(process.env.REACT_APP_CHAIN_ID) || 1001,
  library: null,
  klaytn: null,
  activate: () => Promise.resolve(),
  deactivate: () => {
    return
  },
  initKlip: () => {
    return
  },
})

const WalletContextProvider = ({ children }) => {
  const { t } = useTranslation()
  const [isInit, setIsInit] = useState<boolean>(false)
  const [account, setAccount] = useState<string>()
  const [connector, setConnector] = useState<AvailableConnectors>()
  const { toastError, toastSuccess } = useToast()
  const wallet = useRef<KlaytnWallet>()

  const onActivate = async (connectorId: AvailableConnectors) => {
    try {
      if (wallet.current.isAvailable(connectorId)) {
        await wallet.current.activate(connectorId)
        setAccount(wallet.current.account)
        // @ts-ignore
        setConnector(wallet.current.connectorId as AvailableConnectors)
        toastSuccess(t('Wallet Connected'))
      } else {
        toastError(
          t('Provider Error'),
          <Text textStyle="R_12R" color="mediumgrey">
            {t('No provider was found')}
          </Text>,
        )
      }
    } catch (e: any) {
      if (e.message === WalletError.USER_DENIED) {
        toastError(
          t('Authorization Error'),
          <Text textStyle="R_12R" color="mediumgrey">
            {t('Please authorize to access your account')}
          </Text>,
        )
      }
      console.error(e.message)
    }
  }

  const onDeactivate = useCallback(() => {
    wallet.current.deactivate()
    setAccount(wallet.current.account)
    // @ts-ignore
    setConnector(wallet.current.connectorId as AvailableConnectors)
  }, [wallet.current])

  useEffect(() => {
    if (wallet.current) return
    // dcent inapp browser 관련 처리
    setTimeout(() => {
      wallet.current = new KlaytnWallet([
        AvailableConnectors.KAIKAS,
        AvailableConnectors.KLIP,
        AvailableConnectors.METAMASK,
        AvailableConnectors.DCENT,
        AvailableConnectors.TOKENPOCKET,
      ])

      if (!wallet.current.isConnected()) {
        // @ts-ignore
        onActivate(wallet.current.connectorId)
      }
    }, 100)
  }, [wallet.current])

  const library = getLibrary(window.caver ? window.klaytn : getCaver().currentProvider)
  const klaytn = useMemo(() => library?.provider || undefined, [library])

  const initKlip = (callback: { show: () => void; hide: () => void }) => {
    if (isInit || !wallet.current) return
    wallet.current.initKlip(
      {
        qrClassName: 'klip-qr',
        intervalClassName: 'klip-interval',
        renderTimeFormat(time: number) {
          return renderKlipTimeFormat(time)
        },
      },
      callback,
    )
    setIsInit(true)
  }

  return (
    <WalletContext.Provider
      value={{
        wallet: wallet.current,
        account,
        chainId: parseInt(process.env.REACT_APP_CHAIN_ID) || 1001,
        library,
        klaytn,
        connector,
        activate: (connectorId) => onActivate(connectorId as AvailableConnectors),
        deactivate: onDeactivate,
        initKlip,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export { WalletContext, WalletContextProvider }
