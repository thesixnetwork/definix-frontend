import { Box, Typography } from '@mui/material'
import React from 'react'
import CopyToClipboard from 'uikit-dev/widgets/WalletModal/CopyToClipboard'
import { Table, TD, TH, TR } from './Table'

const FactRow = ({ name, value, isCopy, bold = false }) => {
  return (
    <TR>
      <TH>{name}</TH>
      <TD>
        <div className="flex">
          <Typography variant="body2" className={isCopy ? 'mr-2' : ''} fontWeight={bold ? 'bold' : 'normal'}>
            {value}
          </Typography>
          {isCopy && <CopyToClipboard toCopy={isCopy} iconWidth="16px" noText />}
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

      <Table>
        <FactRow name="Name" value={rebalance.factsheet.name} isCopy={false} bold />
        <FactRow name="Inception date" value={rebalance.factsheet.inceptionDate} isCopy={false} />
        <FactRow name="Manager" value={rebalance.factsheet.manager} isCopy={rebalance.factsheet.manager} />
        <FactRow name="Vault" value={rebalance.factsheet.vault} isCopy={rebalance.factsheet.vault} />
        <FactRow name="Management fee" value={rebalance.factsheet.management} isCopy={rebalance.factsheet.management} />
        <FactRow
          name="FINIX Buy back fee"
          value={rebalance.factsheet.finixBuyBackFee}
          isCopy={rebalance.factsheet.finixBuyBackFee}
        />
        {/* <FactRow name="Ecosystem fee" value={rebalance.factsheet.bountyFee} isCopy={rebalance.factsheet.bountyFee} /> */}
      </Table>
    </Box>
  )
}

export default FactSheet
