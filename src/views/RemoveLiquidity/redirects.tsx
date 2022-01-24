import { ROUTES } from 'config/constants/routes'
import React from 'react'
import { Redirect, useParams } from 'react-router-dom'

const OLD_PATH_STRUCTURE = /^(0x[a-fA-F0-9]{40})-(0x[a-fA-F0-9]{40})$/

export function RedirectOldRemoveLiquidityPathStructure() {
  const params = useParams<{ tokens: string }>()

  if (!OLD_PATH_STRUCTURE.test(params?.tokens)) {
    return <Redirect to={ROUTES.POOL} />
  }
  const [currency0, currency1] = params?.tokens.split('-')

  return <Redirect to={`/remove/${currency0}/${currency1}`} />
}

export default RedirectOldRemoveLiquidityPathStructure
