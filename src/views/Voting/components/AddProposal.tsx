/* eslint-disable no-nested-ternary */
import React, { ChangeEvent, FormEvent, lazy, useEffect, useState, useMemo } from 'react'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { Link, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import times from 'lodash/times'
import useTheme from 'hooks/useTheme'
import { MaxWidth } from 'uikit-dev/components/TwoPanelLayout'
import { ArrowBackIcon, Button, Card, CardHeader, CardBody, Input, Text, useMatchBreakpoints, Heading } from 'uikit-dev'

const EasyMde = lazy(() => import('components/EasyMde'))

const AddProposal: React.FC = () => {
  const { path } = useRouteMatch()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const { isDark } = useTheme()
  const { account, connector } = useWallet()

  const [state, setState] = useState({
    name: '',
    body: '',
    choices: times(1),
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
    snapshot: 0,
  })
  const { name, body, choices, startDate, startTime, endDate, endTime, snapshot } = state
  const [fieldsState, setFieldsState] = useState<{ [key: string]: boolean }>({})

  const updateValue = (key: string, value: string | Date) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }))

    // Keep track of what fields the user has attempted to edit
    setFieldsState((prevFieldsState) => ({
      ...prevFieldsState,
      [key]: true,
    }))
  }

  const handleEasyMdeChange = (value: string) => {
    updateValue('body', value)
  }

  const options = useMemo(() => {
    return {
      hideIcons: account ? [] : ['guide', 'fullscreen', 'preview', 'side-by-side', 'image'],
    }
  }, [account])

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
          <div>
            <Text bold color="text" fontSize="18px">
              Title
            </Text>
            <Input className="mt-2 mb-1" />
          </div>
        </div>
        <div className="pa-4">
          <Text bold color="text" fontSize="18px">
            Content
          </Text>
          <EasyMde id="body" name="body" onTextChange={handleEasyMdeChange} value={body} options={options} required />
          {body && (
            <div className="my-5">
              <Card>
                <CardHeader>
                  <Text bold color="text" fontSize="18px">
                    Preview
                  </Text>
                  {/* <Heading as="h3" scale="md">
                      {t('Preview')}
                    </Heading> */}
                </CardHeader>
                <CardBody p="0" px="24px">
                  <div>{body}</div>
                </CardBody>
              </Card>
            </div>
          )}
        </div>
      </Card>
    </>
  )
}

export default AddProposal
