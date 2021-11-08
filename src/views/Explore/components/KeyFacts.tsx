import React, { useMemo } from 'react'
import { get } from 'lodash'
import { Text } from 'definixswap-uikit'
import CopyToClipboard from 'uikit-dev/widgets/WalletModal/CopyToClipboard'
import Helper from 'uikit-dev/components/Helper'

import { useTranslation } from 'react-i18next'
import { Rebalance } from '../../../state/types'

import { Table, TD, TH, TR } from './Table'

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
      <TH>
        <div className="flex align-center">
          <Text textStyle="R_12M" color="mediumgrey">
            {name}
          </Text>
          {helper && <Helper text={helper} className="mx-2" position="top" />}
        </div>
      </TH>
      <TD>
        <div className="flex">
          {typeof value === 'string' ? (
            <Text textStyle="R_14R" className={isCopy ? 'mr-2' : ''}>
              {value}
            </Text>
          ) : (
            value.map((item, index) => {
              const classNames = [index > 0 || isCopy ? 'mr-2' : '', index < value.length - 1 ? 'bd-r pr-2' : '']
              return (
                <Text textStyle="R_14R" className={classNames.join(' ')}>
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
  rebalance: Rebalance | any
}

const KeyFacts: React.FC<KeyFactsType> = ({ rebalance }) => {
  const { t } = useTranslation()
  return (
    <>
      <Text textStyle="R_16M" color="deepgrey" className="mb-s20">
        {t('Key Facts')}
      </Text>
      <Text textStyle="R_14R" color="mediumgrey">
        {rebalance.description}
      </Text>
      <Table className="mt-s20">
        <FactRow name={t('Name')} value={rebalance.factsheet.name} />
        <FactRow name={t('Inception Date')} value={rebalance.factsheet.inceptionDate} />
        <FactRow name={t('Manager')} value={rebalance.factsheet.manager} toCopy={rebalance.factsheet.manager} />
        <FactRow name={t('Vault')} value={rebalance.factsheet.vault} toCopy={rebalance.factsheet.vault} />
        <FactRow
          name={t('Management Fee')}
          value={[get(rebalance, 'fee.management', 0.2), rebalance.factsheet.management]}
          toCopy={rebalance.factsheet.management}
          helper="Fee collected for vault management."
        />
        <FactRow
          name={t('Finix Buyback Fee')}
          value={[get(rebalance, 'fee.buyback', 1.5), rebalance.factsheet.finixBuyBackFee]}
          toCopy={rebalance.factsheet.finixBuyBackFee}
          helper="Fee collected for buyback and burn of FINIX as deflationary purpose."
        />
        <FactRow
          name={t('Ecosystem Fee')}
          value={[get(rebalance, 'fee.bounty', 0.3), rebalance.factsheet.bountyFee]}
          toCopy={rebalance.factsheet.bountyFee}
          helper="Reservation fee for further development of the ecosystem."
        />
      </Table>
    </>
  )
}

export default KeyFacts
