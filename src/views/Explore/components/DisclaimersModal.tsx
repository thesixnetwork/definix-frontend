import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import React from 'react'
import styled from 'styled-components'
import Button from 'uikit-dev/components/Button/Button'
import Heading from 'uikit-dev/components/Heading/Heading'
import CheckmarkIcon from 'uikit-dev/components/Svg/Icons/Checkmark'
import Text from 'uikit-dev/components/Text/Text'
import Modal from 'uikit-dev/widgets/Modal/Modal'

const Box = styled.div`
  padding: 16px;
  background: ${({ theme }) => theme.colors.backgroundBox};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.card};
`

const RoundCheckbox = styled(Checkbox)`
  width: 28px !important;
  height: 28px !important;
  margin-right: 16px !important;
  border-radius: 50% !important;
  background: transparent !important;
  border: 2px solid rgba(0, 0, 0, 0.54) !important;

  &.Mui-checked {
    background: ${({ theme }) => theme.colors.primary} !important;
    border-color: ${({ theme }) => theme.colors.primary} !important;
  }
`

const CustomCheckbox = styled(Checkbox)`
  &.Mui-checked {
    color: ${({ theme }) => theme.colors.primary} !important;
  }
`

const DisclaimersModal = ({ onDismiss = () => null, isConfirm = false }) => {
  return (
    <Modal
      title=""
      isRainbow={false}
      hideCloseButton
      classHeader="pa-0"
      maxWidth="500px"
      maxHeight="calc(100vh - 48px)"
      onDismiss={onDismiss}
    >
      <Heading as="h1" fontSize="28px !important" className="mb-4">
        Disclaimers
      </Heading>

      <Box>
        <Text className="mb-3">
          Definix Rebalancing Farm (the “Farm”) has been developed by SIX Network PTE. LTD. and its affiliates
          (collectively, the “Developer”) for the purpose of being an automatic tool (the “Tool”) for investors for
          applying rebalancing strategy conveniently. However, the Developer is not responsible for managing the Farm.
          The Farm has been managed by a 3rd party called “Enigma” (the “Manager”). The information about the Farm has
          been displayed on Definix website (this “Website”) for informational purposes only in relation to a potential
          opportunity available in the Farm.
        </Text>

        <Text className="mb-3">
          No advice on investment; Risk of Loss Each investor must undertake its own independent examination and
          investigation of the Farm, including the merits and risks involved in an investment in the Farm, and must base
          its investment decision - including a determination whether the Farm would be a suitable investment for the
          investor - on such examination and investigation and must not rely on the Manager in making such investment
          decision. Prospective investors must not construe the contents of this Website as legal, tax, investment, or
          other advice.
        </Text>

        <Text className="mb-3">
          Performance Disclosures Performance information is provided for informational purposes only. Past performance
          of the Farm and/or the Manager is not necessarily indicative of future results, and there can be no assurance
          that any projections, targets or estimates of future performance will be realized. Future performance of the
          Farm may vary substantially from the performance provided on this Website. An investor may lose all or a
          substantial part of its investment in the Farm.
        </Text>

        <Text>
          The information on this Website may be subject to change at any time without prior notice to the user.
        </Text>
      </Box>

      {isConfirm ? (
        <div className="mt-5 flex flex-column">
          <FormControlLabel
            value="all"
            className="ml-0 mb-2"
            control={
              <RoundCheckbox
                color="primary"
                size="medium"
                checkedIcon={<CheckmarkIcon color="#ffffff" />}
                icon={<></>}
              />
            }
            label={
              <Text fontSize="16px" bold>
                I have read all the information above and agree to using the service.
              </Text>
            }
          />
          <FormControlLabel
            style={{ marginLeft: '-6px' }}
            control={<CustomCheckbox color="primary" size="small" />}
            label={<Text>Do not show this message for 14 days</Text>}
          />
          <Button fullWidth onClick={onDismiss} radii="card" className="mt-5">
            Confirm
          </Button>
        </div>
      ) : (
        <Button fullWidth onClick={onDismiss} radii="card" className="mt-5">
          Close
        </Button>
      )}
    </Modal>
  )
}

export default DisclaimersModal
