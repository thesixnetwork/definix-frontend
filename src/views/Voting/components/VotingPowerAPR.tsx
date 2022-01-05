/* eslint-disable no-nested-ternary */
import React from 'react'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import styled from 'styled-components'
import { Card, Text, useMatchBreakpoints, Skeleton } from 'uikit-dev'
import { AlertCircle } from 'react-feather'

const Balance = styled.div`
  display: flex;
  width: 100%;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-end;
  padding: 0.75rem 0.75rem 0.75rem 0.75rem;
  background-color: ${'#E4E4E425'};
  margin-top: 0.5rem !important;
  border: ${({ theme }) => !theme.isDark && '1px solid #ECECEC'};
  box-shadow: unset;
  border-radius: ${({ theme }) => theme.radii.default};

  a {
    display: block;
  }
`

const NumberInput = styled.input`
  border: none;
  background-color: #ffffff00;
  font-size: 22px;
  outline: none;
  color: ${({ theme }) => (theme.isDark ? '#fff' : '#000')};
  -webkit-flex: 1 1 auto;
  padding: 0px;
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;
`

const CardAlert = styled.div`
  border: 1px solid #f5c858;
  border-radius: 8px;
  padding: 6px 14px;
  margin: 20px 0px;
  display: flex;
  align-items: center;
`

const VotingPowerAPR = () => {
  const { account } = useWallet()
  const { isXl, isLg } = useMatchBreakpoints()
  const isMobile = !isXl && !isLg

  return (
    <>
      <Card className="mb-4">
        <div className="pa-4 pt-3">
          <Text fontSize="20px" bold lineHeight="1" marginTop="10px">
            Use your Voting Power to vote APR allocation
          </Text>
          <div className="flex mt-4">
            <Text className="col-6" color="textSubtle">
              Vote
          </Text>
          </div>
          <Balance>
            <NumberInput
              // id={_.get(v, 'id')}
              style={{ width: isMobile ? '20%' : '45%' }}
              placeholder="0.00"
              // value={_.get(v, 'vote')}
              // onChange={(e) => handleChange(e, index, v)}
              pattern="[0-9.]*"
              type="number"
            />
          </Balance>
          <CardAlert>
            <AlertCircle size={30} color="#F5C858" />
            <Text color="text" paddingLeft="10px">
              Do you want to vote? Your Voting Power (vFINIX) will be locked until the the voting time is ended.
            </Text>
          </CardAlert>
          <div className={isMobile ? "": 'flex'}>
            <Text color="textSubtle" paddingRight="10px">
              Voting Round Period
            </Text>
            <Text color="text" bold>
              12-Jan-22 15:00:00 GMT+9 - 25-Feb-22 15:00:00 GMT+9
            </Text>
          </div>
        </div>
      </Card>
    </>
  )
}

export default VotingPowerAPR
