import React, { memo } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Heading, Text } from 'uikit-dev'

const BSC_3_4 = ({ title }) => {
  const { t } = useTranslation()

  return (
    <>
      <Heading className="mb-6" color="primary">
        {title}
      </Heading>
      <div>
        <Text fontSize="14px" className="mb-4">
          {t('After confirming your transaction, it will take 15-60 seconds to complete. Once the process is completed, coins will be shown in your wallet.')}
          <br />
          {t('For your first farm, what you need is 2 tokens with equal value to make liquidity.')}
        </Text>

        <Text fontSize="14px" className="mb-4">
          {t('Example :')}{' '}
          <Text fontSize="14px" color="primary" className="dis-in-block">
            FINIX-SIX LP
          </Text>
          <br />
          {t('The current price ratio of SIX and FINIX is')}
          <br />
          1 SIX = 0.06 USD
          <br />1 FINIX = 1.2 USD
        </Text>

        <Text fontSize="14px" className="mb-4">
          {t('That’s means if you want to pair this LP.')} <br />
          {t('You will need :')}
          <br />
          <Text fontSize="14px" color="primary" className="dis-in-block">
            20 SIX
          </Text>{' '}
          ( 1.2 USD ) {t('and')} <br />
          <Text fontSize="14px" color="primary" className="dis-in-block">
            1 FINIX
          </Text>{' '}
          ( 1.2 USD )
        </Text>

        <Text fontSize="14px">{t('Prepare your tokens, we’re moving to the last process.')}</Text>
      </div>
    </>
  )
}

export default memo(BSC_3_4)
