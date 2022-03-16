import { useCaverJsReact } from '@sixnetwork/caverjs-react-core'
import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import getLibrary from 'utils/getLibrary'
import useCaverJsReactForWallet from './useCaverJsReactForWallet'
import KlaytnWallet, { AvailableConnectors } from 'klaytn-wallets';

const useWallet = () => {
  const [account, setAccount] = useState<string>('');
  const [connector, setConnector] = useState<string>('');
  const wallet = useRef(new KlaytnWallet([AvailableConnectors.KAIKAS, AvailableConnectors.KLIP, AvailableConnectors.METAMASK]))
  // const { account, chainId, connector, activate, deactivate } = useCaverJsReact()

  useEffect(() => {
    if (!wallet.current) return;
    wallet.current.initKlip();
  }, [wallet.current])

  const onActivate = useCallback(async (connectorId: string) => {
    await wallet.current.activate(connectorId)
    setAccount(wallet.current.account);
    setConnector(wallet.current.connector);
  }, [wallet.current])

  const onDeactivate = useCallback(() => {
    wallet.current.deactivate()
    setAccount(wallet.current.account);
    setConnector(wallet.current.connector);
  }, [wallet.current])
  
  // const { login, logout } = useCaverJsReactForWallet()
  const library = useMemo(() => getLibrary(window.klaytn), []);
  const klaytn = useMemo(() => library?.provider || undefined, [library])

  return {
    account,
    chainId: 1001 || parseInt(process.env.REACT_APP_CHAIN_ID),
    library,
    klaytn,
    connect: onActivate,
    reset: onDeactivate,
    connector,
    // active,
    activate: onActivate,
    deactivate: onDeactivate,
  }
}

export default useWallet
