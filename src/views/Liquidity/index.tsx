import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Flex, TitleSet, useMatchBreakpoints, Tabs, ColorStyles } from '@fingerlabs/definixswap-uikit-v2'
import LiquidityList from './LiquidityList'
import AddLiquidity from './AddLiquidity'

const Liquidity: React.FC = () => {
  const { isXl, isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXl && !isXxl, [isXl, isXxl])
  const { t, i18n } = useTranslation()

  const gitbookLink = useMemo(
    () =>
      i18n.language === 'ko'
        ? 'https://sixnetwork.gitbook.io/definix-on-klaytn-kr/exchange/how-to-add-liquidity'
        : 'https://sixnetwork.gitbook.io/definix-on-klaytn-en/exchange/how-to-add-liquidity',
    [i18n.language]
  )

  const tabNames = useMemo(() => [t('Add'), t('Remove')], [t])
  const [curTab, setCurTab] = useState<string>(tabNames[0])

  return (
    <Flex width="100%" justifyContent="center">
      <Flex flexDirection="column" width={isMobile ? '100%' : '629px'}>
        <Flex mb="40px">
          <TitleSet
            title={t('Liquidity')}
            description={t('Pair tokens and add to liquidity to earn high interest profit')}
            link={gitbookLink}
            linkLabel={t('Learn how to add Liquidity')}
          />
        </Flex>
        <Flex flexDirection="column">
          <Box
            backgroundColor={ColorStyles.WHITE}
            borderTopLeftRadius="16px"
            borderTopRightRadius="16px"
            borderTop="1px solid #ffe5c9"
            borderLeft="1px solid #ffe5c9"
            borderRight="1px solid #ffe5c9"
            style={{ boxShadow: '0 12px 12px 0 rgba(227, 132, 0, 0.1)' }}
          >
            <Tabs tabs={tabNames} curTab={curTab} setCurTab={setCurTab} equal={isMobile} />
          </Box>
          <Box pb={isMobile ? '40px' : '80px'}>
            {curTab === tabNames[0] && <AddLiquidity />}
            {curTab === tabNames[1] && <LiquidityList />}
          </Box>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default React.memo(Liquidity)
