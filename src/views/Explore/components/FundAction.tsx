import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Button, Card, Text, useMatchBreakpoints } from 'uikit-dev'
import TwoLineFormat from './TwoLineFormat'

interface FundActionType {
  className?: string
}

const CardStyled = styled(Card)`
  // border-top-left-radius: 0;
  // border-top-right-radius: 0;
  position: sticky;
  bottom: 0;
  left: 0;
  width: 100%;
`

const FundAction: React.FC<FundActionType> = ({ className }) => {
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl

  return (
    <CardStyled className={`flex flex-wrap justify-space-between pa-4 bd-t ${className}`}>
      <TwoLineFormat
        title="Current investment"
        subTitle="1.24 Shares"
        value="$1,000.23"
        percent="+0.2%"
        days="1 D"
        large
      />

      <div className={`flex ${isMobile ? 'col-12 pt-2' : 'col-6'}`}>
        <Button as={Link} to="/explore/invest" fullWidth radii="small" className="mr-3" variant="success">
          INVEST
        </Button>
        <Button as={Link} to="/explore/withdraw" fullWidth radii="small" className="flex flex-column">
          WITHDRAW
          <Text fontSize="12px" color="white">
            0.00%
          </Text>
        </Button>
      </div>
    </CardStyled>
  )
}

export default FundAction
