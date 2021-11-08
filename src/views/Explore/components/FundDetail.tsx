import React, { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import { compact, get, find } from 'lodash'
import { Text } from 'definixswap-uikit'

import { useTranslation } from 'react-i18next'
import { Rebalance } from '../../../state/types'

import { Table, TD, TH, TR } from './Table'
import FullAssetRatio from './FullAssetRatio'

interface FundDetailType {
  rebalance?: Rebalance | any
  periodPriceTokens?: number[]
}

const AssetDetail = ({ rebalance, periodPriceTokens }) => {
  const { t } = useTranslation()
  const cols = [t('Asset'), t('Balance'), t('Price'), t('Value'), t('Change (D)'), t('Ratio')]
  let tokens = compact([...((rebalance || {}).tokens || []), ...((rebalance || {}).usdToken || [])])

  const colors = useMemo(() => {
    return rebalance.ratio?.reduce((all, token) => {
      return { ...all, [token.symbol]: token.color }
    }, {})
  }, [rebalance])

  if (tokens.length === 0) tokens = rebalance.ratio
  const selectClass = (inputNumber) => {
    if (inputNumber < 0) return 'failure'
    if (inputNumber > 0) return 'success'
    return ''
  }
  // const selectSymbolChange = (inputNumber) => {
  //   if (inputNumber < 0) return '-'
  //   if (inputNumber > 0) return '+'
  //   return ''
  // }

  return (
    <Table>
      <TR>
        {cols.map((c, idx) => (
          <TH align={idx > 0 ? 'center' : null}>
            <Text color="mediumgrey" textStyle="R_12M">
              {c}
            </Text>
          </TH>
        ))}
      </TR>

      {tokens.map((r, index) => {
        const thisName = (() => {
          if (r.symbol === 'WKLAY') return 'KLAY'
          if (r.symbol === 'WBNB') return 'BNB'
          return r.symbol
        })()

        const ratio = get(rebalance, `ratioCal`)
        // Do not show record when ratio equal 0
        if (ratio && ratio[index] === 0) return <></>

        // @ts-ignore
        const totalPriceNotDevDecimap = new BigNumber([get(rebalance, `currentPoolUsdBalances.${index}`)])
        const totalPrice = totalPriceNotDevDecimap.div(new BigNumber(10).pow(6))

        const tokenPrice = (totalPrice || new BigNumber(0)).div(
          get(r, 'totalBalance', new BigNumber(0)).div(new BigNumber(10).pow(get(r, 'decimals', 18))),
        )

        // const change = (priceCurrent - priceLast24) / (priceCurrent * 100)
        const priceLast24 = periodPriceTokens ? periodPriceTokens[index] : 0
        const change = tokenPrice.minus(priceLast24).div(priceLast24).times(100)
        const changeNumber = change.toNumber()

        return (
          <TR>
            <TD sidecolor={colors?.[r.symbol]}>
              <div className="flex align-center">
                <img src={`/images/coins/${r.symbol || ''}.png`} alt="" width={24} height={24} className="mr-s6" />
                <Text textStyle="R_14B">{thisName}</Text>
              </div>
            </TD>
            <TD align="center">
              <Text textStyle="R_14R">
                {numeral(
                  get(r, 'totalBalance', new BigNumber(0))
                    .div(new BigNumber(10).pow(get(r, 'decimals', 18)))
                    .toNumber(),
                ).format('0,0.[000]')}
              </Text>
            </TD>
            <TD align="center">
              <Text textStyle="R_14R">$ {numeral(tokenPrice.toNumber()).format('0,0.[00]')}</Text>
            </TD>
            <TD align="center">
              <Text textStyle="R_14R">$ {numeral(totalPrice.toNumber()).format('0,0.[00]')}</Text>
            </TD>
            <TD align="center">
              <Text color={selectClass(changeNumber)}>
                {/* {selectSymbolChange(changeNumber)} */}
                {`${Number.isFinite(changeNumber) ? `${numeral(changeNumber).format('0,0.[00]')} %` : '-'}`}
              </Text>
            </TD>
            <TD align="center">
              <Text textStyle="R_14R">{ratio ? ratio[index] : 0} %</Text>
            </TD>
          </TR>
        )
      })}
    </Table>
  )
}

const FundDetail: React.FC<FundDetailType> = ({ rebalance, periodPriceTokens }) => {
  const { t } = useTranslation()

  const { ratio } = rebalance
  return (
    <>
      <Text textStyle="R_16M" color="deepgrey" className="pb-s20">
        {t('Asset Ratio')}
      </Text>
      <FullAssetRatio className="mb-s40" ratio={ratio} />
      <AssetDetail rebalance={rebalance} periodPriceTokens={periodPriceTokens} />
    </>
  )
}

export default FundDetail
