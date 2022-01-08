import React, { useMemo } from 'react';
import { Flex, Text, Box, useMatchBreakpoints, ColorStyles, NotiIcon } from '@fingerlabs/definixswap-uikit-v2';
import { useTranslation } from 'react-i18next';

const NoLiquidity: React.FC<{children?: React.ReactNode}> = () => {
  const { t } = useTranslation();
  const { isLg } = useMatchBreakpoints();
  const isMobile = useMemo(() => !isLg, [isLg]);

  return (
    <Flex 
      flexDirection="column"
      justifyContent="center"
      p={isMobile ? "20px 28px" : "24px 40px"}
      style={{backgroundColor: 'rgba(224, 224, 224, 0.2)'}}
    >
      <Flex mb="10px" alignItems="center">
        <Box mr="6px">
          <NotiIcon />
        </Box>
        <Text textStyle="R_16M" color={ColorStyles.DEEPGREY}>
          {t('You are the first liquidity')}
        </Text>
      </Flex>
      <Text textStyle="R_14R" color={ColorStyles.MEDIUMGREY}>
        {t('The ratio of tokens')}
      </Text>
    </Flex>
  );
}

export default React.memo(NoLiquidity);