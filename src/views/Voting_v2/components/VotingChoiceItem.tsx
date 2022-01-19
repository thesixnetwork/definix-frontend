import React from 'react'
import styled from 'styled-components'
import { Box, Flex, Text, CheckboxLabel, Checkbox, Skeleton } from '@fingerlabs/definixswap-uikit-v2'
import { useTranslation } from 'react-i18next'
import Translate from './Translate'

interface Props {
  choice: string;
  isVoteMore: boolean;
  isMax: boolean;
  votingResult: {
    percent: number;
    vote: string;
  }
  index: number;
  onCheckChange: (isChecked: boolean, index: number) => void;
  isChecked: boolean;
}

const WrapChoice = styled(Flex)<{ isParticipated: boolean }>`
  flex-direction: column;
  padding-top: 20px;
  padding-bottom: 10px;

  .mobile-percent {
    display: none;
  }

  .votes {
    color: ${({ theme }) => theme.colors.mediumgrey};
    ${({ theme }) => theme.textStyle.R_14R}
  }

  .wrap-votes {
    margin-left: ${({ isParticipated }) => isParticipated ? '0' : '36px'};
    margin-top: 6px;
  }

  ${({ theme }) => theme.mediaQueries.mobile} {
    padding-top: 0;
    padding-bottom: 24px;

    .choice {
      ${({ theme }) => theme.textStyle.R_14R}
    }

    .votes {
      ${({ theme }) => theme.textStyle.R_12R}
    }

    .percent {
      display: none;
    }

    .wrap-votes {
      justify-content: space-between;
      margin-left: ${({ isParticipated }) => isParticipated ? '0' : '36px'};
    }

    .mobile-percent {
      display: block;
    }
  }
`

const Range = styled(Box)`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.lightGrey30};
  border-radius: 4px;
`

const RangeValue = styled(Box)<{ width: number, isParticipated: boolean, isMax: boolean }>`
  width: ${({ width }) => width}%;
  height: 100%;
  border-radius: 4px;
  background-color: ${({ theme, isParticipated, isMax }) => isParticipated && isMax ? theme.colors.red : theme.colors.lightbrown};
`

const VotingChoiceItem: React.FC<Props> = ({ choice, index, isVoteMore, isMax, votingResult, isChecked, onCheckChange }) => {
  const { t } = useTranslation();

  return (
    <WrapChoice key={choice} isParticipated={isVoteMore}>
      <Flex justifyContent="space-between" alignItems="center">
        {
          isVoteMore ? <Text className="choice" textStyle="R_16R" color="black">
            <Translate text={choice} type="opinion" />
          </Text> : <CheckboxLabel control={<Checkbox checked={isChecked} onChange={(e) => onCheckChange(e.target.checked, index)} />} className="mr-12">
            <Text className="choice" textStyle="R_16R" color="black">
              <Translate text={choice} type="opinion" />
            </Text>
          </CheckboxLabel>
        }
        <div className="percent">
          {
            votingResult ? <Text textStyle="R_16M" color="deepgrey">{votingResult ? `${votingResult.percent  }%` : ' '}</Text> : <Skeleton width="100px" height="100%" animation="waves" />
          }
        </div>
      </Flex>
      <Flex ml={isVoteMore ? '0' : "36px"} mt="14px">
        <Range>
          <RangeValue width={votingResult ? votingResult.percent : 0} isParticipated={isVoteMore} isMax={isMax} />
        </Range>
      </Flex>
      <Flex minHeight="20px" className="wrap-votes">
        {
          votingResult ? <Text className="votes">{votingResult ? `${votingResult.vote} ${t('Votes')}` : ' '}</Text> : <Skeleton width="100px" height="100%" animation="waves" />
        }
        <div className="mobile-percent">
          {
            votingResult ? <Text textStyle="R_12M" color="deepgrey">{votingResult ? `${votingResult.percent  }%` : ' '}</Text> : <Skeleton width="100px" height="100%" animation="waves" />
          }
        </div>
      </Flex>
    </WrapChoice>
  )
}

export default VotingChoiceItem
