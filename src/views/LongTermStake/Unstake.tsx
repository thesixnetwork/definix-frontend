/* eslint-disable no-nested-ternary */
import Checkbox from '@material-ui/core/Checkbox'
import _ from 'lodash'
import numeral from 'numeral'
import React, { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { LeftPanel, TwoPanelLayout } from 'uikit-dev/components/TwoPanelLayout'
import { ArrowBackIcon, Button, Card, Link as UiLink, Text, useMatchBreakpoints, Heading } from 'uikit-dev'
import { Link, useHistory } from 'react-router-dom'
import { Redirect } from 'react-router'
import styled from 'styled-components'
import { useUnstakeId, useUnLock, useTotalSupply, useApr } from 'hooks/useLongTermStake'
import { useSelector } from 'react-redux'
import warning from '../../uikit-dev/images/for-ui-v2/warning.png'

const MaxWidth = styled.div`
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
`

const Coin = styled.div`
  //   display: flex;
  justify-content: flex-end;
  align-items: center;

  img {
    width: auto;
    height: 56px;
    margin: 0px 12px 0px 6px;
  }
`

const Finix = styled.div`
  justify-content: flex-end;
  align-items: center;

  img {
    width: auto;
    height: 32px;
    margin: 0px 12px 0px 6px;
  }
`

const LeftPanelAbsolute = styled(LeftPanel)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  padding-bottom: 24px;
`

const Balance = styled(Card)`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0.75rem 0.75rem 0.75rem;
  background-color: ${'#E4E4E425'};
  background-size: cover;
  background-repeat: no-repeat;
  margin-top: 0.5rem !important;
  right: 0;
  position: relative;
  box-shadow: unset;

  a {
    display: block;
  }
`

const Period = styled(Card)`
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0.75rem 0.25rem 0.75rem;
  background-color: ${'#30ADFF1f'};
  opacity: 1;
  background-size: cover;
  background-repeat: no-repeat;
  margin-top: 0.5rem !important;
  margin-bottom: 0.5rem !important;
  right: 0;
  color: #1587c9;
  position: relative;
  box-shadow: unset;
  border-radius: 4px;

  a {
    display: block;
  }
`

const Apr = styled(Card)`
  padding: 0.25rem;
  background: linear-gradient(90deg, #0973b9, #5cc096);
  opacity: 1;
  background-size: cover;
  background-repeat: no-repeat;
  margin-top: 0.75rem !important;
  margin-bottom: 0.75rem !important;
  margin-left: 0.5rem !important;
  right: 0;
  color: #30adff;
  position: relative;
  box-shadow: unset;
  border-radius: 4px;

  a {
    display: block;
  }
`

const Warning = styled(Card)`
  padding: 0.75rem 1.25rem 0.75rem 1.25rem;
  background: tranparent;
  opacity: 1;
  background-size: cover;
  background-repeat: no-repeat;
  margin-top: 0.75rem !important;
  right: 0;
  color: #30adff;
  position: relative;
  box-shadow: unset;
  border-radius: 8px;
  border: 1px solid #f5c858;

  a {
    display: block;
  }

  img {
    width: 24px;
    height: 24px;
    margin: 0px 12px 0px 6px;
  }
`

const NumberInput = styled(Text)`
  color: ${({ theme }) => (theme.isDark ? '#fff' : '#000000')};
`

const Input = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const Unstake: React.FC = () => {
  const [tx, setTx] = useState({})
  const { isXl } = useMatchBreakpoints()
  const { id, level, amount, canBeUnlock, penaltyRate, periodPenalty } = useUnstakeId()
  const isMobileOrTablet = !isXl
  const { unnLock } = useUnLock()
  const totalSupply = useTotalSupply()
  const rewardperblock = useApr()
  const apr = ((rewardperblock * 86400 * 365) / Number(totalSupply)) * 100
  const navigate = useHistory()

  const handleUnLock = useCallback(
    async (Id) => {
      try {
        const res = unnLock(id)
        res
          .then((r) => {
            console.log('d')
            navigate.push('/long-term-stake')
            return <Redirect to="/long-term-stake" />
          })
          .catch((e) => {
            console.log(e)
          })
      } catch (e) {
        console.error(e)
      }
    },
    [unnLock, id, navigate],
  )

  return (
    <>
      <Helmet>
        <title>Explore - Definix - Advance Your Crypto Assets</title>
      </Helmet>
      <TwoPanelLayout>
        <LeftPanelAbsolute isShowRightPanel={false}>
          <MaxWidth>
            <div className={`align-stretch mt-5 ${isMobileOrTablet ? 'flex-wrap' : ''}`}>
              <Card className="mb-4">
                <div className={`${isMobileOrTablet ? 'pa-4 pt-2' : 'px-6 py-6'} `}>
                  <div className="flex justify-space-between mb-2">
                    <Button
                      variant="text"
                      as={Link}
                      to="/long-term-stake"
                      ml="-12px"
                      padding="0 12px"
                      size="sm"
                      startIcon={<ArrowBackIcon color="textSubtle" />}
                    >
                      <Text fontSize="14px" color="textSubtle">
                        Back
                      </Text>
                    </Button>
                  </div>
                  <div className="text-center">
                    <Coin className="mb-6">
                      <img src={`/images/coins/${'FINIX'}.png`} alt="" />
                    </Coin>
                    <Heading as="h1" fontSize="24px !important">
                      Long-term Stake
                    </Heading>
                    <div className="flex justify-center mb-6">
                      <Period>
                        {level === '0' && (
                          <Text color="#30adff" bold fontSize="16px !important">
                            1X 90 days
                          </Text>
                        )}
                        {level === '1' && (
                          <Text color="#30adff" bold fontSize="16px !important">
                            2X 180 days
                          </Text>
                        )}
                        {level === '2' && (
                          <Text color="#30adff" bold fontSize="16px !important">
                            4X 365 days
                          </Text>
                        )}
                      </Period>
                      <Apr>
                        <Text color="white" bold fontSize="10px !important">
                          APR {`${numeral(apr || 0).format('0,0.[00]')}%`}
                        </Text>
                      </Apr>
                    </div>
                  </div>
                  <div className="mb-7">
                    <Text color="textSubtle" lineHeight="0.5">
                      Unstake
                    </Text>
                    <Balance className="flex align-center">
                      <NumberInput fontSize="18px !important">{amount.toLocaleString()}</NumberInput>
                      <Input>
                        <Finix>
                          <img src={`/images/coins/${'FINIX'}.png`} alt="" />
                        </Finix>
                        <Heading as="h1" fontSize="18px !important">
                          FINIX
                        </Heading>
                      </Input>
                    </Balance>
                  </div>
                  {canBeUnlock && (
                    <>
                      <Warning className="flex mb-6">
                        <img src={warning} alt="" />
                        <Text className="ml-2" bold fontSize="14px !important" lineHeight="1" fontWeight="initial">
                          Do you want to unstake? You will be locked for {periodPenalty} to receive staked amount.
                        </Text>
                      </Warning>
                      <div className="flex mt-4">
                        <Text className="col-6">Early unstake fee</Text>
                        <Text className="col-6 text-right" color="#30ADFF">
                          {penaltyRate}%
                        </Text>
                      </div>
                      <div className="flex mt-4 mb-6">
                        <Text className="col-8">You will received (after {periodPenalty})</Text>
                        <Text className="col-4 text-right" color="#30ADFF">
                          {penaltyRate * 100} FINIX
                        </Text>
                      </div>
                    </>
                  )}
                  <Button fullWidth className="align-self-center" radii="small" onClick={handleUnLock}>
                    Unstake FINIX
                  </Button>
                </div>
              </Card>
            </div>
          </MaxWidth>
        </LeftPanelAbsolute>
      </TwoPanelLayout>
    </>
  )
}

export default Unstake
