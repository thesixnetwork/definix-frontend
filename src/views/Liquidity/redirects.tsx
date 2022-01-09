import React from 'react'
import { Redirect, useParams } from 'react-router-dom'
import AddLiquidity from './index'

const OLD_PATH_STRUCTURE = /^(0x[a-fA-F0-9]{40})-(0x[a-fA-F0-9]{40})$/
export function RedirectOldAddLiquidityPathStructure() {
  const params = useParams<{ currencyIdA: string }>()
  const match = params?.currencyIdA?.match(OLD_PATH_STRUCTURE)

  console.log('~~~', match)
  if (match && match?.length) {
    return <Redirect to={`/add/${match[1]}/${match[2]}`} />
  }

  return <AddLiquidity />
}

export function RedirectDuplicateTokenIds() {
  const params = useParams<{ currencyIdA: string; currencyIdB: string }>()
  if (params?.currencyIdA?.toLowerCase() === params?.currencyIdB?.toLowerCase()) {
    return <Redirect to={`/add/${params?.currencyIdA}`} />
  }
  return <AddLiquidity />
}
