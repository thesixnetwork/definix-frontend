import { createContext } from 'react'

interface FarmContext {
  pageState: string
  pageData: any
  goDeposit: (pageData: any) => void
  goWithdraw: (pageData: any) => void
  goList: () => void
}

const FarmContext = createContext<FarmContext>({
  pageState: '',
  pageData: null,
  goDeposit: () => null,
  goWithdraw: () => null,
  goList: () => null
})

export default FarmContext
