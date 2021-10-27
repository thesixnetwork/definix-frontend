import React from 'react'
import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import { Card, Text } from 'uikit-dev'
import _ from 'lodash'

import { Rebalance } from '../../../state/types'

import { Table, TD, TH, TR } from './Table'
import FullAssetRatio from './FullAssetRatio'

interface FundDetailType {
  rebalance?: Rebalance | any
  periodPriceTokens?: number[]
  className?: string
}

const AssetDetail = ({ rebalance, periodPriceTokens }) => {
  const cols = ['ASSET', 'BALANCE', 'PRICE', 'VALUE', 'CHANGE (D)', 'RATIO']
  let tokens = _.compact([...((rebalance || {}).tokens || []), ...((rebalance || {}).usdToken || [])])

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
            <Text color="textSubtle" fontSize="12px" bold>
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

        const ratio = _.get(rebalance, `ratioCal`)
        // Do not show record when ratio equal 0
        if (ratio && ratio[index] === 0) return <></>

        // @ts-ignore
        const totalPriceNotDevDecimap = new BigNumber([_.get(rebalance, `currentPoolUsdBalances.${index}`)])
        const totalPrice = totalPriceNotDevDecimap.div(new BigNumber(10).pow(6))

        const tokenPrice = (totalPrice || new BigNumber(0)).div(
          _.get(r, 'totalBalance', new BigNumber(0)).div(new BigNumber(10).pow(_.get(r, 'decimals', 18))),
        )

        // const change = (priceCurrent - priceLast24) / (priceCurrent * 100)
        const priceLast24 = periodPriceTokens ? periodPriceTokens[index] : 0
        const change = tokenPrice.minus(priceLast24).div(priceLast24).times(100)
        const changeNumber = change.toNumber()

        return (
          <TR>
            <TD>
              <div className="flex align-center">
                <img src={`/images/coins/${r.symbol || ''}.png`} alt="" width={32} height={32} className="mr-3" />
                <Text bold>{thisName}</Text>
              </div>
            </TD>
            <TD align="center">
              <Text>
                {numeral(
                  _.get(r, 'totalBalance', new BigNumber(0))
                    .div(new BigNumber(10).pow(_.get(r, 'decimals', 18)))
                    .toNumber(),
                ).format('0,0.[000]')}
              </Text>
            </TD>
            <TD align="center">
              <Text>$ {numeral(tokenPrice.toNumber()).format('0,0.[00]')}</Text>
            </TD>
            <TD align="center">
              <Text>$ {numeral(totalPrice.toNumber()).format('0,0.[00]')}</Text>
            </TD>
            <TD align="center">
              <Text color={selectClass(changeNumber)}>
                {/* {selectSymbolChange(changeNumber)} */}
                {`${Number.isFinite(changeNumber) ? `${numeral(changeNumber).format('0,0.[00]')} %` : '-'}`}
              </Text>
            </TD>
            <TD align="center">
              <Text>{ratio ? ratio[index] : 0} %</Text>
            </TD>
          </TR>
        )
      })}
    </Table>
  )
}

const FundDetail: React.FC<FundDetailType> = ({ rebalance, periodPriceTokens, className = '' }) => {
  const { ratio } = rebalance
  return (
    <Card className={`pa-4 ${className}`}>
      <Text bold className="mb-2">
        Asset ratio
      </Text>
      <FullAssetRatio className="mb-2" ratio={ratio} />
      <AssetDetail rebalance={rebalance} periodPriceTokens={periodPriceTokens} />
    </Card>
  )
}

export default FundDetail
