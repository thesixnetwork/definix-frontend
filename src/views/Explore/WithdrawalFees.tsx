import React from 'react'
import { Card, Text } from 'uikit-dev'
import Helper from 'uikit-dev/components/Helper'

interface WithDrawalFeesType {
  className?: string
}

const WithDrawalFees: React.FC<WithDrawalFeesType> = ({ className = '' }) => {
  return (
    <Card className={`pa-4 ${className}`} style={{ overflow: 'visible' }}>
      <Text bold className="mb-1">
        WITHDRAWAL FEES
      </Text>

      <div className="flex">
        <div className="col-4 flex align-center">
          <Text fontSize="14px">Management fee</Text>
          <Helper text="Fee collected for vault management." className="mx-2" position="top" />
          <Text>0.2%</Text>
        </div>
        <div className="col-4 flex align-center">
          <Text fontSize="14px">FINIX buy back fee</Text>
          <Helper
            text="Fee collected for buyback and burn of FINIX as deflationary purpose."
            className="mx-2"
            position="top"
          />
          <Text>0.3%</Text>
        </div>
        <div className="col-4 flex align-center">
          <Text fontSize="14px">Ecosystem fee</Text>
          <Helper text="Reservation fee for further development of the ecosystem." className="mx-2" position="top" />
          <Text>0.3%</Text>
        </div>
      </div>
    </Card>
  )
}

export default WithDrawalFees
