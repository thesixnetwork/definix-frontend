import React from 'react'
import { LinkExternal, ColorStyles } from 'definixswap-uikit'

const LinkListSection: React.FC<{
  isMobile: boolean
  lpAddresses: { [key: number]: string }
}> = ({ isMobile, lpAddresses }) => {
  return (
    <>
      {!!Object.values(lpAddresses).length && (
        <LinkExternal
          color={ColorStyles.MEDIUMGREY}
          textStyle="R_14R"
          href={`${process.env.REACT_APP_KLAYTN_URL}/account/${lpAddresses[process.env.REACT_APP_CHAIN_ID]}`}
        >
          KlaytnScope
        </LinkExternal>
      )}
    </>
  )
}

export default LinkListSection
