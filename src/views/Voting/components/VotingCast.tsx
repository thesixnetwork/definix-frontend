/* eslint-disable no-nested-ternary */
import React, { useState, useMemo, useEffect } from 'react'
import _ from 'lodash'
import { Button, Card, Text, useModal } from 'uikit-dev'
import styled from 'styled-components'
import Radio from '@material-ui/core/Radio'
import RadioGroup, { useRadioGroup } from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { useAvailableVotes } from 'hooks/useVoting'
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

// function MyFormControlLabel(props) {
//   const radioGroup = useRadioGroup()

//   let checked = false

//   if (radioGroup) {
//     checked = radioGroup.value === props.value
//   }

//   return <CustomRadio checked={checked} {...props} icon={<BpIcons />} />
// }

const VotingCast = ({ id, indexs, proposalIndex }) => {
  // const { isDark } = useTheme()
  // const { isXl, isLg } = useMatchBreakpoints()
  // const isMobile = !isXl && !isLg
  const availableVotes = useAvailableVotes()
  const [select, setSelect] = useState({})
  const choices = indexs.choices
  const filterChoies = useMemo(() => {
    return choices
  }, [choices])
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
  const [onPresentConnectModal] = useModal(
    <CastVoteModal select={select} proposalIndex={proposalIndex} allChoices={allChoices} />,
  )

  return (
    <>
      <Card className="mb-4">
        <div className="pa-4 pt-3 bd-b">
          <Text fontSize="20px" bold lineHeight="1" marginTop="10px">
            Cast your vote
          </Text>
        </div>
        <div className="ma-3">
          {choices &&
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
                <Text fontSize="15px" bold>
                  {c}
                </Text>
              </CardList>
            ))}
          <Button
            variant="success"
            radii="small"
            marginTop="10px"
            size="sm"
            disabled={Number(availableVotes) <= 0}
            onClick={() => {
              onPresentConnectModal()
            }}
          >
            Cast vote
          </Button>
        </div>
        {/* <div className="ma-3">
          <CardList checked={_.get(select, `${0}.checked`)}>
            <FormControlLabelCustom
              control={
                <CustomCheckbox
                  size="small"
                  defaultChecked
                  checked={_.get(select, `${0}.checked`)}
                  onChange={(event, i) => {
                    setSelect({
                      ...select,
                      0: {
                        checked: event.target.checked,
                        id: 0,
                      },
                    })
                  }}
                  icon={<BpCheckboxIcons />}
                />
              }
              label=""
            />
            <Text fontSize="15px" bold>
              Yes, agree with you.
            </Text>
          </CardList>
          <CardList checked={_.get(select, `${1}.checked`)}>
            <FormControlLabelCustom
              control={
                <CustomCheckbox
                  size="small"
                  checked={_.get(select, `${1}.checked`)}
                  onChange={(event, i) => {
                    setSelect({
                      ...select,
                      1: {
                        checked: event.target.checked,
                        id: 1,
                      },
                    })
                  }}
                  icon={<BpCheckboxIcons />}
                />
              }
              label=""
            />
            <Text fontSize="15px" bold>
              No, I’m not agree with you.
            </Text>
          </CardList>
          <RadioGroup name="use-radio-group" defaultValue="yes">
            <CardList>
              <MyFormControlLabel value="yes" label="" control={<Radio />} />
              <Text fontSize="15px" bold>
                Yes, agree with you.
              </Text>
            </CardList>
            <CardList>
              <MyFormControlLabel value="no" label="" control={<Radio />} />
              <Text fontSize="15px" bold>
                No, I’m not agree with you.
              </Text>
            </CardList>
          </RadioGroup>
          <Button
            variant="success"
            radii="small"
            marginTop="10px"
            size="sm"
            disabled={Number(availableVotes) <= 0}
            onClick={() => {
              onPresentConnectModal()
            }}
          >
            Cast vote
          </Button>
        </div> */}
      </Card>
    </>
  )
}

export default VotingCast
