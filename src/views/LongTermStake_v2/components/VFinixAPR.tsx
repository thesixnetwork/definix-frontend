import React from 'react'
import { Flex } from 'definixswap-uikit'

import AprButtonPc from './AprButtonPc'
import AprButtonMobile from './AprButtonMobile'
import { IsMobileType, DataType } from './types'

interface VFinixProps extends IsMobileType {
  days: string
  setDays: React.Dispatch<React.SetStateAction<string>>
  data: DataType[]
}

const VFinixApr: React.FC<VFinixProps> = ({ isMobile, days, setDays, data }) => {
  return (
    <>
      <Flex width="100%">
        {isMobile ? (
          <AprButtonMobile days={days} setDays={setDays} data={data} />
        ) : (
          <AprButtonPc days={days} setDays={setDays} data={data} />
        )}
      </Flex>
    </>
  )
}

export default VFinixApr
