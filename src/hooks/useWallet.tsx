import { useCaverJsReact } from '@sixnetwork/caverjs-react-core'
import { useMemo } from 'react'
import useCaverJsReactForWallet from './useCaverJsReactForWallet'

const useWallet = () => {
  const { library, account, chainId, connector, active, activate, deactivate } = useCaverJsReact()
  const { login, logout } = useCaverJsReactForWallet()

  const klaytn = useMemo(() => library?.provider || undefined, [library])

  return {
    account,
    chainId,
    library: library || undefined,
    klaytn,
    connect: login,
    reset: logout,
    connector,
    active,
    activate,
    deactivate,
  }
}

export default useWallet
