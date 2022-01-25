import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Input, Text, Flex, Helper, AlertIcon, TextStyles, ColorStyles } from "@fingerlabs/definixswap-uikit-v2";
import useUserDeadline from 'hooks/useUserDeadline'
import { useTranslation } from "react-i18next";

const StyledTransactionDeadlineSetting = styled.div`
  margin-top: 4px;
`;

const Label = styled.div`
  align-items: center;
  display: flex;
  margin: 16px 0;
`;

const MIN_DEADLINE = 1200;

const TransactionDeadlineSetting: React.FC = () => {
  const { t } = useTranslation();
  const [deadline, setDeadline] = useUserDeadline()
  const [value, setValue] = useState((deadline / 60).toString()); // deadline in minutes
  const [error, setError] = useState<string | null>(null);

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = evt.target;

    if (isNaN(+inputValue) || inputValue.length > 4) {
      return;
      // } else if (!inputValue || inputValue === "") {
      //   setValue("20");
    } else {
      setValue(inputValue);
    }
  };

  // Updates local storage if value is valid
  useEffect(() => {
    try {
      const rawValue = +value * 60;
      if (!Number.isNaN(rawValue) && rawValue > 0) {
        setDeadline(rawValue);
        setError(null);
      } else {
        setDeadline(MIN_DEADLINE);
        setError("Enter a valid number");
      }
    } catch {
      setError("Enter a valid number");
    }
  }, [value, setError, setDeadline]);

  return (
    <StyledTransactionDeadlineSetting>
      <Label>
        <Text textStyle={TextStyles.R_16M} color={ColorStyles.DEEPGREY} mr="S_6">
          {t('Transaction Deadline')}
        </Text>
        <Helper text={t('Your transaction will revert if')}></Helper>
      </Label>
      <Flex width="184px" alignItems="center">
        <Input
          type="text"
          value={value}
          placeholder="20"
          onChange={handleChange}
          endIcon={
            <Text fontSize="16px">
              {t('Minutes')}
            </Text>
          }
        />
      </Flex>
      {error && (
        <Flex mt="S_12" alignItems="center">
          <AlertIcon />
          <Text ml="5px" textStyle={TextStyles.R_14R} color={ColorStyles.RED}>
            {t(error)}
          </Text>
        </Flex>
      )}
    </StyledTransactionDeadlineSetting>
  );
};

export default TransactionDeadlineSetting;
