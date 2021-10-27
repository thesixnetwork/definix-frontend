import React, { useMemo } from 'react'
import _ from 'lodash'
import { Card, Text } from 'uikit-dev'
import CopyToClipboard from 'uikit-dev/widgets/WalletModal/CopyToClipboard'
import Helper from 'uikit-dev/components/Helper'

import { Rebalance } from '../../../state/types'

import { Table, TD, TR } from './Table'

interface FactRowType {
  name: string
  value: string | string[]
  toCopy?: string
  helper?: string
}

const FactRow: React.FC<FactRowType> = ({ name, helper, value, toCopy }) => {
  const isCopy = useMemo(() => Boolean(toCopy), [toCopy])
  return (
    <TR>
      <TD>
        <div className="flex align-center">
          <Text bold>{name}</Text>
          {helper && <Helper text={helper} className="mx-2" position="top" />}
        </div>
      </TD>
      <TD>
        <div className="flex">
          {typeof value === 'string' ? (
            <Text fontSize="14px" className={isCopy ? 'mr-2' : ''}>
              {value}
            </Text>
          ) : (
            value.map((item, index) => {
              const classNames = [index > 0 || isCopy ? 'mr-2' : '', index < value.length - 1 ? 'bd-r pr-2' : '']
              return (
                <Text fontSize="14px" className={classNames.join(' ')}>
                  {item}
                </Text>
              )
            })
          )}
          {isCopy && <CopyToClipboard toCopy={toCopy} iconWidth="16px" noText />}
        </div>
      </TD>
    </TR>
  )
}

interface KeyFactsType {
  className?: string
  rebalance: Rebalance | any
}

const KeyFacts: React.FC<KeyFactsType> = ({ className, rebalance }) => {
  return (
    <Card className={`pa-4 ${className}`}>
      <Text bold className="mb-2">
        Key facts
      </Text>
      <Text fontSize="14px">{rebalance.description}</Text>
      <Table>
        <FactRow name="Name" value={rebalance.factsheet.name} />
        <FactRow name="Inception date" value={rebalance.factsheet.inceptionDate} />
        <FactRow name="Manager" value={rebalance.factsheet.manager} toCopy={rebalance.factsheet.manager} />
        <FactRow name="Vault" value={rebalance.factsheet.vault} toCopy={rebalance.factsheet.vault} />
        <FactRow
          name="Management fee"
          value={[_.get(rebalance, 'fee.management', 0.2), rebalance.factsheet.management]}
          toCopy={rebalance.factsheet.management}
          helper="Fee collected for vault management."
        />
        <FactRow
          name="FINIX Buy back fee"
          value={[_.get(rebalance, 'fee.buyback', 1.5), rebalance.factsheet.finixBuyBackFee]}
          toCopy={rebalance.factsheet.finixBuyBackFee}
          helper="Fee collected for buyback and burn of FINIX as deflationary purpose."
        />
        <FactRow
          name="Ecosystem fee"
          value={[_.get(rebalance, 'fee.bounty', 0.3), rebalance.factsheet.bountyFee]}
          toCopy={rebalance.factsheet.bountyFee}
          helper="Reservation fee for further development of the ecosystem."
        />
      </Table>
    </Card>
  )
}

export default KeyFacts
