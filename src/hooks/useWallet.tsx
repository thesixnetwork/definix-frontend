import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import getLibrary from 'utils/getLibrary'
import KlaytnWallet, { AvailableConnectors } from 'klaytn-wallets';
import { useModal } from '@fingerlabs/definixswap-uikit-v2';
import KlipModal from 'components/KlipModal';
import dayjs from 'dayjs';

const useWallet = () => {
  const [account, setAccount] = useState<string>('');
  const [connector, setConnector] = useState<string>('');
  const wallet = useRef(new KlaytnWallet([AvailableConnectors.KAIKAS, AvailableConnectors.KLIP, AvailableConnectors.METAMASK]))

  const [onPresentKlipModal, onDismissKlipModal] = useModal(<KlipModal onHide={() => {
    wallet.current.closeKlip();
  }} />)

  useEffect(() => {
    if (!wallet.current) return;
    wallet.current.initKlip({
      renderTimeFormat(time: number) {
        const expireDuration = dayjs(time)
        return `
          ${expireDuration.minute()} min ${expireDuration.second()} sec
        `
      }
    }, {
      show: () => onPresentKlipModal(),
      hide: () => onDismissKlipModal(),
    });
  }, [wallet.current])

  const onActivate = useCallback(async (connectorId: string) => {
    await wallet.current.activate(connectorId)
    setAccount(wallet.current.account);
    setConnector(wallet.current.connectorId);
  }, [wallet.current])

  const onDeactivate = useCallback(() => {
    wallet.current.deactivate()
    setAccount(wallet.current.account);
    setConnector(wallet.current.connectorId);
  }, [wallet.current])
  
  const library = useMemo(() => getLibrary(window.klaytn), []);
  const klaytn = useMemo(() => library?.provider || undefined, [library])

  return {
    account,
    chainId: 1001 || parseInt(process.env.REACT_APP_CHAIN_ID),
    library,
    klaytn,
    connector,
    activate: onActivate,
    deactivate: onDeactivate,
  }
}

export default useWallet
