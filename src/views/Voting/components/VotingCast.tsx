/* eslint-disable no-nested-ternary */
import React, { useState, useMemo, useEffect } from 'react'
import _ from 'lodash'
import { Button, Card, Text, useModal } from 'uikit-dev'
import styled from 'styled-components'
import Radio from '@material-ui/core/Radio'
import RadioGroup, { useRadioGroup } from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { useAvailableVotes, useAllProposalOfAddress, useProposalIndex } from 'hooks/useVoting'
import CastVoteModal from '../Modals/CastVoteModal'
// import development from '../../../uikit-dev/images/for-ui-v2/voting/voting-development.png'

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
  const voteNow = indexs.startEpoch < Date.now() && indexs.endEpoch > Date.now()
  // const { isDark } = useTheme()
  // const { isXl, isLg } = useMatchBreakpoints()
  // const isMobile = !isXl && !isLg
  const availableVotes = useAvailableVotes()
  const { indexProposal } = useProposalIndex(proposalIndex)
  const { proposalOfAddress } = useAllProposalOfAddress()
  const items = proposalOfAddress.find((item) => item.proposalIndex === Number(proposalIndex))
  const [select, setSelect] = useState({})
  const [singleType, setSingleType] = useState({})
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
    return filterChecked.length
  }, [select])

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

  const checked = useMemo(() => {
    const arrUniq = []
    if (_.get(items, 'choices') && choices) {
      choices.map((v, index) => {
        _.get(items, 'choices').filter((b) => {
          if (_.get(b, 'choiceName') === v) {
            arrUniq.push({
              id: index,
              value: v,
              votePower: _.get(b, 'votePower'),
            })
          } else {
            arrUniq.push({
              id: index,
              value: v,
              votePower: '',
            })
          }
          return arrUniq
        })
        return arrUniq
      })
    }
    return arrUniq
  }, [choices, items])

  return (
    <>
      {voteNow && (
        <>
          <Card className="mb-4">
            <div className="pa-4 pt-3 bd-b">
              <Text fontSize="20px" bold lineHeight="1" marginTop="10px">
                Cast your vote
              </Text>
            </div>
            <div className="ma-3">
              <>
                {choiceType === 'single' ? (
                  <>
                    {checked &&
                      checked.map((c, index) => (
                        <RadioGroup
                          name="use-radio-group"
                          value={select}
                          onChange={(event, i) => handleRadioButton(event, index, _.get(c, 'value'))}
                        >
                          <CardList checked={_.get(select, `${index}.value`)}>
                            <MyFormControlLabel
                              disabled={
                                _.get(items, 'choices') !== undefined &&
                                _.get(c, 'value') !== _.get(items, 'choices.0.choiceName')
                              }
                              value={_.get(c, 'value')}
                              label=""
                              control={<Radio />}
                            />
                            <VotePowerChoice className="flex justify-space-between" style={{ width: 'inherit' }}>
                              <Text fontSize="15px" bold>
                                {_.get(c, 'value')}
                              </Text>
                              <Text fontSize="15px" bold>
                                {_.get(c, 'votePower') !== '' && `Your Voting Power : ${_.get(c, 'votePower')}`}
                              </Text>
                            </VotePowerChoice>
                          </CardList>
                        </RadioGroup>
                      ))}
                  </>
                ) : (
                  checked &&
                  checked.map((c, index) => (
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
                                  value: _.get(c, 'value'),
                                },
                              })
                            }}
                            icon={<BpCheckboxIcons />}
                          />
                        }
                        label=""
                      />
                      <VotePowerChoice className="flex justify-space-between" style={{ width: 'inherit' }}>
                        <Text fontSize="15px" bold>
                          {_.get(c, 'value')}
                        </Text>
                        <Text fontSize="15px" bold>
                          {_.get(c, 'votePower') !== '' && `Your Voting Power : ${_.get(c, 'votePower')}`}
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
