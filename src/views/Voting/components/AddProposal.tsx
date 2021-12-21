/* eslint-disable no-nested-ternary */
import React, { useCallback, ChangeEvent, lazy, useState, useMemo, FormEvent } from 'react'
import Lottie from 'react-lottie'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import axios from 'axios'
import Caver from 'caver-js'
import _ from 'lodash'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import styled from 'styled-components'
import { ExternalLink } from 'react-feather'
import times from 'lodash/times'
import { getCaver } from 'utils/caver'
import ModalResponses from 'uikit-dev/widgets/Modal/ModalResponses'
import success from 'uikit-dev/animation/complete.json'
// import useTheme from 'hooks/useTheme'
import { usePropose } from 'hooks/useVoting'
import { DatePicker, TimePicker } from 'components/DatePicker'
import { Box, ArrowBackIcon, Button, Card, Input, Text, useMatchBreakpoints } from 'uikit-dev'
import { format, parseISO, isValid } from 'date-fns'
import { useAllProposalOfType } from '../../../hooks/useVoting'
import AddChoices, { Choice, makeChoice, MINIMUM_CHOICES } from './AddChoices'
import VotingPower from './VotingPower'

const SuccessOptions = {
  loop: true,
  autoplay: true,
  animationData: success,
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
  // const allProposal = useAllProposalOfType()
  // console.log('allProposal >>',allProposal)
  // const listAllProposal = _.get(allProposal, 'allProposal')
  const [isLoading, setIsLoading] = useState(false)
  const [choiceType, setChoiceType] = useState('single')
  const { name, body, choices, startDate, startTime, endDate, endTime, ipfs } = state
  const [fieldsState, setFieldsState] = useState<{ [key: string]: boolean }>({})
  const { onPropose } = usePropose(
    ipfs,
    0,
    combineDateAndTime(startDate, startTime),
    combineDateAndTime(endDate, endTime),
    choices.length,
    0,
    1,
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

  const filterChoices = choices.map((choice) => {
    return choice.value
  })

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()

    try {
      await setIsLoading(true)
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
            console.log('resp >>>>>> ', resp.data.result.IpfsHash)
            await updateValue('ipfs', resp.data.result.IpfsHash)
            const res = onPropose()
            res
              .then((r) => {
                console.log('r >>>>>> ', r)
                if (_.get(r, 'status')) {
                  setInterval(() => setIsLoading(false), 5000)
                }
              })
              .catch((e) => {
                console.log('e >>>>>> ', e)
                setIsLoading(false)
              })
          }
        })
        .catch((e) => {
          setIsLoading(false)
        })
    } catch (e) {
      setIsLoading(false)
    }
  }

  const hasMinimumChoices = choices.filter((choice) => choice.value.length > 0).length >= MINIMUM_CHOICES

  const CardResponse = () => {
    return (
      <ModalResponses title="" onDismiss={onDismiss} className="">
        <div className="pb-6 pt-2">
          <Lottie options={SuccessOptions} height={155} width={185} />
        </div>
      </ModalResponses>
    )
  }

  return (
    <>
      {isLoading && (
        <div style={{ position: 'absolute' }}>
          <CardResponse />
        </div>
      )}
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
                <Button
                  disabled={!hasMinimumChoices || isLoading}
                  type="submit"
                  variant="success"
                  radii="small"
                  className="my-2"
                  size="sm"
                >
                  Publishee
                </Button>
                <Text color="#F5C858">You need at least 10 voting power to publish a proposal.</Text>
              </div>
            </CardProposals>
          </div>
        </div>
        <div className={`flex align-stretch mt-1 ${isMobile ? 'flex-wrap' : ''}`}>
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
