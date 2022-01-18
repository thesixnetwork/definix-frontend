import React, { useState, useMemo } from 'react'
import styled from 'styled-components';
import { Box, Text, DropdownSet, Flex, Toggle } from '@fingerlabs/definixswap-uikit-v2'
import { useTranslation } from 'react-i18next';
import { ProposalType } from '../types';

interface Props {
  setProposalType: (id: ProposalType) => void;
}

const Wrap = styled(Flex)`
  ${({ theme }) => theme.mediaQueries.mobile} {
    justify-content: space-between;
  }
`

const ProposalFilterVoting: React.FC<Props> = ({ setProposalType }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const options: {
    id: ProposalType;
    label: string;
  }[] = useMemo(() => [
    {
      id: ProposalType.ALL,
      label: t("All"),
    },
    {
      id: ProposalType.CORE,
      label: t("Core"),
    },
  ], [t])

  return (
    <Wrap>
      <Box width="148px">
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
      </Box>
      <Flex ml="24px" alignItems="center">
        <Text width="70px" textStyle="R_14R" color="deepgrey" mr="10px">{t('Voting only')}</Text>
        <Toggle checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
      </Flex>
    </Wrap>
  )
}

export default ProposalFilterVoting
