/* eslint-disable no-nested-ternary */
import React from 'react'
import { Button, Card, Text, Input, useMatchBreakpoints } from 'uikit-dev'
import { Link, Redirect } from 'react-router-dom'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import Radio from '@material-ui/core/Radio'
import RadioGroup, { useRadioGroup } from '@material-ui/core/RadioGroup'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
// import development from '../../../uikit-dev/images/for-ui-v2/voting/voting-development.png'

const InputChoice = styled(Input)`
  width: 100%;
  background: unset;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 30px;
  margin: 20px 0px;
  padding: 2px 20px;
  display: flex;
  align-items: center;
`

const FormControlLabelCustom = styled(FormControlLabel)`
  height: 40px;
  margin: 0 0 0 -10px !important;

  .MuiFormControlLabel-label {
    flex-grow: 1;
  }
`

const CustomCheckbox = styled(Checkbox)`
  border: 1px solid red;
  &.Mui-checked {
    color: ${({ theme }) => theme.colors.success} !important;
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

const AddChoices = () => {
  const { isDark } = useTheme()
  const { isXl, isLg } = useMatchBreakpoints()
  const isMobile = !isXl && !isLg

  return (
    <>
      <Card className="mb-4">
        <div className="flex align-center pa-4 pb-2 bd-b">
          <Text fontSize="20px" bold>
            Choice
          </Text>
          <RadioGroup className="ml-6" row name="use-radio-group" defaultValue="yes">
            <div className="flex align-center mr-4">
              <FormControlLabelCustom value="yes" label="" control={<BpRadio />} />
              <Text>Single</Text>
            </div>
            <div className="flex align-center">
              <FormControlLabelCustom value="no" label="" control={<BpRadio />} />
              <Text>Multiple</Text>
            </div>
          </RadioGroup>
        </div>
        <div className="ma-3">
          <InputChoice className="my-3" placeholder="Input choice text" />
          <InputChoice className="my-3" placeholder="Input choice text" />
          <Button variant="success" radii="small" className="mt-2" size="sm">
            Add Choice
          </Button>
        </div>
      </Card>
    </>
  )
}

export default AddChoices
