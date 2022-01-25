import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Flex, Input, AlertIcon, Text, ColorStyles, TextStyles, Helper } from "@fingerlabs/definixswap-uikit-v2";
import useUserSlippageTolerance from 'hooks/useUserSlippageTolerance'
import { useTranslation } from "react-i18next";

const MAX_SLIPPAGE = 5000;
const RISKY_SLIPPAGE_LOW = 50;
const RISKY_SLIPPAGE_HIGH = 500;

const StyledSlippageToleranceSettings = styled.div`
  margin-bottom: 24px;
`;

const Option = styled.div`
  padding: 0 4px;
`;

const Options = styled.div`
  align-items: strech;
  display: flex;
  flex-direction: column;

  ${Option}:first-child {
    padding-left: 0;
  }

  ${Option}:last-child {
    padding-right: 0;
  }

  > :last-child {
    padding-top: 1rem;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;

    > :last-child {
      padding-top: 0;
    }
  }
`;

const WrapInput = styled(Flex)`
  width: 154px;
  align-items: center;
  ${({ theme }) => theme.mediaQueries.mobile} {
    width: 184px;
  }
`;

const Label = styled.div`
  align-items: center;
  display: flex;
  margin: 16px 0;
`;

const predefinedValues = [
  { label: "0.1%", value: 0.1 },
  { label: "0.5%", value: 0.5 },
  { label: "1%", value: 1 },
];

const SlippageToleranceSettings: React.FC = () => {
  const { t } = useTranslation();
  const [userSlippageTolerance, setUserslippageTolerance] = useUserSlippageTolerance()
  const [value, setValue] = useState((userSlippageTolerance / 100).toString());
  const [error, setError] = useState<string | null>(null);

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = evt.target;

    if (isNaN(+inputValue) || inputValue.length > 10) {
      return;
      // } else if (!inputValue || inputValue === "") {
      //   setValue("0.5");
    } else if (+inputValue > 50) {
      return;
    } else if (+inputValue == 50) {
      setValue("49");
    } else {
      if (/^[0]+[^\.]/gi.test(inputValue)) {
        setValue(inputValue.replace(/^[0]+[^\.]/, ""));
        return;
      }
      setValue(inputValue);
    }
  };

  const handleClick = (value: number) => {
    setValue(value.toString());
  };

  // Updates local storage if value is valid
  useEffect(() => {
    try {
      const rawValue = +value * 100;
      if (!Number.isNaN(rawValue) && rawValue > 0 && rawValue < MAX_SLIPPAGE) {
        setUserslippageTolerance(rawValue);

        if (rawValue < RISKY_SLIPPAGE_LOW) {
          setError("Your transaction may fail");
        } else if (rawValue > RISKY_SLIPPAGE_HIGH) {
          setError("Your transaction may be frontrun");
        } else {
          setError(null);
        }
      } else {
        setUserslippageTolerance(RISKY_SLIPPAGE_LOW);
        setError("Enter a valid slippage percentage");
      }
    } catch {
      setError("Enter a valid slippage percentage");
    }
  }, [value, setError, setUserslippageTolerance]);

  return (
    <StyledSlippageToleranceSettings>
      <Label>
        <Text textStyle={TextStyles.R_16M} color={ColorStyles.DEEPGREY} mr="S_6">
          {t('Slippage Tolerance')}
        </Text>
        <Helper text={t('Your transaction will revert if the price')}></Helper>
      </Label>
      <Options>
        <Flex mb={["8px", 0]} mr={[0, "8px"]}>
          {predefinedValues.map(({ label, value: predefinedValue }) => {
            return (
              <Option key={predefinedValue}>
                <Button
                  width="88px"
                  md
                  variant={+value === predefinedValue ? "red" : "lightbrown"}
                  onClick={() => handleClick(predefinedValue)}
                >
                  {label}
                </Button>
              </Option>
            );
          })}
        </Flex>
        <WrapInput>
          <Input
            type="text"
            placeholder="0.5"
            value={value}
            onChange={handleChange}
            isWarning={error !== null}
            endIcon={<Text fontSize="16px">%</Text>}
          />
        </WrapInput>
      </Options>
      {error && (
        <Flex mt="S_12" alignItems="center">
          <AlertIcon />
          <Text ml="5px" textStyle={TextStyles.R_14R} color={ColorStyles.RED}>
            {t(error)}
          </Text>
        </Flex>
      )}
    </StyledSlippageToleranceSettings>
  );
};

export default SlippageToleranceSettings;
