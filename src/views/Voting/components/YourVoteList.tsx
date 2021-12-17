/* eslint-disable no-nested-ternary */
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import isEmpty from 'lodash/isEmpty'
import styled from 'styled-components'
import Radio from '@material-ui/core/Radio'
import RadioGroup, { useRadioGroup } from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Button, Card, Text, useModal, useMatchBreakpoints } from '../../../uikit-dev'
import { useAvailableVotes } from '../../../hooks/useVoting'
import CastVoteModal from '../Modals/CastVoteModal'
// import development from '../../../uikit-dev/images/for-ui-v2/voting/voting-development.png'

const EmptyData = ({ text }) => (
  <TR>
    <TD colSpan={6}>
      <div className="flex align-center justify-center" style={{ height: '400px' }}>
        <Text textAlign="center" color="textSubtle">
          {text}
        </Text>
      </div>
    </TD>
  </TR>
)

const LoadingData = () => (
  <TR>
    <TD colSpan={6}>
      <div className="flex align-center justify-center" style={{ height: '400px' }}>
        <CircularProgress size={16} color="inherit" className="mr-2" />
        <Text>Loading...</Text>
      </div>
    </TD>
  </TR>
)

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
const CardTable = styled(Card)`
  position: relative;
  content: '';
  background-color: ${({ theme }) => theme.mediaQueries.md};
  background-size: cover;
  background-repeat: no-repeat;
  right: 0;
  overflow: auto;

  a {
    display: block;
  }
`

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
`

const TR = styled.tr``

const TD = styled.td<{ align?: string }>`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 16px;
  height: 64px;
  vertical-align: middle;
  text-align: ${({ align }) => align || 'left'};
`

const BtnDetails = styled(Button)`
  padding: 10px 20px;
  border-radius: 8px;
  text-align: center;
  font-size: 12px;
  font-style: italic;
  font-weight: normal;
  background-color: ${({ theme }) => theme.colors.primary};
`

const TransactionTable = ({ rows, empText, isLoading, total }) => {
  const [cols] = useState(['Vote', 'Voting Power', ''])
  // const [currentPage, setCurrentPage] = useState(1)
  // const pages = useMemo(() => Math.ceil(total / 10), [total])
  // const onPageChange = (e, page) => {
  //   setCurrentPage(page)
  // }

  const { isXl, isLg } = useMatchBreakpoints()
  const isMobile = !isXl && !isLg

  return (
    <CardTable>
      <Table>
        <TR>
          {cols.map((c) => (
            <TD key={c}>
              <Text color="textSubtle" fontSize="12px" bold>
                {c}
              </Text>
            </TD>
          ))}
        </TR>

        {isLoading ? (
          <LoadingData />
        ) : isEmpty(rows) ? (
          <>
            {/* {console.log('rows', rows)} */}
            <EmptyData text={empText} />
          </>
        ) : (
          <>
            {rows !== null &&
              rows.map((r) => (
                <TR key={`tsc-${r.block_number}`}>
                  {/* <TD>
                    <Text color="text" bold fontSize={isMobile ? '16px' : '20px'}>
                      {'Proposal Topic Proposal Topic Proposal Topic Proposal'.substring(0, 38)}...
                    </Text>
                    <div className={isMobile ? '' : 'flex align-center'}>
                      <Text color="text" paddingRight="8px">
                        End Date
                      </Text>
                      <Text color="text" bold>
                        12-Nov-21 15:00:00 GMT+9
                      </Text>
                    </div>
                  </TD> */}
                  <TD>
                    <Text color="text" bold>
                      Yes, agree with you.
                    </Text>
                  </TD>
                  <TD>
                    <div className="flex align-center">
                      <Text color="text" bold paddingRight="8px">
                        23,143
                      </Text>
                    </div>
                  </TD>
                  <TD>
                    {/* <BtnDetails as={Link} to="/voting/detail/participate">
                      Deatils
                    </BtnDetails> */}
                    {/* <BtnClaim as={Link} to="/voting/detail">
                        Claim Voting Power
                      </BtnClaim> */}
                  </TD>
                </TR>
              ))}
          </>
        )}
      </Table>
    </CardTable>
  )
}

const YourVoteList = () => {
  // const { isDark } = useTheme()
  // const { isXl, isLg } = useMatchBreakpoints()
  // const isMobile = !isXl && !isLg
  const availableVotes = useAvailableVotes()
  const [onPresentConnectModal] = useModal(<CastVoteModal />)
  const [select, setSelect] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [transactions, setTransactions] = useState([
    {
      id: 1234,
      address: '0x00000',
      choise: 'Yes, agree with you.',
      voting_power: '99,999',
    },
  ])

  return (
    <>
      <Card className="mb-4">
        <div className="pa-4 pt-3 bd-b">
          <Text fontSize="20px" bold lineHeight="1" marginTop="10px">
            Your vote
          </Text>
        </div>
        {/* <div className="ma-3"> */}
          <TransactionTable
            rows={transactions}
            isLoading={isLoading}
            empText={
              'Don`t have any transactions in this votes.'
              // currentTab === 0
              //   ? 'Don`t have any transactions in this votes.'
              //   : 'You haven`t made any transactions in this votes.'
            }
            total
          />
          {/* <Text fontSize="16px" bold lineHeight="1" marginTop="10px">
            Yes, agree with you.
          </Text> */}
          <div className="flex align-center ma-3">
            <Button variant="success" radii="small" size="sm" disabled>
              Claim Voting Power
            </Button>
            <Text fontSize="14px" color="text" paddingLeft="14px">
              Claim will be available after the the voting time is ended.
            </Text>
          </div>
        {/* </div> */}
      </Card>
    </>
  )
}

export default YourVoteList
