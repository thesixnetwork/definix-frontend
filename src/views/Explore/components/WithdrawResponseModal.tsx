/* eslint-disable no-nested-ternary */
import React from 'react'
import { get } from 'lodash'
import moment from 'moment'
import numeral from 'numeral'
import Lottie from 'react-lottie'
import { Link } from 'react-router-dom'
import { Button, Link as UiLink, Modal, Text, useMatchBreakpoints } from 'definixswap-uikit'
import success from 'uikit-dev/animation/complete.json'
import CardHeading from './CardHeading'
import Share from './Share'
import SpaceBetweenFormat from './SpaceBetweenFormat'
import VerticalAssetRatio from './VerticalAssetRatio'
import { ChevronRightIcon } from 'uikit-dev'
import { useTranslation } from 'react-i18next'
 
const SuccessOptions = {
  loop: true,
  autoplay: true,
  animationData: success,
}

// <CardResponse currentInput={currentInput} tx={tx} rebalance={rebalance} />
const WithdrawResponseModal = ({ tx, currentInput, rebalance, onDismiss = () => null }) => {
  const { isXl, isXxl } = useMatchBreakpoints()
  const isMobile = !isXl && !isXxl
  const usdToBeRecieve = parseFloat(currentInput) * rebalance.sharedPrice
  const { transactionHash } = tx
  const { t } = useTranslation()

  return (
    <Modal title={t('Confirm Invest')} mobileFull onDismiss={onDismiss}>
      <div className={isMobile ? 'pa-4' : 'pa-6'}>
        <div className="flex flex-column align-center justify-center mb-6">
          <Lottie options={SuccessOptions} height={120} width={120} />
          {/* <ErrorIcon width="80px" color="failure" className="mb-3" /> */}
          <Text fontSize="24px" bold textAlign="center">
            Withdraw Complete
          </Text>
          <Text color="textSubtle" textAlign="center" className="mt-1" fontSize="12px">
            {moment(new Date()).format('DD MMM YYYY, HH:mm')}
          </Text>

          <CardHeading rebalance={rebalance} className="mt-6" />
        </div>

        <div className="flex flex-wrap align-center mb-6">
          <div className={`flex flex-column ${isMobile ? 'col-12 pb-4 align-center' : 'col-7 pl-4 align-end'}`}>
            <Share
              share={currentInput}
              usd={`~ $${numeral(
                usdToBeRecieve -
                  usdToBeRecieve / (100 / get(rebalance, 'fee.bounty', 0.3)) -
                  usdToBeRecieve / (100 / get(rebalance, 'fee.buyback', 1.5)) -
                  usdToBeRecieve / (100 / get(rebalance, 'fee.management', 0.2)),
              ).format('0,0.[0000]')}`}
              textAlign={isMobile ? 'center' : 'left'}
            />
          </div>
          <VerticalAssetRatio className={isMobile ? 'col-12' : 'col-5'} />
        </div>

        <SpaceBetweenFormat
          titleElm={
            <div className="flex">
              <Text fontSize="12px" color="textSubtle" className="mr-2">
                Transaction Hash
              </Text>
              <Text fontSize="12px" color="primary" bold>
                {`${transactionHash.slice(0, 4)}...${transactionHash.slice(
                  transactionHash.length - 4,
                  transactionHash.length,
                )}`}
              </Text>
            </div>
          }
          valueElm={
            <UiLink
              href={`https://scope.klaytn.com/tx/${transactionHash}`}
              fontSize="12px"
              color="textSubtle"
              style={{ marginRight: '-4px' }}
            >
              KlaytnScope
              <ChevronRightIcon color="textSubtle" />
            </UiLink>
          }
          className="mb-2"
        />

        <Button as={Link} to="/rebalancing/detail" className="mt-3">
          Back to Rebalancing
        </Button>
      </div>
    </Modal>
  )
}

export default WithdrawResponseModal;