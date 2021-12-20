/* eslint-disable no-nested-ternary */
import React from 'react'
import { Button, Card, Text, Input, useMatchBreakpoints } from 'uikit-dev'
import uniqueId from 'lodash/uniqueId'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import Radio from '@material-ui/core/Radio'
import RadioGroup, { useRadioGroup } from '@material-ui/core/RadioGroup'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import InputChoice from './InputChoice'
// import development from '../../../uikit-dev/images/for-ui-v2/voting/voting-development.png'

// const InputChoice = styled(Input)`
//   width: 100%;
//   background: unset;
//   border: 1px solid ${({ theme }) => theme.colors.border};
//   border-radius: 30px;
//   margin: 20px 0px;
//   padding: 2px 20px;
//   display: flex;
//   align-items: center;
// `

const FormControlLabelCustom = styled(FormControlLabel)`
  height: 40px;
  margin: 0 0 0 -10px !important;

  .MuiFormControlLabel-label {
    flex-grow: 1;
  }
`

const BpIcon = styled('span')(({ theme }) => ({
  borderRadius: '50%',
  width: 16,
  height: 16,
  boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
  backgroundColor: '#f5f8fa',
  backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
  '.Mui-focusVisible &': {
    outline: '2px auto rgba(19,124,189,.6)',
    outlineOffset: 2,
  },
  'input:hover ~ &': {
    backgroundColor: '#ebf1f5',
  },
  'input:disabled ~ &': {
    boxShadow: 'none',
    background: '#E3E6EC',
  },
}))

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: '#0973B9',
  backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
  '&:before': {
    display: 'block',
    width: 16,
    height: 16,
    backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
    content: '""',
  },
  'input:hover ~ &': {
    backgroundColor: '#106ba3',
  },
})

function BpRadio(props) {
  return (
    <Radio
      sx={{
        '&:hover': {
          bgcolor: 'transparent',
        },
      }}
      disableRipple
      color="default"
      checkedIcon={<BpCheckedIcon />}
      icon={<BpIcon />}
      {...props}
    />
  )
}

export interface Choice {
  id: string
  value: string
}

interface ChoicesProps {
  choices?: Choice[]
  onChange?: (newChoices: Choice[]) => void
  setChoiceType?: any
  isLoading?: boolean
}

export const MINIMUM_CHOICES = 2
export const makeChoice = (): Choice => ({ id: uniqueId(), value: '' })

const AddChoices: React.FC<ChoicesProps> = ({ choices, onChange, setChoiceType, isLoading }) => {
  const { isDark } = useTheme()
  const { isXl, isLg } = useMatchBreakpoints()
  const isMobile = !isXl && !isLg
  const hasMinimumChoices = choices.filter((choice) => choice.value.length > 0).length >= MINIMUM_CHOICES

  const addChoice = () => {
    onChange([...choices, makeChoice()])
  }

  const addType = (event) => {
    setChoiceType(event.target.value)
  }

  return (
    <>
      <Card className="mb-4">
        <div className="flex align-center pa-4 pb-2 bd-b">
          <Text fontSize="20px" bold>
            Choice
          </Text>
          <RadioGroup className="ml-6" row name="use-radio-group" defaultValue="single">
            <div className="flex align-center mr-4">
              <FormControlLabelCustom
                onClick={(event) => addType(event)}
                value="single"
                label=""
                control={<BpRadio />}
              />
              <Text>Single</Text>
            </div>
            <div className="flex align-center">
              <FormControlLabelCustom
                onClick={(event) => addType(event)}
                value="multiple"
                label=""
                control={<BpRadio />}
              />
              <Text>Multiple</Text>
            </div>
          </RadioGroup>
        </div>
        <div className="ma-3">
          {choices.map(({ id, value }, index) => {
            const handleTextInput = (newValue: string) => {
              const newChoices = [...choices]
              const choiceIndex = newChoices.findIndex((newChoice) => newChoice.id === id)

              newChoices[choiceIndex].value = newValue

              onChange(newChoices)
            }

            const handleRemove = () => {
              onChange(choices.filter((newPrevChoice) => newPrevChoice.id !== id))
            }

            return (
              // <InputChoice key={id} className="my-3" placeholder="Input choice text" />
              <InputChoice
                key={id}
                scale="lg"
                onTextInput={handleTextInput}
                placeholder="Input choice text"
                value={value}
                onRemove={index > 1 ? handleRemove : undefined}
                hasMinimumChoices={hasMinimumChoices}
              />
            )
          })}
          <Button
            onClick={addChoice}
            disabled={!hasMinimumChoices || isLoading}
            variant="success"
            radii="small"
            className="mt-2"
            size="sm"
          >
            Add Choice
          </Button>
        </div>
      </Card>
    </>
  )
}

export default AddChoices
