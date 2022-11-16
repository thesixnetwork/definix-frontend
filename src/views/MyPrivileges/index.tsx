import {
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Heading,
  Skeleton,
  Text,
  useMatchBreakpoints,
  VDivider,
} from '@fingerlabs/definixswap-uikit-v2'
import { AbiItem } from 'web3-utils'
import BigNumber from 'bignumber.js'
import { Backdrop } from '@material-ui/core'
import React, { useMemo, useState, useEffect } from 'react'
import UnlockButton from 'components/UnlockButton'
import styled from 'styled-components'
import useWallet from 'hooks/useWallet'
import MyPrivilegesABI from 'config/abi/myPrivileges.json'
import { getMyPrivilegeAddress } from 'utils/addressHelpers'
import useKlipContract from 'hooks/useKlipContract'
import useContract from 'hooks/useContract'
import { getContract } from 'utils/caver'
import { getEstimateGas } from 'utils/callHelpers'
import { useTranslation } from 'react-i18next'
import mpActive from '../../assets/images/mp-claim.png'
import mpInactive from '../../assets/images/mp-disable.png'
import mpSuccess from '../../assets/images/mp-success.png'

function numberWithCommas(x) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
}

const MyPrivilegesCardStyle = styled(Card)`
  *:not(button) {
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

// const Overlay = styled(Flex)`
//   position: absolute;
//   top: 0px;
//   left: 0px;
//   width: 100%;
//   height: 100%;
//   background-color: rgb(180 169 168 / 50%);
//   pointer-events: initial;
//   z-index: 1;
// `

const ClaimBox = ({
  ordinal = '',
  amount = '',
  date = '',
  isSucceeded = false,
  isInactive = false,
  isLoading,
  onClaim = () => null,
}) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const { account } = useWallet()

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
        src={isInactive || isLoading ? mpInactive : mpActive}
        style={{ marginLeft: isInactive || isLoading ? '12px' : '-24px', marginBottom: '24px' }}
      />

      <Box background="white">
        {isLoading ? (
          <Skeleton width="100px" height="24px" animation="waves" marginBottom="8px" />
        ) : (
          <Text
            style={{ color: '#FF6828', fontWeight: 'bold', fontSize: '1.375rem', marginBottom: '8px' }}
            textAlign="center"
          >
            {numberWithCommas(amount)}
          </Text>
        )}

        <Text textAlign="center" style={{ opacity: 0.5 }}>
          FINIX
        </Text>
      </Box>

      <Box className="content">
        <Text style={{ fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '4px' }}>{t(`${ordinal} Claim`)}</Text>
        {isLoading ? (
          <Skeleton width="80px" height="14px" minHeight="initial" animation="waves" />
        ) : (
          <Text style={{ color: '#FF6828', fontSize: '0.875rem' }}>{date}</Text>
        )}

        {isSucceeded && (
          <Text textAlign="center" className="succeeded">
            {t('Succeeded')}
          </Text>
        )}
      </Box>

      {account && !isSucceeded && (
        <Button disabled={isInactive || isLoading} size="" onClick={onClaim}>
          {t('Claim')}
        </Button>
      )}
    </ClaimBoxStyle>
  )
}

const InLineText = ({ title, value, isLoading, ...props }) => {
  const { isMobile } = useMatchBreakpoints()

  return (
    <Flex {...props} alignItems="baseline" flexWrap="wrap">
      <Text style={{ flexGrow: 1, width: isMobile ? '100%' : 'initial', marginBottom: isMobile ? '8px' : '' }}>
        {title}
      </Text>
      {isLoading ? (
        <Skeleton width="100px" height="100%" animation="waves" />
      ) : (
        <Text style={{ color: '#FF6828', fontWeight: 'bold', fontSize: '1.375rem' }}>{numberWithCommas(value)}</Text>
      )}
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

const isSuccess = (reward, fix, variable) => {
  return new BigNumber(reward).isEqualTo(0) && new BigNumber(fix).plus(new BigNumber(variable)).isGreaterThan(0)
}

const MyPrivileges = () => {
  const { isMobile } = useMatchBreakpoints()
  const [isShowSuccessModal, setIsShowSuccessModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState({
    fixedReward: '-',
    variableReward: '-',
    roundRewards: ['-', '-', '-', '-'],
    roundRewardData: ['-', '-', '-', '-'],
    roundStatus: [false, false, false, false],
    roundOpen: [false, false, false, false],
  })
  const { t } = useTranslation()
  const { account } = useWallet()
  const { isKlip, request } = useKlipContract()

  useEffect(() => {
    if (account) {
      const run = async () => {
        setIsLoading(true)
        const myPrivilegeContract = getContract(MyPrivilegesABI, getMyPrivilegeAddress())
        const response = await myPrivilegeContract.methods.getRoyalty(account).call()
        const fixedReward = new BigNumber(response.fixedReward).div(new BigNumber(10).pow(18)).toString()
        const variableReward = new BigNumber(response.variableReward).div(new BigNumber(10).pow(18)).toString()
        const roundRewards = (response.roundReward || []).map(v =>
          new BigNumber(v).div(new BigNumber(10).pow(18)).toString(),
        )
        const roundRewardData = (response.roundRewardData || []).map(v =>
          new BigNumber(v).div(new BigNumber(10).pow(18)).toString(),
        )
        const roundStatus = await Promise.all(
          (response.roundReward || []).map((v, i) => myPrivilegeContract.methods.roundStatus(i).call()),
        )
        const roundOpen = await Promise.all(
          (response.roundReward || []).map((v, i) => myPrivilegeContract.methods.isRoundOpen(i).call()),
        )
        setIsLoading(false)
        setData({
          fixedReward,
          variableReward,
          roundRewards,
          roundRewardData,
          roundStatus,
          roundOpen,
        })
        // const claimRoyalty = await Promise.all((response.roundReward || []).map((v,i) => myPrivilegeContract.methods.claimRoyalty(i).call()))
      }
      run()
    }
  }, [account])

  const myPrivilegeHookContract = useContract(MyPrivilegesABI as unknown as AbiItem, getMyPrivilegeAddress())
  const onClaim = index => async () => {
    if (isKlip()) {
      await request({
        contractAddress: getMyPrivilegeAddress(),
        abi: MyPrivilegesABI,
        input: [index],
      })
    } else {
      const estimateGas = await getEstimateGas(myPrivilegeHookContract.methods.claimRoyalty, account, index)
      await myPrivilegeHookContract.methods.claimRoyalty(index).send({ from: account, gas: estimateGas })
    }
    const newData = data
    newData.roundRewards[index] = '0'
    setData({ ...newData })
    setIsShowSuccessModal(true)
  }

  const totalClaimed = useMemo(() => {
    if (data.roundRewards.filter(x => x === '-').length !== 0) return '-'
    return data.roundRewards
      .map((x, i) => (parseInt(x, 10) === 0 ? parseInt(data.roundRewardData[i], 10) : 0))
      .reduce((a, b) => a + b, 0)
  }, [data])

  const remaining = useMemo(() => {
    if (data.roundRewards.filter(x => x === '-').length !== 0) return '-'
    return data.roundRewards
      .map((x, i) => (parseInt(x, 10) !== 0 ? parseInt(data.roundRewardData[i], 10) : 0))
      .reduce((a, b) => a + b, 0)
  }, [data])
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
            {t('My privileges')}
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
              <InLineText
                title={t('Fixed Reward')}
                value={data.fixedReward}
                mb={isMobile ? '24px' : '12px'}
                isLoading={isLoading}
              />
              <InLineText title={t('Variable Reward')} value={data.variableReward} isLoading={isLoading} />
            </Flex>

            {isMobile ? (
              <Divider my="24px" width="100%" style={{ backgroundColor: '#B4A9A8' }} />
            ) : (
              <VDivider mx="24px" style={{ borderColor: '#B4A9A8' }} />
            )}

            <Flex flexGrow={1} flexDirection="column" px={isMobile ? '' : '24px'}>
              <InLineText
                title={t('Total claimed')}
                value={totalClaimed}
                mb={isMobile ? '24px' : '12px'}
                isLoading={isLoading}
              />
              <InLineText title={t('Reward remaining')} value={remaining} isLoading={isLoading} />
            </Flex>
          </Flex>

          <ClaimListStyle flexDirection={isMobile ? 'column' : 'row'} pt={isMobile ? '24px' : '40px'}>
            <ClaimBox
              ordinal="1st"
              amount={data.roundRewardData[0]}
              date="16 Nov 2022"
              isInactive={!data.roundStatus[0]}
              isSucceeded={isSuccess(data.roundRewards[0], data.fixedReward, data.variableReward)}
              onClaim={onClaim(0)}
              isLoading={isLoading}
            />
            <ClaimBox
              ordinal="2nd"
              amount={data.roundRewardData[1]}
              date="14 Dec 2022"
              isInactive={!data.roundStatus[1]}
              isSucceeded={isSuccess(data.roundRewards[1], data.fixedReward, data.variableReward)}
              onClaim={onClaim(1)}
              isLoading={isLoading}
            />
            <ClaimBox
              ordinal="3rd"
              amount={data.roundRewardData[2]}
              date="11 Jan 2023"
              isInactive={!data.roundStatus[2]}
              isSucceeded={isSuccess(data.roundRewards[2], data.fixedReward, data.variableReward)}
              onClaim={onClaim(2)}
              isLoading={isLoading}
            />
            <ClaimBox
              ordinal="4th"
              amount={data.roundRewardData[3]}
              date="15 Feb 2023"
              isInactive={!data.roundStatus[3]}
              isSucceeded={isSuccess(data.roundRewards[3], data.fixedReward, data.variableReward)}
              onClaim={onClaim(3)}
              isLoading={isLoading}
            />
          </ClaimListStyle>
          {!account && (
            <>
              <UnlockButton
                scale="md"
                style={{ margin: '24px auto 0 auto', display: 'block', maxWidth: 'calc(100% - 48px)' }}
              />
            </>
          )}
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
