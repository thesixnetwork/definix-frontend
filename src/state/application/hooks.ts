import { useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addPopup, PopupContent, removePopup } from './actions'
import { AppState } from '../index'
import useWallet from 'hooks/useWallet'

export function useBlockNumber(): number | undefined {
  const { chainId } = useWallet()

  return useSelector((state: AppState) => state.application.blockNumber[chainId ?? -1])
}

// returns a function that allows adding a popup
export function useAddPopup(): (content: PopupContent, key?: string) => void {
  const dispatch = useDispatch()

  return useCallback(
    (content: PopupContent, key?: string) => {
      dispatch(addPopup({ content, key }))
    },
    [dispatch],
  )
}

// returns a function that allows removing a popup via its key
export function useRemovePopup(): (key: string) => void {
  const dispatch = useDispatch()
  return useCallback(
    (key: string) => {
      dispatch(removePopup({ key }))
    },
    [dispatch],
  )
}

// get the list of active popups
export function useActivePopups(): AppState['application']['popupList'] {
  const list = useSelector((state: AppState) => state.application.popupList)
  return useMemo(() => list.filter((item) => item.show), [list])
}
