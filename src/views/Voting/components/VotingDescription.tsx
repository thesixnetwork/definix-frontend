/* eslint-disable no-nested-ternary */
import React from 'react'
import { ArrowBackIcon, Button, Card, Text } from 'uikit-dev'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import ReactMarkdown from 'components/ReactMarkdown'
// import useTheme from 'hooks/useTheme'
// import { LeftPanel, TwoPanelLayout } from 'uikit-dev/components/TwoPanelLayout'
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
  // const { isDark } = useTheme()
  // const { isXl, isLg } = useMatchBreakpoints()
  // const isMobile = !isXl && !isLg

  const body =
    '**text**\n*text*\n# text\n> text\n* text\n1. text\n[text](https://definix.com)\n\ntext text **dsgsdg** *23423523* \n\n or use shortcuts like `ctrl-b` or `cmd-b`.'
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
              <img src={coreIcon} alt="coreIcon" width={16} />
              &nbsp;
              <span>Core</span>
            </SpecialOutlineCore>
          </div>
          <Text fontSize="32px" bold lineHeight="1" marginTop="10px">
            Proposal Topic Proposal Topic Proposal Topic
          </Text>
        </div>
        <Description>
          <ReactMarkdown>{body}</ReactMarkdown>
        </Description>
      </Card>
    </>
  )
}

export default VotingDescription
