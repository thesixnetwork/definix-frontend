import { Box, Typography, Tooltip } from '@mui/material'
import { HelpOutlineRounded } from '@mui/icons-material'

import _ from 'lodash'
import React from 'react'
import CopyToClipboard from 'uikit-dev/widgets/WalletModal/CopyToClipboard'
import { Table, TD, TH, TR } from './Table'

const FactRow = ({ name, value, isCopy, bold = false, percent = undefined, tooltip = '' }) => {
  return (
    <TR>
      <TH>
        <div className="flex align-center">
          {name}
          {tooltip && (
            <Tooltip title={tooltip}>
              <HelpOutlineRounded className="ml-1" sx={{ width: '16px', height: '16px' }} />
            </Tooltip>
          )}
        </div>
      </TH>
      <TD>
        <div className="flex">
          {percent && (
            <Typography variant="body2" className="mr-4 pr-4 bd-r">
              {percent}
            </Typography>
          )}
          <Typography variant="body2" className={isCopy ? 'mr-2' : ''} fontWeight={bold ? 'bold' : 'normal'}>
            {value}
          </Typography>
          {isCopy && <CopyToClipboard toCopy={isCopy} iconWidth="14px" noText />}
        </div>
      </TD>
    </TR>
  )
}

const FactSheet = ({ rebalance }) => {
  return (
    <Box p={{ xs: '20px', lg: 4 }}>
      <Typography color="textSecondary" fontWeight={500} sx={{ mb: '20px' }}>
        Key Facts
      </Typography>

      {rebalance.fullDescription && (
        <Typography variant="body2" sx={{ color: (theme) => theme.palette.text.disabled, mb: 2 }}>
          {rebalance.fullDescription}
        </Typography>
      )}
      <Box sx={{ width: '100%', overflow: 'auto' }}>
        <Table>
          <FactRow name="Name" value={rebalance.factsheet.name} isCopy={false} bold />
          <FactRow name="Inception Date" value={rebalance.factsheet.inceptionDate} isCopy={false} />
          <FactRow name="Manager" value={rebalance.factsheet.manager} isCopy={rebalance.factsheet.manager} />
          <FactRow name="Vault" value={rebalance.factsheet.vault} isCopy={rebalance.factsheet.vault} />
          <FactRow
            name="Management Fee"
            tooltip="Fee collected for vault management."
            value={rebalance.factsheet.management}
            isCopy={rebalance.factsheet.management}
            percent={`${_.get(rebalance, 'fee.management', 0.5)}%`}
          />
          <FactRow
            name="FINIX Buyback Fee"
            tooltip="Fee collected for buyback and burn of FINIX as deflationary purpose."
            value={rebalance.factsheet.finixBuyBackFee}
            isCopy={rebalance.factsheet.finixBuyBackFee}
            percent={`${_.get(rebalance, 'fee.buyback', 1.0)}%`}
          />
          {/* <FactRow name="Ecosystem fee" value={rebalance.factsheet.bountyFee} isCopy={rebalance.factsheet.bountyFee} /> */}
        </Table>
      </Box>
    </Box>
  )
}

export default FactSheet
