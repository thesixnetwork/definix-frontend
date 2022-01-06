import { CaverProvider } from 'finix-caver-providers'
import { useCaverJsReact as useCaverJsReactCore } from '@sixnetwork/caverjs-react-core'
// eslint-disable-next-line import/no-unresolved
import { CaverJsReactContextInterface } from '@sixnetwork/caverjs-react-core/dist/types'
import { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { injected } from '../connectors'
import { NetworkContextName } from '../constants'

export function useActiveWeb3React() {
  const context = useCaverJsReactCore<CaverProvider>()
  const contextNetwork = useCaverJsReactCore<CaverProvider>(NetworkContextName)
  return context.active ? context : contextNetwork
}

export function useEagerConnect() {
  const { activate, active } = useCaverJsReactCore() // specifically using useCaverJsReactCore because of what this hook does
  const [tried, setTried] = useState(false)
  const isInjectConnect = () => window.localStorage.getItem("connector") === "injected"
  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      const hasSignedIn = window.localStorage.getItem('accountStatus')
      if (isAuthorized && hasSignedIn && isInjectConnect()) {
        activate(injected, undefined, true).catch(() => {
          setTried(true)
        })
      } else if (isMobile && window.klaytn && hasSignedIn && isInjectConnect()) {
        activate(injected, undefined, true).catch(() => {
          setTried(true)
        })
      } else {
        setTried(true)
      }
    })
  }, [activate]) // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (active) {
      setTried(true)
    }
  }, [active])

  return tried
}

/**
 * Use for network and injected - logs user in
 * and out after checking what network theyre on
 */
export function useInactiveListener(suppress = false) {
  const { active, error, activate } = useCaverJsReactCore() // specifically using useCaverJsReact because of what this hook does

  useEffect(() => {
    const { klaytn } = window

    if (klaytn && klaytn.on && !active && !error && !suppress) {
      const handleChainChanged = () => {
        // eat errors
        activate(injected, undefined, true).catch((e) => {
          console.error('Failed to activate after chain changed', e)
        })
      }

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          // eat errors
          activate(injected, undefined, true).catch((e) => {
            console.error('Failed to activate after accounts changed', e)
          })
        }
      }

      klaytn.on('chainChanged', handleChainChanged)
      klaytn.on('accountsChanged', handleAccountsChanged)

      return () => {
        if (klaytn.removeListener) {
          klaytn.removeListener('chainChanged', handleChainChanged)
          klaytn.removeListener('accountsChanged', handleAccountsChanged)
        }
      }
    }
    return undefined
  }, [active, error, suppress, activate])
}
