import 'styled-components'
import { DefinixTheme } from '@fingerlabs/definixswap-uikit-v2'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends DefinixTheme {}
}
