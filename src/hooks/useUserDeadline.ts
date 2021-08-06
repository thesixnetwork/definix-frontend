import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setDeadline } from '../state/actions'
import { State } from '../state/types'


export default function useUserDeadline(): [number, (slippage: number) => void] {
  const dispatch = useDispatch()
  const savedDeadlineRaw: string | null = localStorage.getItem('deadline')
  const selectedDeadline = useSelector((state: State) => {
    return state.wallet.userDeadline
  })
  const userDeadline = savedDeadlineRaw ? parseInt(savedDeadlineRaw, 10) : selectedDeadline

  const setUserDeadline = useCallback(
    (deadline: number) => {
      localStorage.setItem('deadline', JSON.stringify(deadline))
      dispatch(setDeadline(deadline))
    },
    [dispatch],
  )

  return [userDeadline, setUserDeadline]
}
