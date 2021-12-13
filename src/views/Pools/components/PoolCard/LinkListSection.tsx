import React from 'react'
import styled from 'styled-components'
import { LinkExternal } from 'definixswap-uikit-v2'

const LinkListSection: React.FC<{
  contractAddress: { [key: number]: string }
}> = ({ contractAddress }) => {
  const Link = styled(LinkExternal)`
    ${({ theme }) => theme.textStyle.R_14R};
    color: ${({ theme }) => theme.colors.mediumgrey};
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      ${({ theme }) => theme.textStyle.R_12R};
    }
  `
  return (
    <>
      {!!Object.values(contractAddress).length && (
        <Link href={`${process.env.REACT_APP_KLAYTN_URL}/account/${contractAddress[process.env.REACT_APP_CHAIN_ID]}`}>
          KlaytnScope
        </Link>
      )}
    </>
  )
}

export default LinkListSection
