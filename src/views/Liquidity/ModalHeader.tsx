import React from 'react';
import { useTranslation } from 'react-i18next';
import { ColorStyles, Flex, Text, Box, Lp } from '@fingerlabs/definixswap-uikit-v2';
import { Field } from 'state/mint/actions';
import { Currency, TokenAmount } from 'definixswap-sdk';

interface IProps {
  noLiquidity: boolean;
  currencies: {
    CURRENCY_A?: Currency;
    CURRENCY_B?: Currency;
  };
  liquidityMinted: TokenAmount;
}

const ModalHeader: React.FC<IProps> = ({
  noLiquidity,
  currencies,
  liquidityMinted,
}) => {
  const { t } = useTranslation();
  return (
    <Flex flexDirection="column">
      {!noLiquidity && (
        <Flex
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          p="14px 0px"
        >
          <Flex alignItems="center">
            <Box mr="10px">
              <Lp
                size="32px"
                lpSymbols={[currencies[Field.CURRENCY_A]?.symbol, currencies[Field.CURRENCY_B]?.symbol]}
              />
            </Box>
            <Text textStyle="R_16M" color={ColorStyles.BLACK}>
              {`${currencies[Field.CURRENCY_A]?.symbol}-${currencies[Field.CURRENCY_B]?.symbol}`}
            </Text>
          </Flex>
          <Text textStyle="R_16R" color={ColorStyles.BLACK}>
            {liquidityMinted?.toSignificant(6)}
          </Text>
        </Flex>
      )}
      {noLiquidity && (
        <Flex flexDirection="column">
          <Text textStyle="R_16M" color={ColorStyles.DEEPGREY}>
            {t('You are creating a pool')}
          </Text>
          <Flex
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            p="14px 0px"
          >
            <Flex alignItems="center">
              <Box mr="10px">
                <Lp
                  size="32px"
                  lpSymbols={[currencies[Field.CURRENCY_A]?.symbol, currencies[Field.CURRENCY_B]?.symbol]}
                />
              </Box>
              <Text textStyle="R_16M" color={ColorStyles.BLACK}>
                {`${currencies[Field.CURRENCY_A]?.symbol}-${currencies[Field.CURRENCY_B]?.symbol}`}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      )}
    </Flex>
  )
}

export default React.memo(ModalHeader);