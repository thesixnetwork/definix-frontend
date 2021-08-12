import React from 'react'
import { Card, Text, useMatchBreakpoints } from 'uikit-dev'
import Helper from 'uikit-dev/components/Helper'
import { buyBackFee, managementFee, ecosystemFee } from 'config/constants'

interface WithDrawalFeesType {
  className?: string
}

const WithDrawalFees: React.FC<WithDrawalFeesType> = ({ className = '' }) => {
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl

  return (
    <Card className={`pa-4 ${className}`}>
      <Text bold className="mb-1">
        WITHDRAWAL FEES
      </Text>

      <div className="flex flex-wrap">
        <div className={`${isMobile ? 'col-12' : 'col-4'} flex align-center`}>
          <Text fontSize="12px">Management fee</Text>
          <Helper text="xxx" className="mx-2" position="top" />
          <Text>{managementFee}%</Text>
        </div>
        <div className={`${isMobile ? 'col-12' : 'col-4'} flex align-center`}>
          <Text fontSize="12px">FINIX buy back fee</Text>
          <Helper text="xxx" className="mx-2" position="top" />
          <Text>{buyBackFee}%</Text>
        </div>
        <div className={`${isMobile ? 'col-12' : 'col-4'} flex align-center`}>
          <Text fontSize="12px">Ecosystem fee</Text>
          <Helper text="xxx" className="mx-2" position="top" />
          <Text>{ecosystemFee}%</Text>
        </div>
      </div>

      <Text fontSize="12px" className="mt-1">
        ({' '}
        <Text color="primary" style={{ display: 'inline' }}>
          +0.5% fee
        </Text>{' '}
        for EARLY WITHDRAWALS within 1 day )
      </Text>
    </Card>
  )
}

export default WithDrawalFees
