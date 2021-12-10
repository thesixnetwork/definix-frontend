import React, { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import { compact, get } from 'lodash'
import { Box, Text, useMatchBreakpoints } from 'definixswap-uikit-v2'

import { useTranslation } from 'react-i18next'

import { Rebalance } from 'state/types'
import { getTokenName } from 'utils/getTokenSymbol'
import { Table, TD, TH, TR } from './Table'

interface AssetDetailType {
  rebalance?: Rebalance | any
  periodPriceTokens?: number[]
  mx?: string
}

const AssetDetail: React.FC<AssetDetailType> = ({ rebalance, periodPriceTokens, mx }) => {
  const { t } = useTranslation()
  const { isMaxXl } = useMatchBreakpoints()
  const cols = [t('Asset'), t('Balance'), t('Price'), t('Value'), t('Change'), t('Weight')]
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

  return (
    <div style={{ overflow: 'auto' }}>
      <Box mx={mx} minWidth="fit-content">
        <Table>
          <tbody>
            <TR>
              {cols.map((c, idx) => (
                <TH align={idx > 0 ? 'center' : null} key={c} oneline sm={isMaxXl}>
                  <Text color="mediumgrey" textStyle="R_12M">
                    {c}
                  </Text>
                </TH>
              ))}
            </TR>

            {tokens.map((r, index) => {
              const thisName = getTokenName(r?.symbol)

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
                  <TD sidecolor={colors?.[r.symbol]} style={{ overflow: 'hidden' }} sm={isMaxXl}>
                    <div className="flex align-center" style={{ width: 'max-content' }}>
                      <img
                        src={`/images/coins/${r.symbol || ''}.png`}
                        alt=""
                        width={24}
                        height={24}
                        className="mr-s6"
                      />
                      <Text textStyle="R_14B">{thisName}</Text>
                    </div>
                  </TD>
                  <TD align="center" sm={isMaxXl}>
                    <Text textStyle="R_14R">
                      {numeral(
                        get(r, 'totalBalance', new BigNumber(0))
                          .div(new BigNumber(10).pow(get(r, 'decimals', 18)))
                          .toNumber(),
                      ).format('0,0.[000]')}
                    </Text>
                  </TD>
                  <TD align="center" oneline sm={isMaxXl}>
                    <Text textStyle="R_14R">$ {numeral(tokenPrice.toNumber()).format('0,0.[00]')}</Text>
                  </TD>
                  <TD align="center" oneline sm={isMaxXl}>
                    <Text textStyle="R_14R">$ {numeral(totalPrice.toNumber()).format('0,0.[00]')}</Text>
                  </TD>
                  <TD align="center" oneline sm={isMaxXl}>
                    <Text textStyle="R_14R" color={selectClass(changeNumber)}>
                      {`${Number.isFinite(changeNumber) ? `${numeral(changeNumber).format('0,0.[00]')} %` : '-'}`}
                    </Text>
                  </TD>
                  <TD align="center" oneline sm={isMaxXl}>
                    <Text textStyle="R_14R">{ratio ? ratio[index] : 0} %</Text>
                  </TD>
                </TR>
              )
            })}
          </tbody>
        </Table>
      </Box>
    </div>
  )
}

export default AssetDetail
