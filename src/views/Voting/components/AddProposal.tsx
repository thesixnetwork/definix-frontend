/* eslint-disable no-nested-ternary */
import React, { ChangeEvent, lazy, useState, useMemo, FormEvent } from 'react'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { ExternalLink } from 'react-feather'
import times from 'lodash/times'
// import useTheme from 'hooks/useTheme'
import { DatePicker, TimePicker } from 'components/DatePicker'
import { ArrowBackIcon, Button, Card, Input, Text, useMatchBreakpoints } from 'uikit-dev'
import Label from 'components/Label'

const EasyMde = lazy(() => import('components/EasyMde'))

const InputChoice = styled(Input)`
  width: 100%;
  background: unset;
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin: 20px 0px;
  padding: 2px 20px;
  display: flex;
  align-items: center;
`

const CardProposals = styled(Card)`
  height: 620px;
`

export const generatePayloadData = () => {
  return {
    timestamp: (Date.now() / 1e3).toFixed(),
  }
}

export enum SnapshotCommand {
  PROPOSAL = 'proposal',
  VOTE = 'vote',
}

export enum ProposalType {
  ALL = 'all',
  CORE = 'core',
  COMMUNITY = 'community',
}

export enum ProposalState {
  ACTIVE = 'active',
  PENDING = 'pending',
  CLOSED = 'closed',
}

const AddProposal: React.FC = () => {
  // const { path } = useRouteMatch()
  const { isXl, isLg } = useMatchBreakpoints()
  const isMobile = !isXl && !isLg
  // const { isDark } = useTheme()
  const { account } = useWallet()

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
  const [isLoading, setIsLoading] = useState(false)
  const { name, body, choices, startDate, startTime, endDate, endTime } = state
  const [fieldsState, setFieldsState] = useState<{ [key: string]: boolean }>({})

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

  const handleEasyMdeChange = (value: string) => {
    updateValue('body', value)
  }

  const options = useMemo(() => {
    return {
      hideIcons: !account ? [] : ['guide', 'fullscreen', 'preview', 'side-by-side', 'image'],
    }
  }, [account])

  const handleDateChange = (key: string) => (value: Date) => {
    updateValue(key, value)
  }

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = evt.currentTarget
    updateValue(inputName, value)
  }

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()

    console.log('body', body)

    try {
      setIsLoading(true)
      const proposal = JSON.stringify({
        ...generatePayloadData(),
        type: SnapshotCommand.PROPOSAL,
        payload: {
          name,
          body,
          start: '',
          end: '',
          choices: '',
          // metadata: generateMetaData(),
          type: '',
        },
      })
      console.log('proposal', proposal)
      // call api
    } catch (error) {
      setIsLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className={`flex align-stretch mt-2 ${isMobile ? 'flex-wrap' : ''}`}>
          <div className={isMobile ? 'col-12' : 'col-8 mr-2'}>
            <CardProposals className="mb-4">
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
                  <InputChoice
                    id="name"
                    value={name}
                    name="name"
                    className="mt-2 mb-1"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="pa-4">
                <Text bold color="text" fontSize="18px" marginBottom="10px">
                  Content
                </Text>
                <EasyMde
                  id="body"
                  name="body"
                  onTextChange={handleEasyMdeChange}
                  value={body}
                  options={options}
                  required
                />
              </div>
            </CardProposals>
          </div>
          <div className={isMobile ? 'col-12 mt-2' : 'col-4 ml-3'}>
            <CardProposals className="mb-4">
              <div className="pa-4 pt-3 bd-b">
                <Text fontSize="20px" bold lineHeight="1" marginTop="10px">
                  Actions
                </Text>
              </div>
              <div className="ma-3">
                <div className="mb-4">
                  <Text className="mb-3" color="text" fontSize="16px">
                    Start Date
                  </Text>
                  <DatePicker
                    name="startDate"
                    onChange={handleDateChange('startDate')}
                    selected={startDate}
                    placeholderText="YYYY/MM/DD"
                  />
                </div>
                <div className="mb-4">
                  <Text className="mb-3" color="text" fontSize="16px">
                    Start Time
                  </Text>
                  <TimePicker
                    name="startTime"
                    onChange={handleDateChange('startTime')}
                    selected={startTime}
                    placeholderText="00:00"
                  />
                </div>
                <div className="mb-4">
                  <Text className="mb-3" color="text" fontSize="16px">
                    End Date
                  </Text>
                  <DatePicker
                    name="endDate"
                    onChange={handleDateChange('endDate')}
                    selected={endDate}
                    placeholderText="YYYY/MM/DD"
                  />
                </div>
                <div className="mb-4">
                  <Text className="mb-3" color="text" fontSize="16px">
                    End Time
                  </Text>
                  <TimePicker
                    name="endTime"
                    onChange={handleDateChange('endTime')}
                    selected={endTime}
                    placeholderText="00:00"
                  />
                </div>
                <div className={`flex align-stretch ${isMobile ? 'flex-wrap' : 'my-4'}`}>
                  <div className={isMobile ? 'col-12' : 'col-4'}>
                    <Text fontSize="16px" lineHeight="1">
                      Creator
                    </Text>
                  </div>
                  <div className={`flex align-center ${isMobile ? 'col-12' : 'col-8'}`}>
                    <Text fontSize="16px" bold lineHeight="1" color="#30ADFF" mr="6px">
                      {/* {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`} */}
                      assfsf...dsgfkajgds
                    </Text>
                    <ExternalLink size={16} color="#30ADFF" />
                  </div>
                </div>
                <Button type="submit" variant="success" radii="small" className="my-2" size="sm">
                  Publish
                </Button>
                <Text color="#F5C858">You need at least 10 voting power to publish a proposal.</Text>
              </div>
            </CardProposals>
          </div>
        </div>
      </form>
    </>
  )
}

export default AddProposal
