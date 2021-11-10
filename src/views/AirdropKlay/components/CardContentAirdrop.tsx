/* eslint eqeqeq: 0 */

import React, { ReactElement, useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { Button, Card, Heading, Text, Link, Input, Modal } from 'uikit-dev'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { provider } from 'web3-core'
import { getAirdropKlayAddress } from 'utils/addressHelpers'
import UnlockButton from 'components/UnlockButton'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import abiAirdrop from 'config/abi/airdropKlay.json'
import klaytnLogo from 'uikit-dev/images/Logo-Klaytn.png'
import CountDown from './Countdown'
import DiscriptionFirstAirdrop from './DiscriptionFirstAirdrop'
import DiscriptionSecondAirdrop from './DiscriptionSecondAirdrop'

const MaxWidth = styled.div`
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column-reverse;
`

const StyledBanner = styled(Card)`
  padding: 24px;
  width: 100%;
  // background:
  background-size: 150%;
  background-repeat: no-repeat;
  background-position: center 40%;
  background-color: ${({ theme }) => theme.colors.card};
  h2 {
    font-size: 24px;
  }
  h3 {
    font-size: 12px !important;
    margin-bottom: 4px;
  }
  img {
    width: 120px;
  }
  a {
    margin-top: 1rem;
  }
  > div > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    &:nth-of-type(01) {
      flex-grow: 1;
    }
    &:nth-of-type(02) {
      flex-shrink: 0;
      margin-bottom: 0.5rem;
    }
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    h2 {
      font-size: 40px !important;
    }
    h3 {
      font-size: 20px !important;
    }
    a {
      min-width: 200px;
    }
    img {
      width: 180px;
    }
  }
  ${({ theme }) => theme.mediaQueries.md} {
    > div {
      flex-direction: row;
      align-items: center;
      > div {
        &:nth-of-type(01) {
          padding: 24px 24px 24px 0;
          align-items: flex-start;
          text-align: left;
        }
        &:nth-of-type(02) {
          margin: 0;
        }
      }
    }
  }
`

interface Props {
  setTitleModal: (text: string) => void
  setBodyModal: (text: string) => void
  toggleModal: () => void
  setModalSuccess: (status: boolean) => void
}

export default function CardContentAirdrop({
  setBodyModal,
  setTitleModal,
  toggleModal,
  setModalSuccess,
}: Props): ReactElement {
  const countDownEnd = new Date(2021, 5, 21, 9, 59, 59)
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const airdropKlayAddress = getAirdropKlayAddress()
  const web3 = new Web3(ethereum)
  const contractAirdropKlay = new web3.eth.Contract(abiAirdrop as unknown as AbiItem, airdropKlayAddress)
  const [state, setState] = useState<string>('null')
  const [clickClaim, setClickClaim] = useState<boolean>(false)
  const [accountClaim, setAccountClaim] = useState<string>('')
  const NOT_CLAIM = 'not_claim'
  const COUNTDOWN = 'countdown'
  const CLAIM = 'claim'
  const CLAIMED = 'claimed'
  const [loading, setLoading] = useState<boolean>(false)

  const [openFirstAirdrop, setOpenFirstAirdrop] = useState(true)
  const [openSecondAirdrop, setOpenSecondAirdrop] = useState(false)
  useEffect(() => {
    if (!account) {
      setState('hidden')
    }
  }, [account])
  useEffect(() => {
    if (state == CLAIMED) {
      setOpenFirstAirdrop(false)
      setOpenSecondAirdrop(true)
    } else if (state == CLAIM) {
      setOpenFirstAirdrop(true)
      setOpenSecondAirdrop(false)
    } else {
      setOpenFirstAirdrop(true)
      setOpenSecondAirdrop(false)
    }
  }, [state])
  const onChangeHandle = (e) => {
    setAccountClaim(e.target.value)
  }
  const toggleAirdropSecond = () => {
    setOpenSecondAirdrop(!openSecondAirdrop)
  }
  const toggleAirdropFirst = () => {
    setOpenFirstAirdrop(!openFirstAirdrop)
  }
  const onSubbmit = async () => {
    if (accountClaim !== undefined && accountClaim !== '') {
      setLoading(true)

      try {
        contractAirdropKlay.methods
          .claimAll(accountClaim)
          .send({ from: account, gas: 600000 })
          .on('receipt', (receipt) => {
            setState(CLAIMED)
            setLoading(false)
            setTitleModal('Your request has been submitted')
            setBodyModal('The airdrop will be transfer to the given address within 10 minutes.')
            toggleModal()
            setModalSuccess(true)

            // return tx.transactionHash
          })
          .on('error', (e) => {
            setTitleModal('Transaction fail')
            console.log(e)
            setBodyModal(getErrorMsg(e.code))
            setLoading(false)
            setModalSuccess(false)
            toggleModal()

            // alert('Transaction is fail')
          })
      } catch (e) {
        setTitleModal('Warning')
        setBodyModal('Address is wrong')
        setLoading(false)
        setModalSuccess(false)
        toggleModal()
        setLoading(false)
      }
    }
  }
  const getErrorMsg = (errorCode) => {
    let errorMsg = ''
    switch (errorCode) {
      case -32603:
        errorMsg = 'gas too low'
        break
      default:
        errorMsg = 'transaction error'
    }
    return errorMsg
  }
  const renderClaimDiv = () => {
    return (
      <div style={{ textAlign: 'center', marginRight: 'auto', marginLeft: 'auto', width: '100%' }}>
        <Text color="primary" style={{ textAlign: 'center', marginBottom: '10px', fontSize: '30px' }}>
          Congratulations!
        </Text>

        <Text style={{ textAlign: 'center', marginBottom: '20px', fontSize: '30px' }}>
          You will receive 11 KLAY
          <img
            style={{ width: '15px', marginLeft: '10px', marginRight: '5px' }}
            src={klaytnLogo}
            alt=""
            className="logo"
          />{' '}
        </Text>

        <div style={{ marginRight: '10px', width: '100%' }}>
          <Input
            style={{
              backgroundColor: '#F8F8F8',
              width: '70%',
              textAlign: 'center',
              height: '45px',
              float: 'left',
              color: 'black',
            }}
            onChange={onChangeHandle}
            value={accountClaim}
            placeholder="Please fill your Address"
          />
          <Button
            style={{ borderRadius: '7px', width: '20%' }}
            onClick={onSubbmit}
            variant="primary"
            className="customClaimBtn btn-secondary-disable"
            disabled={loading}
          >
            submit
          </Button>
        </div>
        <Text style={{ textAlign: 'center', marginTop: '10px', marginBottom: '20px', fontSize: '15px', color: 'red' }}>
          Please fill your KIP7 supported wallet address such as Kaikas wallet, D’CENT wallet and Klip
        </Text>
      </div>
    )
  }

  const checkRender = () => {
    Promise.all([
      contractAirdropKlay.methods.dropAddress(account).call(),
      contractAirdropKlay.methods.isClaimAddress(account).call(),
    ]).then((res) => {
      if (res[0] == 0 && res[1] == false) {
        setState(NOT_CLAIM)
      } else {
        const isCountDown = countDownEnd.getTime() - Date.now() > 0
        if (isCountDown) {
          setState(COUNTDOWN)
        } else if (res[0] != 0 && res[1] == false) {
          setState(CLAIM)
        } else if (res[0] == 0 && res[1] == true) {
          setState(CLAIMED)
        }
      }
    })
  }
  const renderNotClaim = () => {
    return (
      <div style={{ margin: 'auto', fontSize: '24px', marginBottom: '20px' }}>
        You wallet address is not in airdrop criteria.
      </div>
    )
  }
  const renderClaimedBtn = () => {
    return (
      <div style={{ marginLeft: 'auto', marginRight: 'auto', width: '70%' }}>
        <Button fullWidth radii="small" disabled>
          Claimed
        </Button>
      </div>
    )
  }
  const renderClaimBtn = () => {
    return (
      <div style={{ margin: 'auto', width: '80%' }}>
        <Button
          fullWidth
          radii="small"
          onClick={() => {
            setClickClaim(true)
          }}
        >
          Claim
        </Button>
      </div>
    )
  }

  return (
    <StyledBanner>
      <MaxWidth>
        <div>
          {!account ? <UnlockButton fullWidth radii="small" /> : checkRender()}
          {state == COUNTDOWN ? <CountDown showCom /> : null}
          {state == NOT_CLAIM ? renderNotClaim() : null}
          {state == CLAIM && clickClaim == false ? renderClaimBtn() : null}
          {state == CLAIM && clickClaim == true ? renderClaimDiv() : null}
          {state == CLAIMED ? renderClaimedBtn() : null}

          <div style={{ marginTop: '40px' }}>
            <DiscriptionFirstAirdrop toggle={toggleAirdropFirst} open={openFirstAirdrop} disable={state != CLAIMED} />
            <br />
            <br />
            {state == CLAIMED ? (
              <DiscriptionSecondAirdrop
                toggle={toggleAirdropSecond}
                open={openSecondAirdrop}
                disable={state != CLAIMED}
              />
            ) : null}
          </div>
        </div>
      </MaxWidth>
    </StyledBanner>
  )
}
