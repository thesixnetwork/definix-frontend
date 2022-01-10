import { useCaverJsReact } from '@sixnetwork/caverjs-react-core';
import useCaverJsReactForWallet from './useCaverJsReactForWallet';

const useWallet = () => {
  const { library, account, chainId, connector, active, activate, deactivate } = useCaverJsReact();
  const { login, logout } = useCaverJsReactForWallet();

  return {
    account,
    chainId,
    library,
    klaytn: library?.provider || undefined,
    connect: login,
    reset: logout,
    connector,
    active,
    activate,
    deactivate
  }
}

export default useWallet;