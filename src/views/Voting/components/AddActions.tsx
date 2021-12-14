/* eslint-disable no-nested-ternary */
import React from 'react'
import { ArrowBackIcon, Button, Card, Text, Input, useMatchBreakpoints } from 'uikit-dev'
import { Link, Redirect } from 'react-router-dom'
import { ExternalLink } from 'react-feather'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import exploreIcon from '../../../uikit-dev/images/for-ui-v2/voting/icon-explore.png'
// import development from '../../../uikit-dev/images/for-ui-v2/voting/voting-development.png'

const BoxInput = styled(Input)`
  width: 100%;
  background: unset;
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin: 20px 0px;
  padding: 2px 20px;
  display: flex;
  align-items: center;
`



const AddActions = () => {
  const { isDark } = useTheme()
  const { isXl, isLg } = useMatchBreakpoints()
  const isMobile = !isXl && !isLg

  return (
    <>
      <Card className="mb-4">
        <div className="pa-4 pt-3 bd-b">
          <Text fontSize="20px" bold lineHeight="1" marginTop="10px">
            Actions
          </Text>
        </div>
        <div className="ma-3">
          <div className="mb-3">
            <Text color="text" fontSize="16px">
              Start Date
            </Text>
            <BoxInput className="my-2" placeholder="DD-MM-YY" />
          </div>
          <div className="mb-3">
            <Text color="text" fontSize="16px">
              Start Time
            </Text>
            <BoxInput className="my-2" placeholder="00:00" />
          </div>
          <div className="mb-3">
            <Text color="text" fontSize="16px">
              End Date
            </Text>
            <BoxInput className="my-2" placeholder="DD-MM-YY" />
          </div>
          <div className="mb-3">
            <Text color="text" fontSize="16px">
              End Time
            </Text>
            <BoxInput className="my-2" placeholder="00:00" />
          </div>
          <div className={`flex align-stretch ${isMobile ? 'flex-wrap' : ''}`}>
            <div className={isMobile ? 'col-12' : 'col-4'}>
              <Text fontSize="16px" lineHeight="1">
                Identifier
              </Text>
            </div>
            <div className={`flex align-center ${isMobile ? 'col-12' : 'col-8'}`}>
              <Text fontSize="16px" bold lineHeight="1" color="#30ADFF" mr="6px">
                QmaSFZ3p
              </Text>
              <img src={exploreIcon} alt="exploreIcon" width={16} />
            </div>
          </div>
          <Button variant="success" radii="small" className="my-4">
            Publish
          </Button>
          <Text color="#F5C858">You need at least 10 voting power to publish a proposal.</Text>
        </div>
      </Card>
    </>
  )
}

export default AddActions
