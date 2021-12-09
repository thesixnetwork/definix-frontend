import React from 'react'
import { Card, Helper, Text } from 'definixswap-uikit-v2'
import { useTranslation } from 'react-i18next'

const WithDrawalFees = ({ managementFee, bountyFee, buybackFee, className = '' }) => {
  const { t } = useTranslation()
  return (
    <Card className={`pa-4 ${className}`} style={{ overflow: 'visible' }}>
      <Text bold className="mb-1">
        WITHDRAWAL FEES
      </Text>

      <div className="flex">
        <div className="col-4 flex align-center">
          <Text fontSize="14px">Management fee</Text>
          <Helper text={t('Fee collected for vault')} className="mx-2" position="top" />
          <Text>{managementFee}%</Text>
        </div>
        <div className="col-4 flex align-center">
          <Text fontSize="14px">FINIX buy back fee</Text>
          <Helper text={t('Fee collected for buyback')} className="mx-2" position="top" />
          <Text>{buybackFee}%</Text>
        </div>
        <div className="col-4 flex align-center">
          <Text fontSize="14px">Ecosystem fee</Text>
          <Helper text={t('Reservation fee for further')} className="mx-2" position="top" />
          <Text>{bountyFee}%</Text>
        </div>
      </div>
    </Card>
  )
}

export default WithDrawalFees
