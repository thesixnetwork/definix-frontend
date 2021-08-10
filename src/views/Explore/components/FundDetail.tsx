import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Card, Text } from 'uikit-dev'
import CopyToClipboard from 'uikit-dev/widgets/WalletModal/CopyToClipboard'
import { getContract } from 'utils/erc20'
import { getCaver } from 'utils/caver'
import axios from 'axios'
import _ from 'lodash'
import { Table, TD, TH, TR } from './Table'
import CardTab from './CardTab'
import { Rebalance } from '../../../state/types'

interface FundDetailType {
  rebalance?: Rebalance | any
  className?: string
}

interface PriceAll {
  prices: any
}
const Overflow = styled.div`
  overflow: auto;
`
const caver = getCaver()
const AssetDetail = ({ rebalance }) => {
  const cols = ['ASSET', 'BALANCE', 'PRICE', 'VALUE', 'CHANGE (D)', 'RATIO']
  const [rows, setRows] = useState([])
  useEffect(() => {
    if (rebalance.tokens) {
      const tokens = [...rebalance.tokens, ...rebalance.usdToken]
      const bulidRows = (
        name: string,
        balance: number,
        price: number,
        value: number,
        change: number,
        ratio: string,
      ) => {
        return {
          img: `/images/coins/${name}.png`,
          name,
          balance,
          price,
          value,
          change,
          ratio,
        }
      }
      const updateData = async () => {
        setRows([])
        const balanceToken = []
        const priceAlltoken: PriceAll = (
          await axios.get(
            'https://klaytn.api.sixnetwork.io/prices?fbclid=IwAR2m4gK4b_XvHDAFb0h6_obefrqyMd63escpVWzdIk4iZ3gACAinbnccpq4',
          )
        ).data

        for (let i = 0; i < tokens.length; i++) {
          const rebalanceToken = tokens[i]
          // eslint-disable-next-line
          const balance = await getTokenBalance(rebalanceToken.address)
          const ratio = _.find(rebalance.ratio, (obj) => obj.symbol === rebalanceToken.symbol)
          const priceLast24 = rebalance.last24data.tokens[rebalanceToken.address.toLowerCase()].price
          const priceCurrent = priceAlltoken.prices[rebalanceToken.symbol]
          const change = (priceCurrent - priceLast24) / (priceCurrent * 100)

          setRows((oldRows) => [
            ...oldRows,
            bulidRows(
              rebalanceToken.symbol,
              balance,
              priceCurrent,
              balance * priceAlltoken.prices[rebalanceToken.symbol],
              change,
              `${ratio.value} %`,
            ),
          ])
          balanceToken.push(balance)
        }
      }
      updateData()
    }
  }, [rebalance])

  const getTokenBalance = async (tokenAddress) => {
    const poolAddress = '0x5E840B91cF0675Ada96FBA09028a371b6CFbD551'
    const sixAmount = await getContract(caver, tokenAddress).methods.balanceOf(poolAddress).call()
    const sixDecimal = await getContract(caver, tokenAddress).methods.decimals().call()
    return sixAmount / 10 ** sixDecimal
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

      {rows.map((r) => (
        <TR>
          <TD>
            <div className="flex align-center">
              <img src={r.img} alt="" width={32} height={32} className="mr-3" />
              <Text bold>{r.name}</Text>
            </div>
          </TD>
          <TD align="center">
            <Text>{r.balance.toFixed(3)}</Text>
          </TD>
          <TD align="center">
            <Text>{r.price.toFixed(3)} $</Text>
          </TD>
          <TD align="center">
            <Text>{r.value.toFixed(3)} $</Text>
          </TD>
          <TD align="center">
            {r.change > 0 ? (
              <Text color="success" /* || failure */>{r.change.toFixed(3)} %</Text>
            ) : (
              <Text color="failure" /* || failure */>{r.change.toFixed(3)} %</Text>
            )}
          </TD>
          <TD align="center">
            <Text>{r.ratio}</Text>
          </TD>
        </TR>
      ))}
    </Table>
  )
}

const FactSheet = () => {
  const data = [
    { name: 'Name', value: 'Re-balancing BTC focus', copy: false },
    { name: 'Inception date', value: 'Sun, 16 May 2021 22:48:20 GMT', copy: false },
    { name: 'Manager', value: '0xf5be8b4c82b8a681bacf357cfb712ab9e9296cb2', copy: true },
    { name: 'Vault', value: '0x86fb84e92c1eedc245987d28a42e123202bd6701', copy: true },
    { name: 'Comptroller', value: '0x6d38a84ecde417b189ed317420c04fdd0cc4fb5d', copy: true },
    { name: 'Management fee', value: '0xf5be8b4c82b8a681bacf357cfb712ab9e9296cb2', copy: true },
    { name: 'FINIX buy back fee', value: '0x86fb84e92c1eedc245987d28a42e123202bd6701', copy: true },
    { name: 'Bounty fee', value: '0x6d38a84ecde417b189ed317420c04fdd0cc4fb5d', copy: true },
  ]

  return (
    <Table>
      {data.map((r) => (
        <TR>
          <TD>
            <Text bold>{r.name}</Text>
          </TD>
          <TD>
            <div className="flex">
              <Text className={r.copy ? 'mr-2' : ''}>{r.value}</Text>
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
      <Overflow className="pa-4">{currentTab === 0 ? <AssetDetail rebalance={rebalance} /> : <FactSheet />}</Overflow>
    </Card>
  )
}

export default FundDetail
