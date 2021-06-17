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
  background-color: ${({ theme }) => theme.colors.white};

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
const customText = {
  borderRadius: '1px !important',
}

interface Props {
  setTitleModal: (text: string) => void,
  setBodyModal: (text: string) => void,
  toggleModal: () => void
  setModalSuccess: (status: boolean) => void
}

export default function CardContentAirdrop({ setBodyModal, setTitleModal, toggleModal, setModalSuccess }: Props): ReactElement {
  const countDownEnd = new Date(2021, 4, 21, 0, 0, 0)
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

  const onChangeHandle = (e) => {
    setAccountClaim(e.target.value)
  }
  const onSubbmit = async () => {
    if (accountClaim !== undefined && accountClaim !== '') {
      setLoading(true)

      try {
        contractAirdropKlay.methods
          .claimAll(accountClaim)
          .send({ from: account, gas: 200000 })
          .on('receipt', (receipt) => {
            setState(CLAIMED)
            setLoading(false)
            setTitleModal("Congratulations")
            setBodyModal("Your airdrop is successfully claim,\n It’s will transfer to destination wallet soon.")
            toggleModal()
            setModalSuccess(true)

            // return tx.transactionHash
          })
          .on('error', (e) => {
            setTitleModal("Transaction fail")
            console.log(e)
            setBodyModal(getErrorMsg(e.code))
            setLoading(false)
            setModalSuccess(false)
            toggleModal()

            // alert('Transaction is fail')

          })
      } catch (e) {
        setTitleModal("Warning")
        setBodyModal("Address is wrong")
        setLoading(false)
        setModalSuccess(false)
        toggleModal()
        setLoading(false)
      }
    }
  }
  const getErrorMsg = (errorCode) => {
    let errorMsg = ""
    switch (errorCode) {
      case -32603: errorMsg = "gas too low"
        break;
      default:
        errorMsg = "transaction error"

    }
    return errorMsg
  }
  const renderClaimDiv = () => {
    return (
      <div style={{ textAlign: 'center', marginRight: 'auto', marginLeft: 'auto' }}>
        <Text color="primary" style={{ textAlign: 'center', marginBottom: '10px', fontSize: '30px' }}>
          Congratulations!
        </Text>

        <Text style={{ textAlign: 'center', marginBottom: '20px', fontSize: '30px' }}>
          You will receive{' '}
          
          11 KLAY
          <img
            style={{ width: '15px', marginLeft: '10px', marginRight: '5px' }}
            src={klaytnLogo}
            alt=""
            className="logo"
          />{' '}
        </Text>

        <div style={{ float: 'left', marginRight: '10px' }}>
          <Input
            style={{ backgroundColor: '#F8F8F8', width: '500px', textAlign: 'center', height: '45px' }}
            onChange={onChangeHandle}
            value={accountClaim}
            placeholder="Please fill your Address"
          />
        </div>
        <Button
          style={{ borderRadius: '7px' }}
          onClick={onSubbmit}
          variant="primary"
          className="customClaimBtn btn-secondary-disable"
          disabled={loading}
        >
          submit
        </Button>
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
      <div style={{ margin: 'auto' }}>
        <Button style={{ borderRadius: '7px', width: '400px' }} disabled>
          Claimed
        </Button>
      </div>
    )
  }
  const renderClaimBtn = () => {
    return (
      <div style={{ margin: 'auto' }}>
        <Button
          onClick={() => {
            setClickClaim(true)
          }}
          style={{ borderRadius: '7px', width: '450px' }}
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

          <Heading style={{ marginTop: '40px' }} as="h3">
            Criteria for airdrop claim
          </Heading>
          <hr style={{ width: '100%', marginTop: '20px', marginBottom: '20px', opacity: '0.3' }} />
          <Text lineHeight="2">
            1. The users who start using bsc.definix.com from 1st April 2021, 3:00:00PM - 12th June 2021, 6:59:59PM (GMT+7) are
            screenshot on the block count.
          </Text>
          <Text lineHeight="2">
            2. Users can start claiming their airdrop on 21st June 2021 10:00:00 AM - 20th August 2021 9:59:59 AM (GMT+7)
          </Text>
          <Text lineHeight="2">
            3. The users need to sign-in their wallet; the address of the wallet must be matched with the screenshot
            block mentioned above.
          </Text>
          <Text lineHeight="2">4. Input the destination Klaytn wallet (KIP-7 supported) on the claiming page</Text>
          <div style={{ marginLeft: '20px' }}>
            <Text lineHeight="2">
              4.1. In case you use software wallet such as Metamask, Binance Chain Wallet, Trust Wallet, and etc. as a
              destination, you can import your seed phrase to Kaikas wallet.
              {/* <a style={{ color: '#528FA9' }} href="/" target="#">
                How to import seed phrase to Kaikas wallet.
              </a> */}
            </Text>
            <Text lineHeight="2">
              4.2. In case you use hardware wallet, please create new Kaikas wallet.
              {/* <a style={{ color: '#528FA9' }} href="/" target="#">
                Create Kaikas wallet
              </a> */}
            </Text>
          </div>
          <Text lineHeight="2">
            5. All the airdrop activity is performed and triggered by action of smart contract. In case the user puts in
            the account that the user doesn’t have a private key the airdrop will be lost forever.
          </Text>
          <Text lineHeight="2">
            6. Airdrop will be equally distributed to every user who is under the criteria above.
          </Text>
          <br />
          <br />
        </div>
      </MaxWidth>
    </StyledBanner>
  )
}
