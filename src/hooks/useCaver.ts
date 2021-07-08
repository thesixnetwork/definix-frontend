import { useEffect, useState, useRef } from 'react'
import Caver from 'caver-js'
import { provider as ProviderType } from 'web3-core'
import { useWallet } from '@kanthakarn-test/klaytn-use-wallet'
import getRpcUrl from 'utils/getRpcUrl'

const RPC_URL = getRpcUrl()
const httpProvider = new Caver.providers.HttpProvider(RPC_URL)

/**
 * Provides a caver instance using the provider provided by useWallet
 * with a fallback of an httpProver
 * Recreate web3 instance only if the ethereum provider change
 */
const useCaver = () => {
  const { klaytn }: { klaytn: ProviderType } = useWallet()
  const refKlay = useRef(klaytn)
  const [caver, setCaver] = useState(new Caver(klaytn || httpProvider))

  useEffect(() => {
    if (klaytn !== refKlay.current) {
      // @ts-ignore
      setCaver(window.caver || new Caver(klaytn || httpProvider))
      refKlay.current = klaytn
    }
  }, [klaytn])

  return caver
}

export default useCaver
