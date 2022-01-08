import { Toast, toastTypes } from "@fingerlabs/definixswap-uikit-v2"
import React, { useMemo } from "react"
import { useDispatch } from "react-redux"
import {
  push as pushToast,
  remove as removeToast,
  clear as clearToast,
} from './actions'


export default {}
// Toasts
export const useToast = () => {
  const dispatch = useDispatch()
  const helpers = useMemo(() => {
    const push = (toast: Toast) => dispatch(pushToast(toast))

    return {
      toastError: (title: string, description?: string | React.ReactElement) => {
        return push({ id: new Date().toString(), type: toastTypes.DANGER, title, description })
      },
      toastInfo: (title: string, description?: string | React.ReactElement) => {
        return push({ id: new Date().toString(), type: toastTypes.INFO, title, description })
      },
      toastSuccess: (title: string, description?: string | React.ReactElement) => {
        return push({ id: new Date().toString(), type: toastTypes.SUCCESS, title, description })
      },
      toastWarning: (title: string, description?: string | React.ReactElement) => {
        return push({ id: new Date().toString(), type: toastTypes.WARNING, title, description })
      },
      push,
      remove: (id: string) => dispatch(removeToast(id)),
      clear: () => dispatch(clearToast()),
    }
  }, [dispatch])

  return helpers
}