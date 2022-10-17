import React, { createContext } from 'react'

interface ModalsContext {
  onPresent?: (node: React.ReactNode, key?: string) => void
  onDismiss?: () => void
  pageState?: string
  pageData?: any
  goDeposit?: (pageData: any) => void
  goWithdraw?: (pageData: any) => void
}

const FarmContext = createContext<ModalsContext>({
  onPresent: () => null,
  onDismiss: () => null,
  pageState: '',
  pageData: null,
  goDeposit: () => null,
  goWithdraw: () => null,
})

export default FarmContext
