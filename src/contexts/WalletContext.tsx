import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import KlaytnWallet, { AvailableConnectors, WalletError } from 'six-kaia-wallet-kit'
import { useToast } from 'state/toasts/hooks'
import { useTranslation } from 'react-i18next'
import getLibrary from 'utils/getLibrary'
import { renderKlipTimeFormat } from 'hooks/useKlipModal'
import { Text } from '@fingerlabs/definixswap-uikit-v2'
import { getCaver } from 'utils/caver'

type ConnId = AvailableConnectors | null

interface WalletState {
  wallet: KlaytnWallet | null
  account: string | null
  connector: ConnId
  chainId: number
  library: any | null
  klaytn: any | null
  activate: (connectorId: AvailableConnectors | string) => Promise<void>
  deactivate: () => void
  initKlip: (callback: { show: () => void; hide: () => void }) => void
}

const CHAIN_ID = parseInt(process.env.REACT_APP_CHAIN_ID || '', 10) || 1001
const CACHE_KEY = 'wallet:connectorId'

const WalletContext = createContext<WalletState>({
  wallet: null,
  account: null,
  connector: null,
  chainId: parseInt(process.env.REACT_APP_CHAIN_ID) || 1001,
  library: null,
  klaytn: null,
  activate: () => Promise.resolve(),
  deactivate: () => {
    return undefined
  },
  initKlip: () => {
    return undefined
  },
})

const WalletContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation()
  const { toastError, toastSuccess } = useToast()

  const walletRef = useRef<KlaytnWallet | null>(null)
  const [account, setAccount] = useState<string | null>(null)
  const [connector, setConnector] = useState<ConnId>(null)
  const [isInit, setIsInit] = useState<boolean>(false)

  const onActivate = useCallback(async (connectorId: AvailableConnectors) => {
    const w = walletRef.current
    if (!w) return
    try {
      if (w.isAvailable(connectorId)) {
        await w.activate(connectorId)
        setAccount(w.account || null)
        setConnector((w as any).connectorId || connectorId)
        localStorage.setItem(CACHE_KEY, String(connectorId))
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
      if (e?.message === WalletError.USER_DENIED) {
        toastError(
          t('Authorization Error'),
          <Text textStyle="R_12R" color="mediumgrey">
            {t('Please authorize to access your account')}
          </Text>,
        )
      }
      // eslint-disable-next-line no-console
      console.error(e?.message || e)
    }
  }, [t, toastError, toastSuccess])

  const onDeactivate = useCallback(() => {
    const w = walletRef.current
    if (!w) return
    w.deactivate()
    setAccount(w.account || null)
    setConnector((w as any).connectorId || null)
    localStorage.removeItem(CACHE_KEY)
  }, [])

  useEffect(() => {
    if (walletRef.current) return
    walletRef.current = new KlaytnWallet([
      AvailableConnectors.KAIKAS,
      AvailableConnectors.KLIP,
      AvailableConnectors.METAMASK,
      AvailableConnectors.DCENT,
      AvailableConnectors.TOKENPOCKET,
    ])

    if ((window as any).klaytn) {
      window.klaytn.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts?.[0] || null)
      })
    }

    const cached = (localStorage.getItem(CACHE_KEY) as AvailableConnectors | null) || null
    if (cached && walletRef.current.isAvailable(cached)) {
      onActivate(cached)
    }
  }, [onActivate])

  const library = useMemo(() => {
    if (!account) return null
    const provider = (window as any).caver ? (window as any).klaytn : getCaver().currentProvider
    return getLibrary(provider)
  }, [account])

  const klaytn = useMemo(() => (library ? library.provider : null), [library])

  const initKlip = (callback: { show: () => void; hide: () => void }) => {
    if (isInit || !walletRef.current) return
    walletRef.current.initKlip(
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
        wallet: walletRef.current || null,
        account,
        chainId: CHAIN_ID,
        library,
        klaytn,
        connector,
        activate: (id) => onActivate(id as AvailableConnectors),
        deactivate: onDeactivate,
        initKlip,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export { WalletContext, WalletContextProvider }

