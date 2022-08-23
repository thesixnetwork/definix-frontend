import { Box, styled, Typography } from '@mui/material'
import BigNumber from 'bignumber.js'
import _ from 'lodash'
import numeral from 'numeral'
import React from 'react'
import { Table, TD, TH, TR } from './Table'

const Bar = styled('span')`
  width: 4px;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`

const AssetDetail = ({ rebalance, periodPriceTokens }) => {
  const cols = ['ASSET', 'BALANCE', 'PRICE', 'VALUE', 'CHANGE (D)', 'RATIO']
  let tokens = _.compact([...((rebalance || {}).tokens || [])])

  if (tokens.length === 0) tokens = rebalance.ratio
  const selectClass = (inputNumber) => {
    if (inputNumber < 0) return 'error'
    if (inputNumber > 0) return 'success'
    return ''
  }
  // const selectSymbolChange = (inputNumber) => {
  //   if (inputNumber < 0) return '-'
  //   if (inputNumber > 0) return '+'
  //   return ''
  // }

  return (
    <Box sx={{ width: '100%', overflow: 'auto' }}>
      <Table>
        <TR>
          {cols.map((c, idx) => (
            <TH align={idx > 0 ? 'center' : null}>{c}</TH>
          ))}
        </TR>

        {tokens.map((r, index) => {
          const thisName = (() => {
            if (r.symbol === 'WKLAY') return 'KLAY'
            if (r.symbol === 'WBNB') return 'BNB'
            return r.symbol
          })()

          const ratio = _.get(rebalance, `ratioCal`)
          // @ts-ignore
          const totalPriceNotDevDecimap = new BigNumber([_.get(rebalance, `currentPoolUsdBalances.${index}`)])
          const totalPrice = totalPriceNotDevDecimap.div(new BigNumber(10).pow(18))

          const tokenPrice = (totalPrice || new BigNumber(0)).div(
            _.get(r, 'totalBalance', new BigNumber(0)).div(new BigNumber(10).pow(_.get(r, 'decimals', 18))),
          )

          // const change = (priceCurrent - priceLast24) / (priceCurrent * 100)
          const priceLast24 = periodPriceTokens ? periodPriceTokens[index] : 0
          const change = tokenPrice.minus(priceLast24).div(priceLast24).times(100)
          const changeNumber = change.toNumber()
          const { color } = rebalance.ratio.filter((x) => x.symbol === r.symbol)[0]

          return (
            <TR>
              <TD className="pos-relative">
                <Bar sx={{ background: color }} />
                <div className="flex align-center">
                  <img src={`/images/coins/${r.symbol || ''}.png`} alt="" width={24} height={24} className="mr-3" />
                  <Typography variant="body2" fontWeight="bold">
                    {thisName}
                  </Typography>
                </div>
              </TD>
              <TD align="center">
                <Typography variant="body2">
                  {numeral(
                    _.get(r, 'totalBalance', new BigNumber(0))
                      .div(new BigNumber(10).pow(_.get(r, 'decimals', 18)))
                      .toNumber(),
                  ).format('0,0.[000]')}
                </Typography>
              </TD>
              <TD align="center">
                <Typography variant="body2">$ {numeral(tokenPrice.toNumber()).format('0,0.[00]')}</Typography>
              </TD>
              <TD align="center">
                <Typography variant="body2">$ {numeral(totalPrice.toNumber()).format('0,0.[00]')}</Typography>
              </TD>
              <TD align="center">
                <Typography variant="body2" color={selectClass(changeNumber)}>
                  {/* {selectSymbolChange(changeNumber)} */}
                  {`${Number.isFinite(changeNumber) ? `${numeral(changeNumber).format('0,0.[00]')} %` : '-'}`}
                </Typography>
              </TD>
              <TD align="center">
                <Typography variant="body2">{ratio ? ratio[index] : 0} %</Typography>
              </TD>
            </TR>
          )
        })}
      </Table>
    </Box>
  )
}

export default AssetDetail
