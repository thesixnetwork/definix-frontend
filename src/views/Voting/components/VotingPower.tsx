/* eslint-disable no-nested-ternary */
import React, { useState, useMemo, useEffect } from 'react'
import { AddIcon, MinusIcon, Button, Card, Text, Heading, useMatchBreakpoints, LinkExternal } from 'uikit-dev'
import { ChevronDown } from 'react-feather'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { Collapse, CardContent, IconButton } from '@material-ui/core'
import iconExpore from '../../../uikit-dev/images/for-ui-v2/voting/icon-expore.png'

const Box = styled.div`
  border: 1px solid #979797;
  border-radius: 6px;
  padding: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(() => ({
  '&.MuiIconButton-root': {
    padding: "unset"
  }
}));

const BoxDetails = styled.div`
  border: 1px solid #979797;
  border-radius: 6px;
  margin: 24px;
  margin-top: 0px;
`

const VotingPower = () => {
  const { account } = useWallet()
  const { isDark } = useTheme()
  const { isXl, isLg } = useMatchBreakpoints()
  const isMobile = !isXl && !isLg

  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <Card className="mb-4">
        <div className="pa-4 pt-3 bd-b">
          <Text fontSize="20px" bold lineHeight="1" marginTop="10px">
            Voting Power
          </Text>
        </div>
        <div className="ma-5 mb-0">
          <Box>
            <Text fontSize="18px" bold lineHeight="1">
              Your Voting Power
            </Text>
            <Text fontSize="18px" bold lineHeight="1" color="#30ADFF">
              0
            </Text>
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ChevronDown />
            </ExpandMore>
          </Box>
        </div>
        <BoxDetails>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <div className="flex justify-space-between pa-3">
              <Text fontSize="16px">Your FINIX held now</Text>
              <Text fontSize="16px" bold color="#30ADFF">2,938.23</Text>
            </div>


          </Collapse>
        </BoxDetails>

      </Card>
    </>
  )
}

export default VotingPower
