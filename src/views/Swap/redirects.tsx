import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import Swap from './index'

// Redirects to swap but only replace the pathname
export function RedirectPathToSwapOnly({ location }: RouteComponentProps) {
  return <Redirect to={{ ...location, pathname: '/swap' }} />
}

export function RedirectToSwap(props) {
  const {
    match: {
      params: { currencyIdA, currencyIdB },
    },
  } = props
  if (currencyIdA && currencyIdB && currencyIdA.toLowerCase() === currencyIdB.toLowerCase()) {
    // if (isInjectConnect()) activate(injected)
    const translateToken = currencyIdA === '0x0000000000000000000000000000000000000000' ? 'KLAY' : currencyIdA
    return <Redirect to={`/swap?inputCurrency=${translateToken}`} />
  }
  if (currencyIdA && !currencyIdB) {
    // if (isInjectConnect()) activate(injected)
    const translateToken = currencyIdA === '0x0000000000000000000000000000000000000000' ? 'KLAY' : currencyIdA
    return <Redirect to={`/swap?inputCurrency=${translateToken}`} />
  }
  if (currencyIdA && currencyIdB) {
    // if (isInjectConnect()) activate(injected)
    const translateToken = currencyIdA === '0x0000000000000000000000000000000000000000' ? 'KLAY' : currencyIdA
    const translateTokenB = currencyIdB === '0x0000000000000000000000000000000000000000' ? 'KLAY' : currencyIdB
    return <Redirect to={`/swap?inputCurrency=${translateToken}&outputCurrency=${translateTokenB}`} />
  }
  // if (isInjectConnect()) activate(injected)
  return <Swap />
}

export default RedirectPathToSwapOnly
