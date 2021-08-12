import React, { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import styled from 'styled-components'
import { Card, Text } from 'uikit-dev'
import CopyToClipboard from 'uikit-dev/widgets/WalletModal/CopyToClipboard'
import _ from 'lodash'
import { getAddress } from 'utils/addressHelpers'
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
        const totalPrice = new BigNumber([_.get(rebalance, `currentPoolUsdBalances.${index}`)]).div(
          new BigNumber(10).pow(18),
        )
        let tokenPrice = new BigNumber(0)
        let changeNumber = 0
        if (r && r.totalBalance) {
          tokenPrice = (totalPrice || new BigNumber(0)).div(r.totalBalance.div(new BigNumber(10).pow(r.decimals)))
          // const change = (priceCurrent - priceLast24) / (priceCurrent * 100)
          const priceLast24 = _.get(rebalance, `last24data.tokens.${r.address.toLowerCase()}.price`, new BigNumber(0))
          const change = tokenPrice.minus(priceLast24).div(tokenPrice.times(100))
          changeNumber = change.toNumber()
        }
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
                {numeral((r.totalBalance || new BigNumber(0)).div(new BigNumber(10).pow(r.decimals)).toNumber()).format(
                  '0,0.[000]',
                )}
              </Text>
            </TD>
            <TD align="center">
              <Text>$ {numeral(tokenPrice.toNumber()).format('0,0.[00]')}</Text>
            </TD>
            <TD align="center">
              <Text>$ {numeral(totalPrice.toNumber()).format('0,0.[00]')}</Text>
            </TD>
            <TD align="center">
              <Text color={selectClass(changeNumber)}>$ {numeral(changeNumber).format('0,0.[000]')}</Text>
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

const FactSheet = ({ rebalance }) => {
  // const datax = _.get(rebalance, 'factsheet')
  rebalance.dataFactsheet2 // มันคือ array ที่เรา map config มาจาก state/rebalance
  const data = [
    { title: 'Name', value: 'Satoshi and Friends', copy: false },
    { title: 'Inception date', value: 'Sun, 16 May 2021 22:48:20 GMT', copy: false },
    { title: 'Manager', value: '0xf5be8b4c82b8a681bacf357cfb712ab9e9296cb2', copy: true },
    { title: 'Vault', value: getAddress(rebalance.address), copy: true },
    { title: 'Comptroller', value: '0x6d38a84ecde417b189ed317420c04fdd0cc4fb5d', copy: true },
    { title: 'Management fee', value: '0xf5be8b4c82b8a681bacf357cfb712ab9e9296cb2', copy: true },
    { title: 'FINIX buy back fee', value: '0x86fb84e92c1eedc245987d28a42e123202bd6701', copy: true },
    { title: 'Bounty fee', value: '0x6d38a84ecde417b189ed317420c04fdd0cc4fb5d', copy: true },
  ]
  return (
    <Table>
      {data.map((r) => ( 
        <TR>
          <TD>
            <Text bold>{(r.title || "")}</Text>
          </TD>
          <TD>
            <div className="flex">
              <Text fontSize="14px" className={r.copy ? 'mr-2' : ''}>
                {r.value}
              </Text>
              {r.copy && <CopyToClipboard toCopy={r.value} iconWidth="16px" noText />}
            </div>
          </TD>
        </TR>
      ))}
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
      <Overflow className="pa-4">
        {currentTab === 0 ? <AssetDetail rebalance={rebalance} /> : <FactSheet rebalance={rebalance} />}
      </Overflow>
    </Card>
  )
}

export default FundDetail
