/* eslint-disable no-nested-ternary */
import React from 'react'
import { ArrowBackIcon, Button, Card, Text, Heading, useMatchBreakpoints, useModal } from 'uikit-dev'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import Radio from '@material-ui/core/Radio'
import RadioGroup, { useRadioGroup } from '@material-ui/core/RadioGroup'
import CastVoteModal from '../Modals/CastVoteModal'
// import development from '../../../uikit-dev/images/for-ui-v2/voting/voting-development.png'

const CardList = styled(Card)`
  width: 100%;
  height: 40px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 30px;
  margin: 6px 0px;
  padding: 0px 20px;
  display: flex;
  align-items: center;

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

function MyFormControlLabel(props) {
  const radioGroup = useRadioGroup()

  let checked = false

  if (radioGroup) {
    checked = radioGroup.value === props.value
  }

  return <CustomRadio checked={checked} {...props} icon={<BpIcons />} />
}

const VotingCast = () => {
  const { isDark } = useTheme()
  const { isXl, isLg } = useMatchBreakpoints()
  const isMobile = !isXl && !isLg
  const [onPresentConnectModal] = useModal(<CastVoteModal />)

  return (
    <>
      <Card className="mb-4">
        <div className="pa-4 pt-3 bd-b">
          <Text fontSize="20px" bold lineHeight="1" marginTop="10px">
            Cast your vote
          </Text>
          <Text fontSize="20px" bold lineHeight="1" marginTop="10px">Your vote</Text>
        </div>
        <div className="ma-3">
          {/* ถ้า vote เสร็จแล้ว */}
          {/* <Text fontSize="16px" bold lineHeight="1" marginTop="10px">
            Yes, agree with you.
          </Text>
          <div className="flex align-center mt-3">
            <Button
              variant="success"
              radii="small"
              size="sm"
              disabled
            >
              Claim Voting Power
            </Button>
            <Text fontSize="14px" color="text" paddingLeft="14px">Claim will be available after the the voting time is ended.</Text>
          </div> */}
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
            onClick={() => {
              onPresentConnectModal()
            }}
          >
            Cast vote
          </Button>
        </div>
      </Card>
    </>
  )
}

export default VotingCast
