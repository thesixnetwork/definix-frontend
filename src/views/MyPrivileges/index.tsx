import {
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Heading,
  Text,
  useMatchBreakpoints,
  VDivider,
} from '@fingerlabs/definixswap-uikit-v2'
import BigNumber from 'bignumber.js'
import { Backdrop } from '@material-ui/core'
import { useState, useEffect } from 'react'
import styled from 'styled-components'
import useWallet from 'hooks/useWallet'
import MyPrivilegesABI from 'config/abi/myPrivileges.json'
import { getMyPrivilegeAddress } from 'utils/addressHelpers'
import { getContract } from 'utils/caver'
import mpActive from '../../assets/images/mp-claim.png'
import mpInactive from '../../assets/images/mp-disable.png'
import mpSuccess from '../../assets/images/mp-success.png'

const MyPrivilegesCardStyle = styled(Card)`
  * {
    // font: ...
    color: #5e515f;
  }
`

const ClaimListStyle = styled(Flex)`
  position: relative;

  &:before,
  &:after {
    content: '';
    position: absolute;
  }
  &:before {
    top: 164px;
    left: 50%;
    width: calc(100% - 300px);
    border-top: 2px dashed #dedadb;
    transform: translateX(-50%);
    display: block;
  }
  &:after {
    top: 50%;
    left: calc(50% - 25px);
    height: calc(100% - 400px);
    border-right: 2px dashed #dedadb;
    transform: translateY(-50%);
    display: none;
  }

  ${({ theme }) => theme.mediaQueries.mobile} {
    &:before {
      display: none;
    }
    &:after {
      display: block;
    }
  }
`

const ClaimBoxStyle = styled(Flex)`
  z-index: 1;

  > img {
    height: 140px;
  }

  button {
    width: 140px;
    height: 36px;
    border-radius: 36px;
    font-size: 1rem;
    font-weight: normal;
    color: white;
    max-width: 100%;
  }

  .content {
    position: relative;
    padding: 12px 16px 40px 16px;
    transform: translateX(50%);
    margin-top: 16px;
    margin-bottom: 24px;

    &:before,
    &:after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
    }
    &:before {
      width: 1px;
      height: 100%;
      background: #ff6828;
    }
    &:after {
      left: -1px;
      width: 3px;
      height: 48px;
      background: #5e515f;
      border-radius: 3px;
    }
  }

  .succeeded {
    background: #ff6828;
    color: white;
    padding: 4px 16px;
    font-size: 0.75rem;
    font-weight: normal;
    line-height: 16px;
    position: absolute;
    bottom: 0;
    left: 0;
  }
`

const ClaimBox = ({
  ordinal = '',
  amount = '',
  date = '',
  isSucceeded = false,
  isInactive = false,
  onClaim = () => null,
}) => {
  const { isMobile } = useMatchBreakpoints()

  return (
    <ClaimBoxStyle
      flexGrow={1}
      flexDirection="column"
      alignItems="center"
      style={{ width: isMobile ? '100%' : '25%' }}
      px="16px"
      mb={isMobile && '24px'}
      ml={isMobile && '-24px'}
    >
      <img
        src={isInactive ? mpInactive : mpActive}
        style={{ marginLeft: isInactive ? '12px' : '-24px', marginBottom: '24px' }}
      />

      <Box background="white">
        <Text
          style={{ color: '#FF6828', fontWeight: 'bold', fontSize: '1.375rem', marginBottom: '8px' }}
          textAlign="center"
        >
          {amount}
        </Text>
        <Text textAlign="center" style={{ opacity: 0.5 }}>
          FINIX
        </Text>
      </Box>

      <Box className="content">
        <Text style={{ fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '4px' }}>{ordinal} Claim</Text>
        <Text style={{ color: '#FF6828', fontSize: '0.875rem' }}>{date}</Text>

        {isSucceeded && (
          <Text textAlign="center" className="succeeded">
            Succeeded!
          </Text>
        )}
      </Box>

      {!isSucceeded && (
        <Button disabled={isInactive} size="" onClick={onClaim}>
          Claim
        </Button>
      )}
    </ClaimBoxStyle>
  )
}

const InLineText = ({ title, value, ...props }) => {
  const { isMobile } = useMatchBreakpoints()

  return (
    <Flex {...props} alignItems="baseline" flexWrap="wrap">
      <Text style={{ flexGrow: 1, width: isMobile ? '100%' : 'initial', marginBottom: isMobile ? '8px' : '' }}>
        {title}
      </Text>
      <Text style={{ color: '#FF6828', fontWeight: 'bold', fontSize: '1.375rem' }}>{value}</Text>
      <Text style={{ paddingLeft: '1rem' }} width="15%" textAlign="right">
        FINIX
      </Text>
    </Flex>
  )
}

const SuccessModal = ({ open, onClose }) => {
  return (
    <Backdrop style={{ padding: '24px', zIndex: '999' }} open={open} onClick={onClose}>
      <img src={mpSuccess} style={{ width: '400px', maxWidth: '100%' }} />
    </Backdrop>
  )
}

const MyPrivileges = () => {
  const { isMobile } = useMatchBreakpoints()
  const [isShowSuccessModal, setIsShowSuccessModal] = useState(false)
  const [data, setData] = useState({})
  const { account } = useWallet()

  useEffect(() => {
    // if (account) {
    const run = async () => {
      const myPrivilegeContract = getContract(MyPrivilegesABI, getMyPrivilegeAddress())
      const response = await myPrivilegeContract.methods.getRoyalty('0x7ebc89d82e1e06b8c90f86531fe220fb32dd992a').call()
      const fixedReward = new BigNumber(response.fixedReward).div(new BigNumber(10).pow(18)).toNumber()
      const variableReward = new BigNumber(response.variableReward).div(new BigNumber(10).pow(18)).toNumber()
      const roundRewards = (response.roundReward || []).map(v =>
        new BigNumber(v).div(new BigNumber(10).pow(18)).toNumber(),
      )
      const totalRound = (response.roundReward || []).length
      const roundStatus = await Promise.all(
        (response.roundReward || []).map((v, i) => myPrivilegeContract.methods.roundStatus(i).call()),
      )
      setData({
        fixedReward,
        variableReward,
        roundRewards,
        roundStatus,
      })
      // const claimRoyalty = await Promise.all((response.roundReward || []).map((v,i) => myPrivilegeContract.methods.claimRoyalty(i).call()))
    }
    run()

    // }
    console.log('account effect', account)
  }, [account])

  const onClaim = () => {
    setIsShowSuccessModal(true)
  }

  return (
    <>
      <Box maxWidth="100%" mx="auto" mb={`${isMobile ? '40px' : '80px'}`}>
        <MyPrivilegesCardStyle px="24px" py={isMobile ? '40px' : '64px'}>
          <Heading
            as="h2"
            fontSize="1.75rem !important"
            fontWeight="normal"
            px={isMobile ? '' : '24px'}
            mb={isMobile ? '' : '24px'}
          >
            My privileges
          </Heading>

          <Flex
            justifyContent="center"
            alignItems={isMobile ? 'initial' : 'center'}
            py="24px"
            style={{
              borderTop: isMobile ? undefined : '1px solid #B4A9A8',
              borderBottom: isMobile ? undefined : '1px solid #B4A9A8',
            }}
            flexDirection={isMobile ? 'column' : 'row'}
          >
            <Flex flexGrow={1} flexDirection="column" px={isMobile ? '' : '24px'}>
              <InLineText title="Fixed Reward" value="00,000" mb={isMobile ? '24px' : '12px'} />
              <InLineText title="Variable Reward" value="00,000" />
            </Flex>

            {isMobile ? (
              <Divider my="24px" width="100%" style={{ backgroundColor: '#B4A9A8' }} />
            ) : (
              <VDivider mx="24px" style={{ borderColor: '#B4A9A8' }} />
            )}

            <Flex flexGrow={1} flexDirection="column" px={isMobile ? '' : '24px'}>
              <InLineText title="Total claimed" value="00,000" mb={isMobile ? '24px' : '12px'} />
              <InLineText title="Reward remaining" value="00,000" />
            </Flex>
          </Flex>

          <ClaimListStyle flexDirection={isMobile ? 'column' : 'row'} pt={isMobile ? '24px' : '40px'}>
            <ClaimBox ordinal="1st" amount="1,000" date="mm/ dd/ yy" isSucceeded onClaim={onClaim} />
            <ClaimBox ordinal="2nd" amount="1,000" date="mm/ dd/ yy" onClaim={onClaim} />
            <ClaimBox ordinal="3st" amount="1,000" date="mm/ dd/ yy" isInactive onClaim={onClaim} />
            <ClaimBox ordinal="4th" amount="1,000" date="mm/ dd/ yy" isInactive onClaim={onClaim} />
          </ClaimListStyle>
        </MyPrivilegesCardStyle>
      </Box>

      <SuccessModal
        open={isShowSuccessModal}
        onClose={() => {
          setIsShowSuccessModal(false)
        }}
      />
    </>
  )
}

export default MyPrivileges
