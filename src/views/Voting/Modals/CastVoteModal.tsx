import React, { useState, useCallback, useMemo, useEffect } from 'react'
import numeral from 'numeral'
import BigNumber from 'bignumber.js'
import _ from 'lodash'
import Lottie from 'react-lottie'
// import moment from 'moment'
// import numeral from 'numeral'
// import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { Text, useMatchBreakpoints, Button } from 'uikit-dev'
// import Checkbox from '@material-ui/core/Checkbox'
// import FormControlLabel from '@material-ui/core/FormControlLabel'
import { provider } from 'web3-core'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import * as klipProvider from 'hooks/klipProvider'
import {
  useHarvest as useHarvestLongterm,
  useSousHarvest,
  useBalances,
  useLockTopup,
  useAllDataLock,
  useAllLock,
  usePrivateData,
} from 'hooks/useLongTermStake'
import { useAvailableVotes, useVote, useApproveToService, useServiceAllowance } from 'hooks/useVoting'
import { useLockPlus } from 'hooks/useTopUp'
import { ChevronDown, AlertCircle } from 'react-feather'
import { Collapse, IconButton } from '@material-ui/core'
import success from 'uikit-dev/animation/complete.json'
import loadings from 'uikit-dev/animation/farmPool.json'
import ModalCastVote from 'uikit-dev/widgets/Modal/ModalCastVote'
import ModalResponses from 'uikit-dev/widgets/Modal/ModalResponses'

const SuccessOptions = {
  loop: true,
  autoplay: true,
  animationData: success,
}

// const options = {
//   loop: true,
//   autoplay: true,
//   animationData: loadings,
// }

interface Props {
  onDismiss?: () => void
  select?: any
  proposalIndex?: any
  allChoices?: any
}

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

const StylesButton = styled(Button)`
  padding: 11px 12px 11px 12px;
  border: ${({ theme }) => theme.isDark && '1px solid #707070'};
  border-radius: 8px;
  font-size: 12px;
  background-color: ${({ theme }) => (theme.isDark ? '#ffff0000' : '#EFF4F5')};
  height: 38;
  width: auto;
  color: ${({ theme }) => (theme.isDark ? theme.colors.textSubtle : '#1587C9')};

  &:hover:not(:disabled):not(.button--disabled):not(:active) {
    background-color: ${({ theme }) => (theme.isDark ? '#ffff0000' : '#EFF4F5')};
    border: ${({ theme }) => theme.isDark && '1px solid #707070'};
    color: ${({ theme }) => (theme.isDark ? theme.colors.textSubtle : '#1587C9')};
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
`

const Box = styled.div<{ expand: boolean }>`
  border: 1px solid #979797;
  border-radius: 6px;
  border-bottom-left-radius: ${({ expand }) => (expand ? '0px' : '6px')};
  border-bottom-right-radius: ${({ expand }) => (expand ? '0px' : '6px')};
  padding: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const BoxDetails = styled.div<{ expand: boolean }>`
  border: 1px solid #979797;
  border-radius: 6px;
  border-top-left-radius: ${({ expand }) => (expand ? '0px' : '6px')};
  border-top-right-radius: ${({ expand }) => (expand ? '0px' : '6px')};
  border-top: unset;
  padding: 14px;
`

const CardAlert = styled.div`
  border: 1px solid #f5c858;
  border-radius: 8px;
  padding: 6px 14px;
  margin-top: 20px;
  display: flex;
  align-items: center;
`

const ExpandMore = styled((props) => {
  const { expand, ...other } = props
  return <IconButton {...other} />
})(() => ({
  '&.MuiIconButton-root': {
    padding: 'unset',
  },
}))

const CastVoteModal: React.FC<Props> = ({ onDismiss = () => null, select, proposalIndex, allChoices }) => {
  const { account, klaytn }: { account: string; klaytn: provider } = useWallet()
  const availableVotes = useAvailableVotes()
  const { balancevfinix } = usePrivateData()
  const { allLockPeriod } = useAllLock()
  const balanceOf = useBalances()
  const { handleHarvest } = useHarvestLongterm()
  const { isDark } = useTheme()
  const { levelStake, allLock } = useAllDataLock()
  const lockTopUp = useLockTopup()
  const [selectedToken, setSelectedToken] = useState({})
  const [transactionHash, setTransactionHash] = useState('')
  // const [sousId, setSousId] = useState(0)
  const [period, setPeriod] = useState(0)
  const [idLast, setIdLast] = useState(0)

  const [amount, setAmount] = useState('')
  const [value, setValue] = useState('0')
  const [showLottie, setShowLottie] = useState(false)
  const [selects, setSelect] = useState({})

  const arrayAmounr = useMemo(() => {
    const brr = []
    Object.values(selects).filter((v) => brr.push(_.get(v, 'vote')))
    return brr
  }, [selects])

  const mapChoices = useMemo(() => {
    const map = []
    allChoices.filter((v) => {
      Object.values(selects).some((i) => {
        if (_.get(i, 'id') === _.get(v, 'id') && _.get(i, 'vote')) {
          map.push(_.get(i, 'vote'))
        } else {
          map.push('0')
        }
        console.log('map', map)
        return map
      })
      return map
    })
    return map
  }, [allChoices, selects])

  const { onCastVote, serviceKey } = useVote(proposalIndex, mapChoices)
  const { onApprove } = useApproveToService(klipProvider.MAX_UINT_256_KLIP)
  const allowance = useServiceAllowance()

  const realPenaltyRate = _.get(allLockPeriod, '0.realPenaltyRate')

  const { isXl, isLg } = useMatchBreakpoints()
  const isMobileOrTablet = !isXl && !isLg
  const [percent, setPercent] = useState(0)
  const [multiple, setMultiple] = useState(true)
  const filter = Object.values(select).filter((i) => {
    return _.get(i, 'checked') === true
  })

  const handleApprove = useCallback(async () => {
    try {
      const txHash = await onApprove()
      if (txHash) {
        setTransactionHash(_.get(txHash, 'transactionHash'))
      }
    } catch (e) {
      setTransactionHash('')
    }
  }, [onApprove])

  const CardResponse = () => {
    return (
      <ModalResponses title="" onDismiss={onDismiss} className="">
        <div className="pb-6 pt-2">
          <Lottie options={SuccessOptions} height={155} width={185} />
        </div>
      </ModalResponses>
    )
  }

  const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`)
  const [expanded, setExpanded] = React.useState(false)
  const handleExpandClick = () => {
    setExpanded(!expanded)
  }
  function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  const enforcer = (nextUserInput: string, e, i, data) => {
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      setSelect({
        ...select,
        [i]: {
          checked: e.target.checked,
          id: data.id,
          value: data.value,
          vote: new BigNumber(Number(nextUserInput.replace(',', ''))).times(new BigNumber(10).pow(18)).toFixed(),
        },
      })
      setValue(nextUserInput)
      setAmount(new BigNumber(Number(value.replace(',', ''))).times(new BigNumber(10).pow(18)).toFixed())
    }
  }
  const handleChange = async (e, i, data) => {
    enforcer(e.target.value.replace(/,/g, '.'), e, i, data)
    setPercent(0)
  }

  const onConfirm = () => {
    const res = onCastVote()
    res
      .then((r) => {
        console.log('onCastVote >>>>>> ', r)
      })
      .catch((e) => {
        console.log('e >>>>>> ', e)
      })
  }

  return (
    <>
      {showLottie ? (
        <CardResponse />
      ) : (
        <ModalCastVote title="Confirm Vote" onDismiss={onDismiss} hideCloseButton>
          <div className={`${expanded === false ? 'mt-2' : 'mt-2 mb-0'}`}>
            <Box expand={expanded}>
              <Text fontSize="18px" bold lineHeight="1">
                Your Voting Power
              </Text>
              <div className="flex align-center">
                <Text fontSize="18px" bold lineHeight="1" color="#30ADFF" mr="10px">
                  {numeral(availableVotes).format('0,0.00')}{' '}
                </Text>
                <ExpandMore
                  expand={expanded}
                  onClick={handleExpandClick}
                  aria-expanded={expanded}
                  aria-label="show more"
                >
                  <ChevronDown color={isDark ? 'white' : 'black'} />
                </ExpandMore>
              </div>
            </Box>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <BoxDetails expand={expanded}>
                <div className="flex justify-space-between">
                  <Text fontSize="16px">Your FINIX held now</Text>
                  <Text fontSize="16px" bold color="#30ADFF">
                    {numeral(balancevfinix).format('0,0.00')}{' '}
                  </Text>
                </div>
              </BoxDetails>
            </Collapse>
            {filter.map((v, index) => (
              <>
                <div className="mt-3">
                  <Text color="textSubtle">Voting for</Text>
                  <Text fontSize="16px" color="text" bold paddingTop="6px">
                    {_.get(v, 'value')}
                  </Text>
                </div>
                <div className="flex mt-4">
                  <Text className="col-6" color="textSubtle">
                    Vote
                  </Text>
                </div>

                {isMobileOrTablet ? (
                  <Balance id={_.get(v, 'id')} style={{ flexWrap: 'wrap' }}>
                    <NumberInput
                      style={{ width: isMobileOrTablet ? '20%' : '45%' }}
                      placeholder="0.00"
                      value={value}
                      onChange={(e) => handleChange(e, index, v)}
                      pattern="^[0-9]*[,]?[0-9]*$"
                    />
                    {percent !== 1 && (
                      <div className="flex align-center justify-end" style={{ width: 'auto' }}>
                        <StylesButton className="mr-1" size="sm" onClick={() => setPercent(0.25)}>
                          25%
                        </StylesButton>
                        <StylesButton className="mr-1" size="sm" onClick={() => setPercent(0.5)}>
                          50%
                        </StylesButton>
                        <StylesButton size="sm" onClick={() => setPercent(1)}>
                          MAX
                        </StylesButton>
                      </div>
                    )}
                  </Balance>
                ) : (
                  <Balance>
                    <NumberInput
                      style={{ width: isMobileOrTablet ? '20%' : '45%' }}
                      placeholder="0.00"
                      value={value}
                      onChange={(e) => handleChange(e, index, v)}
                      pattern="^[0-9]*[,]?[0-9]*$"
                    />
                    {percent !== 1 && (
                      <div className="flex align-center justify-end" style={{ width: 'auto' }}>
                        <StylesButton className="mr-1" size="sm" onClick={() => setPercent(0.25)}>
                          25%
                        </StylesButton>
                        <StylesButton className="mr-1" size="sm" onClick={() => setPercent(0.5)}>
                          50%
                        </StylesButton>
                        <StylesButton size="sm" onClick={() => setPercent(1)}>
                          MAX
                        </StylesButton>
                      </div>
                    )}
                  </Balance>
                )}
              </>
            ))}
          </div>

          {!multiple && (
            <div className="flex justify-space-between mt-5">
              <Text color="text" bold>
                Total Voting Power
              </Text>
              <Text color="#30ADFF">000000000</Text>
            </div>
          )}

          <CardAlert>
            <AlertCircle size={50} color="#F5C858" />
            <Text color="text" paddingLeft="10px">
              Do you want to vote? Your Voting Power (vFINIX) will be locked until the voting time is ended.
            </Text>
          </CardAlert>
          {allowance > 0 || transactionHash !== '' ? (
            <Button onClick={() => onConfirm()} fullWidth radii="small" className="mt-3">
              Confirm
            </Button>
          ) : (
            <Button onClick={() => handleApprove()} fullWidth radii="small" className="mt-3">
              Approve Contract
            </Button>
          )}
        </ModalCastVote>
      )}
    </>
  )
}

export default CastVoteModal