import React, { useState, useCallback, useEffect } from "react";
import { Flex, IconButton, MoreNIcon, CheckBIcon, ColorStyles, Dropdown, DropdownItem, DropdownProps } from "definixswap-uikit";
import useTranslation from 'contexts/Localisation/useTranslation'

interface Props extends Partial<DropdownProps> {
  account: string;
  reset: () => void;
  target: React.ReactElement;
}

function copyToClipboard(val: string) {
  return new Promise((resolve, reject) => {
    const element = document.createElement('textarea');
    element.value = val;
    element.setAttribute('readonly', '');
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    document.body.appendChild(element);
    element.select();
    const returnValue = document.execCommand('copy');
    document.body.removeChild(element);
    resolve(true);
    if (!returnValue) {
      reject();
    }
  });
}

let timeout: NodeJS.Timeout;

const WalletDropdown: React.FC<Props> = ({ target, account, reset, ...props }) => {
  const { t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const onItemClick = useCallback((index: number) => {
    if (index === 0) {
      window.open(`https://scope.klaytn.com/account/${account}?tabId=txList`, '_blank');
    } else if (index === 1) {
      copyToClipboard(account as string);
      setIsCopied(true);
    } else {
      reset();
    }
  }, [account, reset]);

  useEffect(() => {
    if (!isCopied) return;

    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => {
      setIsCopied(false);
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
    }, 3000);

  }, [isCopied]);

  return <Dropdown
    scale="sm"
    isOpen={isDropdownOpen}
    position="bottom"
    target={React.cloneElement(target, {
      onClick: () => setIsDropdownOpen(!isDropdownOpen)
    })}
    onItemClick={onItemClick}
    {...props}
  >
    <DropdownItem>
      {t("View on KlaytnscopeTH")}
    </DropdownItem>
    <DropdownItem>
      <Flex width="100%" alignItems="center" justifyContent="space-between">
        {t("Copy Address")}
        {isCopied && <Flex alignItems="center" color={ColorStyles.MEDIUMGREY}>
          <CheckBIcon />
          {t("Copied")}
        </Flex>}
      </Flex>
    </DropdownItem>
    <DropdownItem>
      {t("Disconnect")}
    </DropdownItem>
  </Dropdown>
}

export default WalletDropdown;