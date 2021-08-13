import React, { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { getAddress } from 'utils/addressHelpers'
import numeral from 'numeral'
import styled from 'styled-components'
import { Card, Text } from 'uikit-dev'
import CopyToClipboard from 'uikit-dev/widgets/WalletModal/CopyToClipboard'
import _ from 'lodash'
// import { getAddress } from 'utils/addressHelpers'
import { Table, TD, TH, TR } from './Table'
import CardTab from './CardTab'
import { Rebalance } from '../../../state/types'

interface FundDetailType {
  rebalance?: Rebalance | any
  className?: string
}

const Overflow = styled.div`
  overflow: auto;
`
const AssetDetail = ({ rebalance }) => {
  const cols = ['ASSET', 'BALANCE', 'PRICE', 'VALUE', 'CHANGE (D)', 'RATIO']
  // const cols = ['ASSET', 'BALANCE', 'PRICE', 'VALUE', 'RATIO']
  let tokens = _.compact([...((rebalance || {}).tokens || []), ...((rebalance || {}).usdToken || [])])

  if (tokens.length === 0) tokens = rebalance.ratio

  // useEffect(() => {
  //   if (rebalance.tokens) {
  //     const bulidRows = (
  //       name: string,
  //       balance: number,
  //       price: number,
  //       value: number,
  //       change: number,
  //       ratio: string,
  //     ) => {
  //       return {
  //         img: `/images/coins/${name}.png`,
  //         name,
  //         balance,
  //         price,
  //         value,
  //         change,
  //         ratio,
  //       }
  //     }
  //     const updateData = async () => {
  //       setRows([])
  //       const balanceToken = []
  //       const priceAlltoken: PriceAll = (
  //         await axios.get(
  //           'https://klaytn.api.sixnetwork.io/prices?fbclid=IwAR2m4gK4b_XvHDAFb0h6_obefrqyMd63escpVWzdIk4iZ3gACAinbnccpq4',
  //         )
  //       ).data

  //       for (let i = 0; i < tokens.length; i++) {
  //         const rebalanceToken = tokens[i]
  //         // eslint-disable-next-line
  //         const balance = await getTokenBalance(rebalanceToken.address)
  //         const ratio = _.find(rebalance.ratio, (obj) => obj.symbol === rebalanceToken.symbol)
  //         const priceLast24 = rebalance.last24data.tokens[rebalanceToken.address.toLowerCase()].price
  //         const priceCurrent = priceAlltoken.prices[rebalanceToken.symbol]
  //         const change = (priceCurrent - priceLast24) / (priceCurrent * 100)

  //         setRows((oldRows) => [
  //           ...oldRows,
  //           bulidRows(
  //             rebalanceToken.symbol,
  //             balance,
  //             priceCurrent,
  //             balance * priceAlltoken.prices[rebalanceToken.symbol],
  //             change,
  //             `${ratio.value} %`,
  //           ),
  //         ])
  //         balanceToken.push(balance)
  //       }
  //     }
  //     updateData()
  //   }
  // }, [tokens, getTokenBalance, rebalance])

  // const getTokenBalance = async (tokenAddress) => {
  //   const poolAddress = getAddress(rebalance.address)
  //   const sixAmount = await getContract(caver, tokenAddress).methods.balanceOf(poolAddress).call()
  //   const sixDecimal = await getContract(caver, tokenAddress).methods.decimals().call()
  //   return sixAmount / 10 ** sixDecimal
  // }

  const selectClass = (inputNumber) => {
    if (inputNumber < 0) return 'failure'
    if (inputNumber > 0) return 'success'
    return ''
  }
  const selectSymbolChange = (inputNumber) => {
    if (inputNumber < 0) return '-'
    if (inputNumber > 0) return '+'
    return ''
  }
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

        const ratio = _.find(rebalance.ratio, (obj) => obj.symbol === r.symbol)
        // @ts-ignore
        const totalPriceNotDevDecimap = new BigNumber([_.get(rebalance, `currentPoolUsdBalances.${index}`)])
        const totalPrice = totalPriceNotDevDecimap.div(new BigNumber(10).pow(6))

        const tokenPrice = (totalPrice || new BigNumber(0)).div(
          _.get(r, 'totalBalance', new BigNumber(0)).div(new BigNumber(10).pow(_.get(r, 'decimals', 18))),
        )
        // const change = (priceCurrent - priceLast24) / (priceCurrent * 100)
        const priceLast24 = _.get(
          rebalance,
          `last24data.tokens.${(typeof _.get(r, 'address', '') === 'string'
            ? _.get(r, 'address', '')
            : getAddress(_.get(r, 'address', ''))
          ).toLowerCase()}.price`,
          new BigNumber(0),
        )
        console.log('tokenPrice ', tokenPrice.toFixed(3), 'priceLast24', priceLast24.toFixed(3))

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
                {`${numeral(changeNumber).format('0,0.[000]')} %`}
              </Text>
            </TD>
            <TD align="center">
              <Text>{ratio.value}%</Text>
            </TD>
          </TR>
        )
      })}
    </Table>
  )
}
const FactRow = ({ name, value, isCopy }) => {
  return (
    <TR>
      <TD>
        <Text bold>{name}</Text>
      </TD>
      <TD>
        <div className="flex">
          <Text fontSize="14px" className={isCopy ? 'mr-2' : ''}>
            {value}
          </Text>
          {isCopy && <CopyToClipboard toCopy={isCopy} iconWidth="16px" noText />}
        </div>
      </TD>
    </TR>
  )
}

const FactSheet = ({ rebalance }) => {
  return (
    <Table>
      <FactRow name="Name" value={rebalance.factsheet.name} isCopy={false} />
      <FactRow name="Inception date" value={rebalance.factsheet.inceptionDate} isCopy={false} />
      <FactRow name="Manager" value={rebalance.factsheet.manager} isCopy={rebalance.factsheet.manager} />
      <FactRow name="Vault" value={rebalance.factsheet.vault} isCopy={rebalance.factsheet.vault} />
      <FactRow name="Management fee" value={rebalance.factsheet.management} isCopy={rebalance.factsheet.management} />
      <FactRow
        name="FINIX Buy back fee"
        value={rebalance.factsheet.finixBuyBackFee}
        isCopy={rebalance.factsheet.finixBuyBackFee}
      />
      <FactRow name="Bounty fee" value={rebalance.factsheet.bountyFee} isCopy={rebalance.factsheet.bountyFee} />
    </Table>
  )
}

const FundDetail: React.FC<FundDetailType> = ({ rebalance, className = '' }) => {
  const [currentTab, setCurrentTab] = useState(0)

  useEffect(
    () => () => {
      setCurrentTab(0)
    },
    [],
  )

  return (
    <Card className={className}>
      <CardTab menus={['ASSET DETAILS', 'FACTSHEET']} current={currentTab} setCurrent={setCurrentTab} />
      <div style={{ height: '42px' }} />
      <Overflow className="pa-4 pt-0">
        {currentTab === 0 ? <AssetDetail rebalance={rebalance} /> : <FactSheet rebalance={rebalance} />}
      </Overflow>
    </Card>
  )
}

export default FundDetail
