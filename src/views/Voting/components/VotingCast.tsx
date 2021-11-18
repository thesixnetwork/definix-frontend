/* eslint-disable no-nested-ternary */
import React from 'react'
import { ArrowBackIcon, Button, Card, Text, Heading, useMatchBreakpoints } from 'uikit-dev'
import { Link, Redirect } from 'react-router-dom'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
// import development from '../../../uikit-dev/images/for-ui-v2/voting/voting-development.png'

const CardList = styled(Card)`
  width: 100%;
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

const VotingCast = () => {
  const { isDark } = useTheme()
  const { isXl, isLg } = useMatchBreakpoints()
  const isMobile = !isXl && !isLg

  return (
    <>
      <Card className="mb-4">
        <div className="pa-4 pt-3 bd-b">
          <Text fontSize="20px" bold lineHeight="1" marginTop="10px">
            Cast your vote
          </Text>
        </div>
        <div className="ma-3">
          <CardList>
            <div className="flex align-center">
              <FormControlLabelCustom
                control={
                  <CustomCheckbox
                    size="small"
                    // checked={!!_.get(selectedToken, `${18}.checked`)}
                    // onChange={(event) => {
                    //   setSelectedToken({
                    //     ...selectedToken,
                    //     18: {
                    //       checked: event.target.checked,
                    //       pools: false,
                    //       farms: false,
                    //       status: false,
                    //       pendingReward: finixEarn,
                    //     },
                    //   })
                    // }}
                  />
                }
                label="Yes, agree with you."
              />
            </div>
          </CardList>
          <CardList>
            <div className="flex align-center">
              <FormControlLabelCustom
                control={
                  <CustomCheckbox
                    size="small"
                    // checked={!!_.get(selectedToken, `${18}.checked`)}
                    // onChange={(event) => {
                    //   setSelectedToken({
                    //     ...selectedToken,
                    //     18: {
                    //       checked: event.target.checked,
                    //       pools: false,
                    //       farms: false,
                    //       status: false,
                    //       pendingReward: finixEarn,
                    //     },
                    //   })
                    // }}
                  />
                }
                label="No, I’m not agree with you."
              />
            </div>
          </CardList>
          <Button variant="success" radii="small">
            Cast vote
          </Button>
        </div>
      </Card>
    </>
  )
}

export default VotingCast
