import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import React, { useState, useMemo, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { QuoteToken } from 'config/constants/types'
import { useSousHarvest } from 'hooks/useHarvest'
import useConverter from 'hooks/useConverter'
import { useFarmUser } from 'state/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import { Button, Text, ButtonVariants, Flex, Box, Label } from 'definixswap-uikit-v2'
import CurrencyText from 'components/CurrencyText'

const Wrap = styled(Flex)<{ isInPool: boolean }>`
  flex-direction: ${({ isInPool }) => (isInPool ? 'column' : 'row')};
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
const TokenValueWrap = styled(Box)`
  margin-top: -3px;
`
const BalanceText = styled(Text)`
  color: ${({ theme }) => theme.colors.black};
  ${({ theme }) => theme.textStyle.R_18M};
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    ${({ theme }) => theme.textStyle.R_16M};
  }
`
const PriceText = styled(CurrencyText)`
  color: ${({ theme }) => theme.colors.mediumgrey};
  ${({ theme }) => theme.textStyle.R_14R};
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    ${({ theme }) => theme.textStyle.R_12R};
  }
`
const HarvestButtonSectionInPool = styled(Box)`
  width: 100px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin-top: ${({ theme }) => theme.spacing.S_20}px;
    width: 100%;
  }
`
const HarvestButtonSectionInMyInvestment = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  width: 100px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    flex-direction: row;
    margin-top: ${({ theme }) => theme.spacing.S_28}px;
    width: 100%;
  }
`
const DetailButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing.S_8}px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin-top: 0;
    margin-left: ${({ theme }) => theme.spacing.S_16}px;
  }
`

const HarvestActionAirdrop: React.FC<{
  componentType?: string
  isOldSyrup?: boolean
  isBnbPool?: boolean
  needsApprovalContract: boolean
  sousId?: number
  farm: any
  earnings: BigNumber
}> = ({
  componentType = 'pool',
  isOldSyrup = false,
  isBnbPool = false,
  sousId,
  farm,
  earnings,
  needsApprovalContract,
}) => {
  const { t } = useTranslation()
  const navigate = useHistory()
  const isInPool = useMemo(() => componentType === 'pool', [componentType])
  const { convertToPriceFromSymbol, convertToBalanceFormat, convertToPriceFormat } = useConverter()
  const { account } = useWallet()
  const { onReward } = useSousHarvest(sousId, isBnbPool)
  const { pendingRewards } = useFarmUser(farm.pid)
  const [pendingTx, setPendingTx] = useState(false)

  const finixEarningsValue = useMemo(() => getBalanceNumber(earnings), [earnings])
  const getEarningsPrice = useCallback(
    (value) => {
      const finixPrice = convertToPriceFromSymbol(QuoteToken.FINIX)
      return convertToPriceFormat(new BigNumber(value).multipliedBy(finixPrice).toNumber())
    },
    [convertToPriceFormat, convertToPriceFromSymbol],
  )
  const handleGoToDetail = useCallback(() => navigate.push('/pool'), [navigate])

  const renderAirDrop = useCallback(
    ({ name, value }) => (
      <Flex>
        <TokenLabel type="token">{name}</TokenLabel>
        <TokenValueWrap>
          <BalanceText>{convertToBalanceFormat(value)}</BalanceText>
          <PriceText value={getEarningsPrice(value)} prefix="=" />
        </TokenValueWrap>
      </Flex>
    ),
    [convertToBalanceFormat, getEarningsPrice],
  )

  const renderHarvestButton = useCallback(
    () => (
      <Button
        variant={ButtonVariants.RED}
        width="100%"
        disabled={!account || (needsApprovalContract && !isOldSyrup) || !earnings.toNumber() || pendingTx}
        onClick={async () => {
          setPendingTx(true)
          await onReward()
          setPendingTx(false)
        }}
      >
        {t('Harvest')}
      </Button>
    ),
    [t, account, needsApprovalContract, isOldSyrup, earnings, pendingTx, onReward],
  )

  const renderDetailButton = useCallback(
    () => (
      <DetailButton variant={ButtonVariants.BROWN} width="100%" onClick={handleGoToDetail}>
        {t('Detail')}
      </DetailButton>
    ),
    [t, handleGoToDetail],
  )

  return (
    <>
      <Box>
        <Wrap isInPool={isInPool}>
          <Box>
            <TitleSection>{t('Earned Token')}</TitleSection>
            <HarvestInfo>
              <Box>
                {renderAirDrop({ name: 'FINIX', value: finixEarningsValue })}
                {(farm.bundleRewards || []).map((br, bundleId) => {
                  const reward = getBalanceNumber((pendingRewards[bundleId] || {}).reward) || 0
                  const allocate = br.rewardPerBlock || new BigNumber(0)
                  return reward !== 0 || allocate.toNumber() !== 0 ? (
                    <>
                      {renderAirDrop({
                        name: br.rewardTokenInfo.name === 'WKLAY' ? 'KLAY' : br.rewardTokenInfo.name,
                        value: reward,
                      })}
                    </>
                  ) : null
                })}
              </Box>
              {isInPool && <HarvestButtonSectionInPool>{renderHarvestButton()}</HarvestButtonSectionInPool>}
            </HarvestInfo>
          </Box>
          {isInPool ? null : (
            <HarvestButtonSectionInMyInvestment>
              {renderHarvestButton()}
              {renderDetailButton()}
            </HarvestButtonSectionInMyInvestment>
          )}
        </Wrap>
      </Box>
    </>
  )
}

export default HarvestActionAirdrop
