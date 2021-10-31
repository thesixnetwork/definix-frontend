import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import Swap from './index'

// Redirects to swap but only replace the pathname
export function RedirectPathToSwapOnly({ location }: RouteComponentProps) {
  return <Redirect to={{ ...location, pathname: '/swap' }} />
}

export function RedirectToSwap(props: RouteComponentProps<{ currencyIdA: string; currencyIdB: string }>) {
  const {
    match: {
      params: { currencyIdA, currencyIdB },
    },
  } = props
  if (currencyIdA && currencyIdB && currencyIdA.toLowerCase() === currencyIdB.toLowerCase()) {
    return <Redirect to={`/swap?inputCurrency=${currencyIdA}`} />
  }
  if (currencyIdA && !currencyIdB) {
    return <Redirect to={`/swap?inputCurrency=${currencyIdA}`} />
  }
  if (currencyIdA && currencyIdB) {
    return <Redirect to={`/swap?inputCurrency=${currencyIdA}&outputCurrency=${currencyIdB}`} />
  }
  return <Swap {...props} />
}

export default RedirectPathToSwapOnly
