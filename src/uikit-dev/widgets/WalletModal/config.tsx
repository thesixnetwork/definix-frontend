import Kaikas from './icons/Kaikas'
import Dcent from './icons/Dcent'
import { Config } from './types'

const connectors: Config[] = [
  {
    title: 'Kaikas',
    icon: Kaikas,
    connectorId: 'injected',
  },
  {
    title: 'D`CENT',
    icon: Dcent,
    connectorId: 'injected',
  },
]

export default connectors
export const localStorageKey = 'accountStatus'
