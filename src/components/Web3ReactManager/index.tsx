import React, { useEffect } from 'react'
import { useCaverJsReact } from '@sixnetwork/caverjs-react-core'

import { network } from '../../connectors'
import { useEagerConnect, useInactiveListener } from '../../hooks'
import { NetworkContextName } from '../../constants'

export default function Web3ReactManager({ children }: { children: JSX.Element }) {
  const { active } = useCaverJsReact()
  const { active: networkActive, error: networkError, activate: activateNetwork } = useCaverJsReact(NetworkContextName)

  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
  useEffect(() => {
    if (triedEager && !networkActive && !networkError && !active) {
      activateNetwork(network)
    }
  }, [triedEager, networkActive, networkError, activateNetwork, active])

  // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  useInactiveListener(!triedEager)

  return children
}
