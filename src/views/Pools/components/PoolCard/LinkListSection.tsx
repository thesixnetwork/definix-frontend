import React from 'react'
import { Link } from 'definixswap-uikit'

const LinkListSection: React.FC<{
  isMobile: boolean
  klaytnScopeAddress: string
}> = ({ isMobile, klaytnScopeAddress }) => {
  return (
    <>
      {!!klaytnScopeAddress.length && (
        <Link
          external
          href={`https://scope.klaytn.com/account/${klaytnScopeAddress}`}
          bold={false}
          className="flex-shrink"
          color="textSubtle"
          fontSize="12px"
        >
          KlaytnScope
          {/* <ChevronRightIcon color="textSubtle" /> */}
        </Link>
      )}
    </>
  )
}

export default LinkListSection
