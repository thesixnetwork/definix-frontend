import React from 'react'
import styled from 'styled-components'
import { LinkExternal } from '@fingerlabs/definixswap-uikit-v2'
import { useTranslation } from 'react-i18next'

const Link = styled(LinkExternal)`
  ${({ theme }) => theme.textStyle.R_14R};
  color: ${({ theme }) => theme.colors.mediumgrey};
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    ${({ theme }) => theme.textStyle.R_12R};
  }
  text-decoration: underline;
`

const LinkListSection: React.FC<{
  contractAddress: { [key: number]: string }
}> = ({ contractAddress }) => {
  const { t } = useTranslation()
  return (
    <>
      {!!Object.values(contractAddress).length && (
        <Link href={`${process.env.REACT_APP_KLAYTN_URL}/account/${contractAddress[process.env.REACT_APP_CHAIN_ID]}`}>
          {t('KlaytnScope')}
        </Link>
      )}
    </>
  )
}

export default LinkListSection
