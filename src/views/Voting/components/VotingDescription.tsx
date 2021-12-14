/* eslint-disable no-nested-ternary */
import React from 'react'
import { ArrowBackIcon, Button, Card, Text, Heading, useMatchBreakpoints } from 'uikit-dev'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { LeftPanel, TwoPanelLayout } from 'uikit-dev/components/TwoPanelLayout'
import coreIcon from 'uikit-dev/images/for-ui-v2/voting/icon-core.png'
// import communityIcon from 'uikit-dev/images/for-ui-v2/voting/icon-community.png'

const SpecialOutline = styled.div`
  background-color: unset;
  border-radius: 6px;
  border: 1px solid #1587c9;
  color: #1587c9;
  font-size: 14px;
  font-style: italic;
  cursor: unset;
  padding: 9px 10px;
`

const SpecialOutlineCore = styled.div`
  background-color: unset;
  border-radius: 6px;
  border: 1px solid #55bd92;
  color: #55bd92;
  font-size: 14px;
  font-style: italic;
  cursor: unset;
  padding: 8px 16px;
  display: flex;
  align-items: center;
`

const Description = styled(Card)`
  padding: 24px;
  font-size: 16px;
`

const VotingDescription = () => {
  const { isDark } = useTheme()
  const { isXl, isLg } = useMatchBreakpoints()
  const isMobile = !isXl && !isLg

  return (
    <>
      <Card className="mb-4">
        <div className="pa-4 pt-3 bd-b">
          <Button
            variant="text"
            as={Link}
            to="/voting"
            ml="-12px"
            mb="12px"
            padding="0 12px"
            size="sm"
            startIcon={<ArrowBackIcon color="textSubtle" />}
          >
            <Text fontSize="14px" color="textSubtle">
              Back
            </Text>
          </Button>
          <div className="flex align-center">
            <SpecialOutline color="primary">Vote Now</SpecialOutline>
            &nbsp;
            <SpecialOutlineCore color="success">
              <img src={coreIcon} alt="coreIcon" width={16} />&nbsp;
              <span>Core</span>
            </SpecialOutlineCore>
          </div>
          <Text fontSize="32px" bold lineHeight="1" marginTop="10px">
            Proposal Topic Proposal Topic Proposal Topic
          </Text>
        </div>
        <Description>
          <Text>
            &quot;Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.&quot;
          </Text>
          <br />
          <Text>
            <b>Section 1.10.32 of &quot;de Finibus Bonorum et Malorum&quot;, written by Cicero in 45</b>
            &quot; Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
            totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt
            explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur
            magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia
            dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et
            dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam
            corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure
            reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum
            fugiat quo voluptas nulla pariatur?&quot;
          </Text>
          <br />
          <Text>
            <b>Total Tokens</b>: 5,000 ETERNAL
          </Text>
          <Text>
            <b>Distribution duration</b>: 60 days
          </Text>
          <Text>
            <b>Start block</b>Start block: #12500976 (approx. 11am UTC on November 9th 2021)
          </Text>
          <Text>
            <b>Finish block</b>: #14228976 (approx. 11am UTC on January 8th 2022)
          </Text>
          <Text>
            <b>Token rewards per block</b>: 0.002893 ETERNAL
          </Text>
        </Description>
      </Card>
    </>
  )
}

export default VotingDescription
