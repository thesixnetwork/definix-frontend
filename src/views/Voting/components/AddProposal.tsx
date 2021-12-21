/* eslint-disable no-nested-ternary */
import React, { useEffect, ChangeEvent, lazy, useState, useMemo, FormEvent } from 'react'
import Lottie from 'react-lottie'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import axios from 'axios'
import Caver from 'caver-js'
import _ from 'lodash'
import moment from 'moment'
import { Link } from 'react-router-dom'

import styled from 'styled-components'
import { ExternalLink } from 'react-feather'
import times from 'lodash/times'
import { usePropose } from 'hooks/useVoting'
import { getCaver } from 'utils/caver'
import ModalStake from 'uikit-dev/widgets/Modal/ModalStake'
import ModalResponses from 'uikit-dev/widgets/Modal/ModalResponses'
import ModalSorry from 'uikit-dev/widgets/Modal/ModalSorry'
import success from 'uikit-dev/animation/complete.json'
import loadings from 'uikit-dev/animation/farmPool.json'
import { DatePicker, TimePicker } from 'components/DatePicker'
import { Box, ArrowBackIcon, Button, Card, Input, Text, useMatchBreakpoints } from 'uikit-dev'
import { format, parseISO, isValid } from 'date-fns'
import AddChoices, { Choice, makeChoice, MINIMUM_CHOICES } from './AddChoices'
import VotingPower from './VotingPower'

const SuccessOptions = {
  loop: true,
  autoplay: true,
  animationData: success,
}

const LoadingOptions = {
  loop: true,
  autoplay: true,
  animationData: loadings,
}

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

const LinkView = styled(Button)`
  background-color: unset;
  cursor: pointer;
  padding-left: 6px;
`

const CardProposals = styled(Card)`
  // height: 620px;
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

export const combineDateAndTime = (date: Date, time: Date) => {
  if (!isValid(date) || !isValid(time)) {
    return null
  }

  const dateStr = format(date, 'yyyy-MM-dd')
  const timeStr = format(time, 'HH:mm:ss')

  return parseISO(`${dateStr}T${timeStr}`).getTime() / 1e3
}

const BaseLabel = styled.label`
  color: ${({ theme }) => theme.colors.text};
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
`

export const Label = styled(BaseLabel)`
  font-size: 20px;
`

export const SecondaryLabel = styled(BaseLabel)`
  font-size: 12px;
  text-transform: uppercase;
`

export const FormError: React.FC = ({ children }) => (
  <Text color="failure" mb="4px">
    {children}
  </Text>
)

export const FormErrors: React.FC<{ errors: string[] }> = ({ errors }) => {
  return (
    <Box mt="8px">
      {errors.map((error) => {
        return <FormError key={error}>{error}</FormError>
      })}
    </Box>
  )
}
interface Props {
  onDismiss?: () => void
}

const AddProposal: React.FC<Props> = ({ onDismiss = () => null }) => {
  const { isXl, isLg } = useMatchBreakpoints()
  const isMobile = !isXl && !isLg
  const { account } = useWallet()

  const [state, setState] = useState({
    name: '',
    body: '',
    choices: times(MINIMUM_CHOICES).map(makeChoice),
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
    snapshot: 0,
    ipfs: '',
  })

  const [isLoading, setIsLoading] = useState('')
  const [choiceType, setChoiceType] = useState('single')
  const { name, body, choices, startDate, startTime, endDate, endTime, ipfs } = state
  const [fieldsState, setFieldsState] = useState<{ [key: string]: boolean }>({})
  const filterChoices = choices.map((choice) => {
    return choice.value
  })
  const { onPropose } = usePropose(
    ipfs,
    0,
    combineDateAndTime(startDate, startTime),
    combineDateAndTime(endDate, endTime),
    choices.length,
    0,
    choiceType === 'single' ? 1 : filterChoices.length,
  )

  const updateValue = (key: string, value: string | Choice[] | Date) => {
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

  const handleChoiceChange = (newChoices: Choice[]) => {
    updateValue('choices', newChoices)
  }

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()

    try {
      setIsLoading('loading')
      const caver = getCaver()
      const epochTime = moment().unix()

      const sign = await caver.klay.sign(epochTime.toString(), account)

      const voteAPI = process.env.REACT_APP_VOTE_IPFS
      const bodyRequest = {
        message: epochTime.toString(),
        signature: sign,
        proposals_type: 'core',
        title: name,
        content: body,
        choice_type: choiceType,
        choices: filterChoices,
        start_unixtimestamp: combineDateAndTime(startDate, startTime),
        end_unixtimestamp: combineDateAndTime(endDate, endTime),
      }

      await axios
        .put(`${voteAPI}`, bodyRequest)
        .then(async (resp) => {
          if (resp) {
            await updateValue('ipfs', resp.data.result.IpfsHash)
            const res = onPropose()
            res
              .then((r) => {
                if (_.get(r, 'status')) {
                  setIsLoading('success')
                  setInterval(() => setIsLoading(''), 5000)
                }
              })
              .catch((e) => {
                console.log('1')
                setIsLoading('failed')
              })
          }
        })
        .catch((e) => {
          console.log('2')
          setIsLoading('success')
        })
    } catch (e) {
      console.log('3')
      setIsLoading('success')
    }
  }

  const hasMinimumChoices = choices.filter((choice) => choice.value.length > 0).length >= MINIMUM_CHOICES

  const CardResponse = () => {
    return (
      <ModalResponses title="" onDismiss={onDismiss}>
        <div className="pb-6 pt-2">
          <Lottie options={SuccessOptions} height={155} width={185} />
        </div>
      </ModalResponses>
    )
  }

  const CardLoading = () => {
    return (
      <ModalResponses title="" onDismiss={onDismiss}>
        <div className="pb-6 pt-2">
          <Lottie options={LoadingOptions} height={155} width={185} />
        </div>
      </ModalResponses>
    )
  }

  return (
    <>
      {isLoading === 'loading' ? (
        <div style={{ position: 'absolute' }}>
          <ModalStake title="" onDismiss={onDismiss}>
            <CardLoading />
          </ModalStake>
        </div>
      ) : (
        isLoading === 'success' && (
          <div style={{ position: 'absolute' }}>
            <ModalStake title="" onDismiss={onDismiss}>
              <CardResponse />
            </ModalStake>
          </div>
        )
      )}

      <form onSubmit={handleSubmit}>
        <div className={`flex mt-2 ${isMobile ? 'flex-wrap' : ''}`}>
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
                <div className={`flex align-center ${isMobile ? 'flex-wrap' : 'my-3'}`}>
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
                          <LinkView
                            as="a"
                            href={`${process.env.REACT_APP_KLAYTN_URL}/account/${account}`}
                            target="_blank"
                          >
                            <ExternalLink size={16} color="#30ADFF" />
                          </LinkView>
                        </>
                      )}
                    </Text>
                  </div>
                </div>
                <Button
                  disabled={!hasMinimumChoices || isLoading === 'loading' || isLoading === 'success'}
                  type="submit"
                  variant="success"
                  radii="small"
                  className="mt-1 mb-2"
                  size="sm"
                >
                  Publish
                </Button>
                <Text color="#F5C858" fontSize="14px">
                  You need at least 10 voting power to publish a proposal.
                </Text>
              </div>
            </CardProposals>
          </div>
        </div>
        <div className={`flex ${isMobile ? 'flex-wrap' : ''}`}>
          <div className={isMobile ? 'col-12' : 'col-8 mr-2'}>
            <AddChoices
              choices={choices}
              onChange={handleChoiceChange}
              setChoiceType={setChoiceType}
              isLoading={isLoading}
            />
          </div>
          <div className={isMobile ? 'col-12 mt-2' : 'col-4 ml-3'}>
            <VotingPower />
          </div>
        </div>
      </form>
    </>
  )
}

export default AddProposal
