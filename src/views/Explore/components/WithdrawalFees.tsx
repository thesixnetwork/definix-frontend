import React from 'react'
import { Card, Text, useMatchBreakpoints } from 'uikit-dev'
import Helper from 'uikit-dev/components/Helper'

const WithDrawalFees = ({ managementFee, buybackFee, bountyFee, className = '' }) => {
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl

  return (
    <Card className={`pa-4 ${className}`} style={{ overflow: 'visible' }}>
      <Text bold className="mb-1">
        WITHDRAWAL FEES
      </Text>

      <div className="flex flex-wrap">
        <div className={`${isMobile ? 'col-12' : 'col-4'} flex align-center`}>
          <Text fontSize="14px">Management fee</Text>
          <Helper text="Fee collected for vault management." className="mx-2" position="top" />
          <Text>{managementFee}%</Text>
        </div>
        <div className={`${isMobile ? 'col-12' : 'col-4'} flex align-center`}>
          <Text fontSize="14px">FINIX buy back fee</Text>
          <Helper
            text="Fee collected for buyback and burn of FINIX as deflationary purpose."
            className="mx-2"
            position="top"
          />
          <Text>{buybackFee}%</Text>
        </div>
        <div className={`${isMobile ? 'col-12' : 'col-4'} flex align-center`}>
          <Text fontSize="14px">Ecosystem fee</Text>
          <Helper text="Reservation fee for further development of the ecosystem." className="mx-2" position="top" />
          <Text>{bountyFee}%</Text>
        </div>
      </div>

      {/* <Text fontSize="14px" className="mt-1">
        ({' '}
        <Text color="primary" style={{ display: 'inline' }}>
          +0.5% fee
        </Text>{' '}
        for EARLY WITHDRAWALS within 1 day )
      </Text> */}
    </Card>
  )
}

export default WithDrawalFees
