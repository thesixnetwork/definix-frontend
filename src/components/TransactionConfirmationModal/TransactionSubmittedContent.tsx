import { RowBetween } from 'components/Row'
import React from 'react'
import Lottie from 'react-lottie'
import { ArrowDownIcon, Button, ChevronRightIcon, Heading, Link, Text } from 'uikit-dev'
import complete from 'uikit-dev/animation/complete.json'
import CopyToClipboard from 'uikit-dev/widgets/WalletModal/CopyToClipboard'
import { getBscScanLink } from '../../utils'

const options = {
  loop: true,
  autoplay: true,
  animationData: complete,
}

type TransactionSubmittedContentProps = {
  title: string
  date?: string
  hash: string | undefined
  chainId: number | undefined
  content?: any
  button?: any
}

const TransactionSubmittedContent = ({
  title,
  date,
  chainId,
  hash,
  content,
  button,
}: TransactionSubmittedContentProps) => {
  return (
    <div className="pa-6 pt-4" style={{ position: 'relative' }}>
      <div className="flex flex-column align-center justify-center mb-6">
        <Lottie options={options} height={120} width={120} />
        <Heading fontSize="24px !important" textAlign="center">
          {title}
        </Heading>
        <Text color="textSubtle" textAlign="center" className="mt-2" fontSize="12px">
          {date}
        </Text>
      </div>

      {content()}

      {chainId && hash && (
        <div>
          <RowBetween className="mt-6">
            <div className="flex">
              <Text className="mr-2" fontSize="12px">
                Transaction Hash
              </Text>
              <Text className="mr-2" bold>
                {`${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`}
              </Text>
              <CopyToClipboard noPadding toCopy={hash} />
            </div>

            <Link
              external
              href={getBscScanLink(chainId, hash, 'transaction')}
              bold={false}
              className="flex-shrink"
              color="textSubtle"
              fontSize="12px"
            >
              View on Klaytn Scope
              <ChevronRightIcon color="textSubtle" />
            </Link>
          </RowBetween>

          {false && (
            <div className="flex justify-center mt-6">
              <Button
                startIcon={<ArrowDownIcon />}
                onClick={() => {
                  console.log('Download IMG')
                }}
                variant="secondary"
                size="sm"
              >
                Download IMG Transaction
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="mt-6">{button}</div>
    </div>
  )
}

export default TransactionSubmittedContent
