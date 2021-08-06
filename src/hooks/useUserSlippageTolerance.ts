import { createAction } from '@reduxjs/toolkit'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const updateUserSlippageTolerance = createAction<{ userSlippageTolerance: number }>('user/updateUserSlippageTolerance')

export default function useUserSlippageTolerance(): [number, (slippage: number) => void] {
  const dispatch = useDispatch<AppDispatch>()
  const userSlippageTolerance = useSelector<AppState, AppState['user']['userSlippageTolerance']>((state) => {
    return state.user.userSlippageTolerance
  })

  const setUserSlippageTolerance = useCallback(
    (slippageTolerance: number) => {
      dispatch(updateUserSlippageTolerance({ userSlippageTolerance: slippageTolerance }))
    },
    [dispatch],
  )

  return [userSlippageTolerance, setUserSlippageTolerance]
}
