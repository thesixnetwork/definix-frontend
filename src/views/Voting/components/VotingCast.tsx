/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-nested-ternary */
import React, { useState, useMemo, useEffect } from 'react'
import _ from 'lodash'
import { Button, Card, Text, useModal, useMatchBreakpoints } from 'uikit-dev'
import styled from 'styled-components'
import Radio from '@material-ui/core/Radio'
import RadioGroup, { useRadioGroup } from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { useAvailableVotes, useAllProposalOfAddress, useProposalIndex } from 'hooks/useVoting'
import CastVoteModal from '../Modals/CastVoteModal'

const CardList = styled(Card)<{ checked: boolean }>`
  width: 100%;
  height: 40px;
  border: 1px solid ${({ theme, checked }) => (checked ? '#30ADFF' : theme.colors.border)};
  border-radius: 30px;
  margin: 6px 0px;
  padding: 0px 20px;
  display: flex;
  align-items: center;
  background: ${({ theme, checked }) => checked && theme.colors.primary};
  &.Mui-checked {
    background: #0973b9;
    border: 1px solid #30adff;
  }
`

const CustomRadio = styled(Radio)`
  &.MuiRadio-root {
    color: #fcfcfc;
  }

  &.MuiFormControlLabel-label {
    color: ${({ theme, checked }) => checked && theme.colors.success};
  }

  &.MuiRadio-colorSecondary.Mui-checked {
    color: ${({ theme, checked }) => checked && theme.colors.success};
  }
`

const BpIcons = styled.span`
  border-radius: 24px;
  width: 0.8em;
  height: 0.75em;
  background-color: ${({ theme }) => (theme.isDark ? '#FFFFFF' : '#E3E6EC')} !important;
  border: 1.5px solid #979797;
  margin-left: 2px;

  &.Mui-focusVisible {
    outline: 2px auto rgba(19, 124, 189, 0.6);
    outline-offset: 2;
  }
`

const BpCheckboxIcons = styled.span`
  border-radius: 2px;
  width: 0.65em;
  height: 0.65em;
  background-color: ${({ theme }) => (theme.isDark ? '#FFFFFF' : '#E3E6EC')} !important;
  border: 1.5px solid #979797;
  margin-left: 2px;
  &.Mui-focusVisible {
    outline: 2px auto rgba(19, 124, 189, 0.6);
    outline-offset: 2;
  }
`

const CustomCheckbox = styled(Checkbox)`
  &.Mui-checked {
    color: ${({ theme }) => theme.colors.success} !important;
  }

  &.MuiCheckbox-root {
    color: #fcfcfc;
  }
`

const FormControlLabelCustom = styled(FormControlLabel)`
  height: 40px;
  margin: 0 0 0 -10px !important;

  .MuiFormControlLabel-label {
    flex-grow: 1;
  }
`

const VotePowerChoice = styled.div`
  display: flex;
  justify-content: center;
  width: initial;
`

function MyFormControlLabel(props) {
  const radioGroup = useRadioGroup()

  let checked = false

  if (radioGroup) {
    checked = radioGroup.value === props.value
  }

  return <CustomRadio checked={checked} {...props} icon={<BpIcons />} />
}

const VotingCast = ({ id, indexs, proposalIndex }) => {
  const { isXl, isLg } = useMatchBreakpoints()
  const isMobile = !isXl && !isLg
  const voteNow = indexs.startEpoch < Date.now() && indexs.endEpoch > Date.now()
  const { availableVotes } = useAvailableVotes()
  const { indexProposal } = useProposalIndex(proposalIndex)
  const { proposalOfAddress } = useAllProposalOfAddress()
  const items = proposalOfAddress.find((item) => item.proposalIndex === Number(proposalIndex))
  const [select, setSelect] = useState({})
  const [singleType, setSingleType] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [allChoice, setAllChoice] = useState([])
  const [flgMerge, setFlgMerge] = useState('')
  const choices = indexs.choices
  const choiceType = indexs.choice_type
  const allChoices = useMemo(() => {
    const set = []
    if (choices) {
      choices.map((v, index) => {
        set.push({
          id: index,
          value: v,
        })
        return set
      })
    }
    return set
  }, [choices])

  const flgDisable = useMemo(() => {
    const filterChecked = Object.values(select).filter((v, index) => {
      return _.get(v, 'checked') === true
    })
    return choiceType === 'single' ? Object.values(select).length : filterChecked.length
  }, [select, choiceType])

  const [onPresentConnectModal] = useModal(
    <CastVoteModal
      types={choiceType}
      select={select}
      singleType={singleType}
      proposalIndex={proposalIndex}
      allChoices={allChoices}
    />,
  )

  const handleRadioButton = (event, index, value) => {
    setSingleType([
      {
        id: index,
        value,
      },
    ])
    setSelect(event.target.value)
  }

  useEffect(() => {
    const getData = []
    setIsLoading(true)
    if (choices !== undefined && _.get(items, 'choices') !== undefined) {
      choices.map((data, index) => {
        return getData.push({ choiceName: data })
      })

      const mergeChoice = getData.map((item, row) => {
        const found =
          _.get(items, 'choices') !== undefined &&
          _.get(items, 'choices').find((element) => item.choiceName === element.choiceName)

        return { ...item, ...found }
      })
      setFlgMerge('Merge')
      setIsLoading(false)
      setAllChoice(mergeChoice)
    } else if (choices !== undefined) {
      setFlgMerge('NMerge')
      setAllChoice(Object.values(choices))
    }
  }, [items, choices])

  return (
    <>
      {voteNow && (
        <>
          <Card className="mb-4">
            <div className="pa-4 pt-3 bd-b mt-2 flex justify-space-between align-center">
              <Text fontSize="20px" bold lineHeight="1">
                Cast your vote
              </Text>
              <Text fontSize="16px" bold lineHeight="1" color="textSubtle">
                Your Voting Power
              </Text>
            </div>
            <div className="ma-3">
              <>
                {flgMerge === 'Merge' ? (
                  choiceType === 'single' ? (
                    <>
                      {allChoice &&
                        allChoice.map((c, index) => (
                          <RadioGroup
                            name="use-radio-group"
                            value={select}
                            onChange={(event, i) => handleRadioButton(event, index, _.get(c, 'choiceName'))}
                          >
                            <CardList checked={_.get(select, `${index}.value`)}>
                              <MyFormControlLabel
                                disabled={
                                  _.get(items, 'choices') !== undefined &&
                                  _.get(c, 'choiceName') !== _.get(items, 'choices.0.choiceName')
                                }
                                value={_.get(c, 'choiceName')}
                                label=""
                                control={<Radio />}
                              />
                              <VotePowerChoice
                                className="flex justify-space-between align-center"
                                style={{ width: 'inherit' }}
                              >
                                <Text fontSize={isMobile ? '12px' : '15px'} bold lineHeight="1">
                                  {_.get(c, 'choiceName')}
                                </Text>
                                <Text fontSize={isMobile ? '12px' : '15px'} bold lineHeight="1">
                                  {_.get(c, 'votePower') !== undefined && `${_.get(c, 'votePower')}`}
                                </Text>
                              </VotePowerChoice>
                            </CardList>
                          </RadioGroup>
                        ))}
                    </>
                  ) : (
                    allChoice &&
                    allChoice.map((c, index) => (
                      <CardList checked={_.get(select, `${index}.checked`)}>
                        <FormControlLabelCustom
                          control={
                            <CustomCheckbox
                              size="small"
                              checked={_.get(select, `${index}.checked`)}
                              onChange={(event, i) => {
                                setSelect({
                                  ...select,
                                  [index]: {
                                    checked: event.target.checked,
                                    id: index,
                                    value: _.get(c, 'choiceName'),
                                  },
                                })
                              }}
                              icon={<BpCheckboxIcons />}
                            />
                          }
                          label=""
                        />
                        <VotePowerChoice className="flex justify-space-between" style={{ width: 'inherit' }}>
                          <Text fontSize={isMobile ? '12px' : '15px'} bold lineHeight="1">
                            {_.get(c, 'choiceName')}
                          </Text>
                          <Text fontSize={isMobile ? '12px' : '15px'} bold lineHeight="1">
                            {_.get(c, 'votePower') !== undefined && `${_.get(c, 'votePower')}`}
                          </Text>
                        </VotePowerChoice>
                      </CardList>
                    ))
                  )
                ) : choiceType === 'single' ? (
                  <>
                    {choices &&
                      Object.values(choices).map((c, index) => (
                        <RadioGroup
                          name="use-radio-group"
                          value={select}
                          onChange={(event, i) => handleRadioButton(event, index, c)}
                        >
                          <CardList checked={_.get(select, `${index}.value`)}>
                            <MyFormControlLabel
                              disabled={
                                _.get(items, 'choices') !== undefined && c !== _.get(items, 'choices.0.choiceName')
                              }
                              value={c}
                              label=""
                              control={<Radio />}
                            />
                            <VotePowerChoice className="flex justify-space-between" style={{ width: 'inherit' }}>
                              <Text fontSize={isMobile ? '12px' : '15px'} bold lineHeight="1">
                                {c}
                              </Text>
                            </VotePowerChoice>
                          </CardList>
                        </RadioGroup>
                      ))}
                  </>
                ) : (
                  choices &&
                  Object.values(choices).map((c, index) => (
                    <CardList checked={_.get(select, `${index}.checked`)}>
                      <FormControlLabelCustom
                        control={
                          <CustomCheckbox
                            size="small"
                            checked={_.get(select, `${index}.checked`)}
                            onChange={(event, i) => {
                              setSelect({
                                ...select,
                                [index]: {
                                  checked: event.target.checked,
                                  id: index,
                                  value: c,
                                },
                              })
                            }}
                            icon={<BpCheckboxIcons />}
                          />
                        }
                        label=""
                      />
                      <VotePowerChoice className="flex justify-space-between" style={{ width: 'inherit' }}>
                        <Text fontSize={isMobile ? '12px' : '15px'} bold lineHeight="1">
                          {c}
                        </Text>
                      </VotePowerChoice>
                    </CardList>
                  ))
                )}
              </>
              <Button
                variant="success"
                radii="small"
                marginTop="10px"
                size="sm"
                disabled={
                  Number(availableVotes) <= 0 || Date.now() < _.get(indexProposal, 'startEpoch') || flgDisable === 0
                }
                onClick={() => {
                  onPresentConnectModal()
                }}
              >
                Cast vote
              </Button>
            </div>
          </Card>
        </>
      )}
    </>
  )
}

export default VotingCast
