import React from 'react'
import styled from 'styled-components';
import { Text, Flex, Toggle } from '@fingerlabs/definixswap-uikit-v2'
import { useTranslation } from 'react-i18next';
import { ProposalType } from '../types';

interface Props {
  setProposalType: (id: ProposalType) => void;
  setIsParticipated: (isParticipated: boolean) => void;
  isParticipated: boolean;
}

const Wrap = styled(Flex)`
  ${({ theme }) => theme.mediaQueries.mobile} {
    justify-content: space-between;
  }
`

const TextVotingOnly = styled(Text)`
  ${({ theme }) => theme.textStyle.R_14R}
  color: ${({ theme }) => theme.colors.deepgrey};
  margin-right: 10px;
`

const ProposalFilterVoting: React.FC<Props> = ({ isParticipated, setIsParticipated }) => {
  const { t } = useTranslation();
  // const [isOpen, setIsOpen] = useState(false);
  // const [activeIndex, setActiveIndex] = useState(0);
  // const options: {
  //   id: ProposalType;
  //   label: string;
  // }[] = useMemo(() => [
  //   {
  //     id: ProposalType.ALL,
  //     label: t("All"),
  //   },
  //   {
  //     id: ProposalType.CORE,
  //     label: t("Core"),
  //   },
  // ], [t])

  return (
    <Wrap>
      {/* <Box width="148px">
        <DropdownSet
          position="bottom"
          isOpen={isOpen}
          activeIndex={activeIndex}
          options={options}
          onOptionClick={(index) => {
            setActiveIndex(index);
            setProposalType(options[index].id);
            setIsOpen(false);
          }}
          onButtonClick={() => setIsOpen(!isOpen)}
        />
      </Box> */}
      <Flex alignItems="center">
        <TextVotingOnly>{t('Voting only')}</TextVotingOnly>
        <Toggle checked={isParticipated} onChange={() => setIsParticipated(!isParticipated)} />
      </Flex>
    </Wrap>
  )
}

export default ProposalFilterVoting
