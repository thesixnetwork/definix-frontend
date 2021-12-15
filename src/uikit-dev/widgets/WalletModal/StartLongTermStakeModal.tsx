import React from 'react'
import _ from 'lodash'
import { Button } from 'uikit-dev'
import ModalSorry from '../Modal/ModalSorry'
import { Text } from '../../components/Text'

interface Props {
  onDismiss?: () => void
}

const StartLongTermStakeModal: React.FC<Props> = ({ onDismiss = () => null }) => {
  return (
    <ModalSorry title="This feature is only for vFINIX holder" onDismiss={onDismiss}>
      <div className="flex flex-column w-100">
        <Text color="#737375">
          You have never lock in Long-term Stake. Do you want to start staking in the Long-term Stake to get this
          exclusive feature?
        </Text>
      </div>
      <Button as="a" fullWidth id="harvest-all" radii="small" className="mt-4 mb-3" href="/long-term-stake">
        Start Long-term Stake
      </Button>
    </ModalSorry>
  )
}

export default StartLongTermStakeModal
