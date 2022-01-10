/* eslint-disable no-nested-ternary */
import React, { useState } from 'react'
import useWallet from 'hooks/useWallet'
import { ExternalLink } from 'react-feather'
import styled from 'styled-components'
import { Button, Card, Text, useMatchBreakpoints } from '../../../uikit-dev'
import useTheme from '../../../hooks/useTheme'
import { DatePicker, TimePicker } from '../../../components/DatePicker'

export interface FormState {
  name: string
  body: string
  // choices: Choice[]
  startDate: Date
  startTime: Date
  endDate: Date
  endTime: Date
  snapshot: number
}

const LinkView = styled(Button)`
  background-color: unset;
  cursor: pointer;
`

const AddActions = () => {
  const { account } = useWallet()
  const { isDark } = useTheme()
  const { isXl, isLg } = useMatchBreakpoints()
  const isMobile = !isXl && !isLg
  const [state, setState] = useState<FormState>({
    name: '',
    body: '',
    // choices: times(MINIMUM_CHOICES).map(makeChoice),
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
    snapshot: 0,
  })
  const { name, body, startDate, startTime, endDate, endTime, snapshot } = state
  const [fieldsState, setFieldsState] = useState<{ [key: string]: boolean }>({})

  const handleDateChange = (key: string) => (value: Date) => {
    updateValue(key, value)
  }

  const updateValue = (key: string, value: string | Date) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }))

    setFieldsState((prevFieldsState) => ({
      ...prevFieldsState,
      [key]: true,
    }))
  }

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
            <Text className="mb-2" color="text" fontSize="16px">
              Start Date
            </Text>
            <DatePicker
              name="startDate"
              onChange={handleDateChange('startDate')}
              selected={startDate}
              placeholderText="YYYY/MM/DD"
            />
          </div>
          <div className="mb-3">
            <Text className="mb-2" color="text" fontSize="16px">
              Start Time
            </Text>
            <TimePicker
              name="startTime"
              onChange={handleDateChange('startTime')}
              selected={startTime}
              placeholderText="00:00"
            />
          </div>
          <div className="mb-3">
            <Text className="mb-2" color="text" fontSize="16px">
              End Date
            </Text>
            <DatePicker
              name="endDate"
              onChange={handleDateChange('endDate')}
              selected={endDate}
              placeholderText="YYYY/MM/DD"
            />
          </div>
          <div className="mb-3">
            <Text className="mb-2" color="text" fontSize="16px">
              End Time
            </Text>
            <TimePicker
              name="endTime"
              onChange={handleDateChange('endTime')}
              selected={endTime}
              placeholderText="00:00"
            />
          </div>
          <div className={`flex align-stretch ${isMobile ? 'flex-wrap' : ''}`}>
            <div className={isMobile ? 'col-12' : 'col-4'}>
              <Text fontSize="16px" lineHeight="1">
                Creator
              </Text>
            </div>
            <div className={`flex align-center ${isMobile ? 'col-12' : 'col-8'}`}>
              <Text fontSize="16px" bold lineHeight="1" color="#30ADFF" mr="6px">
                {account && (
                  <>
                    {`${account.substring(0, 12)}...${account.substring(account.length - 4)}`}
                    <LinkView as="a" href={`${process.env.REACT_APP_KLAYTN_URL}/account/${account}`} target="_blank">
                      <ExternalLink size={16} color="#30ADFF" />
                    </LinkView>
                  </>
                )}
              </Text>
            </div>
          </div>
          <Button variant="success" radii="small" className="my-4" size="sm">
            Publish
          </Button>
          <Text color="#F5C858">You need at least 10 voting power to publish a proposal.</Text>
        </div>
      </Card>
    </>
  )
}

export default AddActions
