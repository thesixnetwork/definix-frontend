import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import React, { useState, useMemo, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { QuoteToken } from 'config/constants/types'
import { useSousHarvest } from 'hooks/useHarvest'
import useConverter from 'hooks/useConverter'
import { getBalanceNumber } from 'utils/formatBalance'
import { Button, Text, ButtonVariants, Flex, Box, Label, ColorStyles } from 'definixswap-uikit'
import CurrencyText from 'components/CurrencyText'

interface HarvestActionAirdropProps {
  componentType?: string
  isMobile: boolean
  isOldSyrup?: boolean
  isBnbPool?: boolean
  sousId?: number
  pendingRewards?: any
  bundleRewards?: any
  earnings: BigNumber
  needsApproval?: boolean
}

const HarvestActionAirdrop: React.FC<HarvestActionAirdropProps> = ({
  componentType = 'pool',
  isMobile,
  isOldSyrup,
  isBnbPool,
  sousId,
  pendingRewards,
  bundleRewards,
  earnings,
  needsApproval,
}) => {
  const { t } = useTranslation()
  const navigate = useHistory()
  const isInPool = useMemo(() => componentType === 'pool', [componentType])
  const { account } = useWallet()
  const { onReward } = useSousHarvest(sousId, isBnbPool)
  const { convertToUSD, convertToPriceFromSymbol, convertToBalanceFormat, convertToPriceFormat } = useConverter()
  // const [onPresentAirDropHarvestModal] = useModal(<AirDropHarvestModal />)
  const [pendingTx, setPendingTx] = useState(false)

  const finixPrice = convertToPriceFromSymbol(QuoteToken.FINIX)
  const finixEarningsValue = useMemo(() => {
    return getBalanceNumber(earnings)
  }, [earnings])
  const getEarningsPrice = useCallback(
    (value) => {
      return convertToPriceFormat(new BigNumber(value).multipliedBy(finixPrice).toNumber())
    },
    [finixPrice, convertToPriceFormat],
  )

  // const finixApy = pool.finixApy || new BigNumber(0)

  const handleGoToDetail = useCallback(() => {
    navigate.push('/pool')
  }, [navigate])

  const Wrap = styled(Flex)<{ isInPool: boolean }>`
    flex-direction: ${isInPool ? 'column' : 'row'};
    justify-content: space-between;
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      flex-direction: column;
    }
  `
  const TitleSection = styled(Text)`
    margin-bottom: ${({ theme }) => theme.spacing.S_8}px;
    color: ${({ theme }) => theme.colors.mediumgrey};
    ${({ theme }) => theme.textStyle.R_12R};
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      margin-bottom: ${({ theme }) => theme.spacing.S_6}px;
    }
  `
  const HarvestInfo = styled(Flex)`
    flex-direction: row;
    justify-content: space-between;
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      flex-direction: column;
    }
  `
  const TokenLabel = styled(Label)`
    margin-right: ${({ theme }) => theme.spacing.S_6}px;
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      margin-right: ${({ theme }) => theme.spacing.S_12}px;
    }
  `
  const BalanceText = styled(Text)`
    color: ${({ theme }) => theme.colors.black};
    ${({ theme }) => theme.textStyle.R_18M};
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      ${({ theme }) => theme.textStyle.R_16M};
    }
  `
  const PriceText = styled(CurrencyText)`
    color: ${({ theme }) => theme.colors.deepgrey};
    ${({ theme }) => theme.textStyle.R_14R};
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      ${({ theme }) => theme.textStyle.R_12R};
    }
  `
  const HarvestButtonInPool = styled(Box)`
    width: 100px;
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      margin-top: ${({ theme }) => theme.spacing.S_20}px;
      width: 100%;
    }
  `
  const HarvestButtonInMyInvestment = styled(Flex)`
    flex-direction: column;
    justify-content: center;
    width: 100px;
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      flex-direction: row;
      margin-top: ${({ theme }) => theme.spacing.S_28}px;
      width: 100%;
    }
  `

  const AirDrop = ({ value, name }) => (
    <Flex>
      <TokenLabel type="token">{name}</TokenLabel>
      <Box>
        <BalanceText>
          {convertToBalanceFormat(value)}
        </BalanceText>
        <PriceText value={getEarningsPrice(value)} prefix="="/>
      </Box>
    </Flex>
  )

  const HarvestButton = () => (
    <Button
      variant={ButtonVariants.RED}
      width="100%"
      disabled={!account || (needsApproval && !isOldSyrup) || !earnings.toNumber() || pendingTx}
      onClick={async () => {
        setPendingTx(true)
        await onReward()
        setPendingTx(false)
      }}
    >
      {t('Harvest')}
    </Button>
  )
  const DetailButton = () => (
    <Button
      variant={ButtonVariants.BROWN}
      width="100%"
      onClick={handleGoToDetail}
      className={isMobile ? 'ml-s16' : 'mt-s8'}
    >
      {t('Detail')}
    </Button>
  )

  return (
    <>
      <Box>
        <Wrap isInPool={isInPool}>
          <Box>
            <TitleSection>{t('Earned Token')}</TitleSection>
            <HarvestInfo>
              <Box>
                <AirDrop name="FINIX" value={finixEarningsValue} />
                {(bundleRewards || []).map((br, bundleId) => {
                  const reward = getBalanceNumber((pendingRewards[bundleId] || {}).reward) || 0
                  const allocate = br.rewardPerBlock || new BigNumber(0)
                  return reward !== 0 || allocate.toNumber() !== 0 ? (
                    <AirDrop
                      name={br.rewardTokenInfo.name === 'WKLAY' ? 'KLAY' : br.rewardTokenInfo.name}
                      value={reward}
                    />
                  ) : null
                })}
              </Box>
              {isInPool && (
                <HarvestButtonInPool>
                  <HarvestButton />
                </HarvestButtonInPool>
              )}
            </HarvestInfo>
          </Box>
          {isInPool ? null : (
            <HarvestButtonInMyInvestment>
              <HarvestButton />
              <DetailButton />
            </HarvestButtonInMyInvestment>
          )}
        </Wrap>
      </Box>
    </>
  )
}

export default HarvestActionAirdrop
