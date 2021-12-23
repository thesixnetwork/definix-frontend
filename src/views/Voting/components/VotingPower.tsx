/* eslint-disable no-nested-ternary */
import React from 'react'
import { Card, Text } from 'uikit-dev'
import { ChevronDown } from 'react-feather'
import numeral from 'numeral'
import { usePrivateData } from 'hooks/useLongTermStake'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { Collapse, IconButton } from '@material-ui/core'
import { useAvailableVotes } from 'hooks/useVoting'

const Box = styled.div<{ expand: boolean }>`
  border: 1px solid #979797;
  border-radius: 6px;
  border-bottom-left-radius: ${({ expand }) => (expand ? '0px' : '6px')};
  border-bottom-right-radius: ${({ expand }) => (expand ? '0px' : '6px')};
  padding: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const BoxDetails = styled.div<{ expand: boolean }>`
  border: 1px solid #979797;
  border-radius: 6px;
  border-top-left-radius: ${({ expand }) => (expand ? '0px' : '6px')};
  border-top-right-radius: ${({ expand }) => (expand ? '0px' : '6px')};
  border-top: unset;
  padding: 14px;
  margin: 0px 24px 20px;
`

const ExpandMore = styled((props) => {
  const { ...other } = props
  return <IconButton {...other} />
})(() => ({
  '&.MuiIconButton-root': {
    padding: 'unset',
  },
}))

const VotingPower = () => {
  const { isDark } = useTheme()
  const availableVotes = useAvailableVotes()
  const { balancevfinix } = usePrivateData()
  const [expanded, setExpanded] = React.useState(false)
  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  return (
    <>
      <Card className="mb-4">
        <div className="pa-4 pt-3 bd-b">
          <Text fontSize="20px" bold lineHeight="1" marginTop="10px">
            Voting Power
          </Text>
        </div>
        <div className={`${expanded === false ? 'ma-5' : 'ma-5 mb-0'}`}>
          <Box expand={expanded}>
            <Text fontSize="18px" bold lineHeight="1">
              Your Voting Power
            </Text>
            <div className="flex align-center">
              <Text fontSize="18px" bold lineHeight="1" color="#30ADFF" mr="10px">
                {numeral(availableVotes).format('0,0.00')}{' '}
              </Text>
              <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
                <ChevronDown color={isDark ? 'white' : 'black'} />
              </ExpandMore>
            </div>
          </Box>
        </div>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <BoxDetails expand={expanded}>
            <div className="flex justify-space-between">
              <Text fontSize="16px">Your FINIX held now</Text>
              <Text fontSize="16px" bold color="#30ADFF">
                {numeral(balancevfinix).format('0,0.00')}{' '}
              </Text>
            </div>
          </BoxDetails>
        </Collapse>
      </Card>
    </>
  )
}

export default VotingPower
