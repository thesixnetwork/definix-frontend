import { createContext } from 'react'

interface PoolContext {
  pageState: string
  pageData: any
  goDeposit: (pageData: any) => void
  goWithdraw: (pageData: any) => void
}

const PoolContext = createContext<PoolContext>({
  pageState: '',
  pageData: null,
  goDeposit: () => null,
  goWithdraw: () => null,
})

export default PoolContext
