import React, { useEffect, useState } from 'react'
import { Card, Text } from 'uikit-dev'
import CopyToClipboard from 'uikit-dev/widgets/WalletModal/CopyToClipboard'
import CardTab from './CardTab'
import { Table, TD, TH, TR } from './Table'

interface FundDetailType {
  className?: string
}

const AssetDetail = () => {
  const data = {
    cols: ['ASSET', 'BALANCE', 'PRICE', 'VALUE', 'CHANGE (D)', 'RATIO'],
    rows: [
      {
        img: '/images/coins/BTC.png',
        name: 'BTC',
        balance: '80.00',
        price: '$32,273',
        value: '$32,273,300.00',
        change: '+2.60%',
        ratio: '40%',
      },
      {
        img: '/images/coins/bnb.png',
        name: 'BNB',
        balance: '100.00',
        price: '$32,273',
        value: '$32,273,300.00',
        change: '+2.60%',
        ratio: '20%',
      },
      {
        img: '/images/coins/six.png',
        name: 'SIX',
        balance: '100.00',
        price: '$32,273',
        value: '$32,273,300.00',
        change: '+2.60%',
        ratio: '15%',
      },
      {
        img: '/images/coins/FINIX.png',
        name: 'FINIX',
        balance: '100.00',
        price: '$32,273',
        value: '$32,273,300.00',
        change: '+2.60%',
        ratio: '15%',
      },
      {
        img: '/images/coins/usdt.png',
        name: 'BUSD',
        balance: '100.00',
        price: '$32,273',
        value: '$32,273,300.00',
        change: '+2.60%',
        ratio: '10%',
      },
    ],
  }

  return (
    <Table>
      <TR>
        {data.cols.map((c, idx) => (
          <TH align={idx > 0 ? 'center' : null}>
            <Text color="textSubtle" fontSize="12px" bold>
              {c}
            </Text>
          </TH>
        ))}
      </TR>

      {data.rows.map((r) => (
        <TR>
          <TD>
            <div className="flex align-center">
              <img src={r.img} alt="" width={32} height={32} className="mr-3" />
              <Text bold>{r.name}</Text>
            </div>
          </TD>
          <TD align="center">
            <Text>{r.balance}</Text>
          </TD>
          <TD align="center">
            <Text>{r.price}</Text>
          </TD>
          <TD align="center">
            <Text>{r.value}</Text>
          </TD>
          <TD align="center">
            <Text color="success" /* || failure */>{r.change}</Text>
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

const FundDetail: React.FC<FundDetailType> = ({ className = '' }) => {
  const [currentTab, setCurrentTab] = useState(0)

  useEffect(() => setCurrentTab(0), [])

  return (
    <Card className={className}>
      <CardTab menus={['ASSET DETAILS', 'FACTSHEET']} current={currentTab} setCurrent={setCurrentTab} />

      <div className="pa-4">{currentTab === 0 ? <AssetDetail /> : <FactSheet />}</div>
    </Card>
  )
}

export default FundDetail
