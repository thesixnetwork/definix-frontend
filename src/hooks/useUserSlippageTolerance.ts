import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSlippage } from '../state/actions'
import { State } from '../state/types'

export default function useUserSlippageTolerance(): [number, (slippage: number) => void] {
  const dispatch = useDispatch()
  const savedSlippageRaw: string | null = localStorage.getItem('slippage')
  const selectedSlippage = useSelector((state: State) => {
    return state.wallet.userSlippage
  })
  const userSlippageTolerance = savedSlippageRaw ? parseInt(savedSlippageRaw, 10) : selectedSlippage

  const setUserSlippage = useCallback(
    (slippage: number) => {
      localStorage.setItem('slippage', JSON.stringify(slippage))
      dispatch(setSlippage(slippage))
    },
    [dispatch],
  )

  return [userSlippageTolerance, setUserSlippage]
}
