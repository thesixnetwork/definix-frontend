import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Text, ArrowRightGIcon, ColorStyles, Box } from '@fingerlabs/definixswap-uikit-v2'
import { useTranslation } from 'react-i18next'

interface IProps {
  hash: string
}

const WrapLink = styled.a`
  display: flex;
  align-items: center;
`

const KlaytnScopeLink: React.FC<IProps> = ({ hash }) => {
  const { t } = useTranslation()
  const href = useMemo(() => `https://scope.klaytn.com/tx/${hash}`, [hash])
  return (
    <WrapLink href={href} target="_blank">
      <Text textStyle="R_12R" color={ColorStyles.MEDIUMGREY} style={{ whiteSpace: 'pre' }}>
        {t('View on KlaytnScope')}
      </Text>
      <ArrowRightGIcon />
    </WrapLink>
  )
}

export default React.memo(KlaytnScopeLink)
