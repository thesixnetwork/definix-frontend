import React, { useState } from "react";
import styled from "styled-components";
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import useTranslation from 'contexts/Localisation/useTranslation'
import { Text, Button, Flex, IconButton, ButtonVariants, ButtonScales, useWalletModal, useMatchBreakpoints, ArrowRightGIcon, MoreNIcon, GnbMySIcon, ColorStyles, TextStyles, Dropdown, DropdownItem, Login } from "definixswap-uikit";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 188px;
`;

const StyledButton = styled.a`
  cursor: pointer;
  position: absolute;
  bottom: 0;
  width: calc(100% + 40px);
  margin: 0 -20px;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 56px;
  background-color: ${({ theme }) => theme.colors[ColorStyles.DEEPBROWN]};
`;

const UserBlock: React.FC = () => {
  const { account, connect, reset } = useWallet()
  const { t } = useTranslation();
  const { isMobile } = useMatchBreakpoints();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { onPresentConnectModal, onPresentAccountModal } = useWalletModal(connect as Login, reset, account);
  const accountEllipsis = account ? `${account.substring(0, 4)}...${account.substring(account.length - 4)}` : null;

  if (account) {
    return isMobile ? <Wrapper>
      <Flex pl="12px" flexDirection="column" alignItems="flex-start">
        <Text mt="55px" textStyle={TextStyles.R_12R} color={ColorStyles.MEDIUMGREY}>
          {t("Wallet Address")}
        </Text>
        <Flex>
          <Text mt="2px" mr="4px" textStyle={TextStyles.R_18M} color={ColorStyles.BLACK}>
            {accountEllipsis}
          </Text>
          <Dropdown
            scale="sm"
            left="-105px"
            isOpen={isDropdownOpen}
            position="bottom"
            target={<IconButton startIcon={<MoreNIcon />} onClick={() => setIsDropdownOpen(!isDropdownOpen)} />}
            onItemClick={(index) => console.log(index)}
          >
            <DropdownItem>View on KlaytnscopeTH</DropdownItem>
            <DropdownItem>Copy Address</DropdownItem>
            <DropdownItem isDivide>Disconnect</DropdownItem>
          </Dropdown>
        </Flex>
      </Flex>
      <StyledButton href="/farm">
        <Text textStyle={TextStyles.R_12M} color={ColorStyles.WHITE}>
          {t("Net Worth")}
        </Text>
        <Flex ml="12px" alignItems="center">
          <Text mr="7px" textStyle={TextStyles.R_12B} width="140px" color={ColorStyles.WHITE}>
            $132123123
          </Text>
          <IconButton startIcon={<ArrowRightGIcon />} />
        </Flex>
      </StyledButton>
    </Wrapper> : <>
          <Button
            scale={ButtonScales.S32}
            variant={ButtonVariants.LIGHTBROWN}
            textStyle={TextStyles.R_12B}
            onClick={() => {
              onPresentAccountModal();
            }}
          >
            {accountEllipsis}
          </Button>
          <Button
            ml="8px"
            scale={ButtonScales.S32ICON}
            minWidth="auto"
            variant={ButtonVariants.DEEPBROWN}
            startIcon={<GnbMySIcon />}
            onClick={() => {
              onPresentAccountModal();
            }}
          >
            <Text textStyle={TextStyles.R_12B} ml="6px">
              {t("MY")}
            </Text>
          </Button>
        </>
  }
  return <Flex width="100%" height={isMobile ? "188px" : "auto"} alignItems="center" justifyContent="center">
      <Button
        scale={isMobile ? ButtonScales.S40 : ButtonScales.S32}
        variant={ButtonVariants.RED}
        onClick={() => {
          onPresentConnectModal();
        }}
      >
        {t("Connect Wallet")}
      </Button>
    </Flex>
};

export default UserBlock;
