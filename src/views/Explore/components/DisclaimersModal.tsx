import { CheckCircleRounded, RadioButtonUnchecked } from '@mui/icons-material'
import { Box, Button, Checkbox, FormControlLabel, styled, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ModalV2 from 'uikitV2/components/ModalV2'

const BoxStyle = styled(Box)`
  border: 1px solid ${({ theme }) => theme.palette.divider};
  border-radius: 8px;
  padding: 16px;
  overflow: auto;
  margin-bottom: 24px;
`

const RoundCheckbox = styled(Checkbox)`
  svg {
    width: 28px;
    height: 28px;
  }

  margin-right: 16px;
  padding: 0;
`

const CustomCheckbox = styled(Checkbox)``

const DisclaimersModal = ({ onDismiss = () => null, isConfirm = false }) => {
  const [isAccept, setIsAccept] = useState(false)
  const [isSkip, setIsSkip] = useState(false)

  useEffect(() => {
    return () => {
      setIsAccept(false)
      setIsSkip(false)
    }
  }, [])

  const onExit = () => {
    if (isSkip) localStorage.setItem('disclaimerSkipped', 'true')
    onDismiss()
  }
  const onCheckBoxChange = (event) => {
    setIsSkip(event.target.checked)
  }
  const renderCheckBox = () => {
    return (
      <FormControlLabel
        style={{ marginLeft: '-6px' }}
        control={<CustomCheckbox onChange={onCheckBoxChange} checked={isSkip} color="primary" size="small" />}
        label={
          <Typography variant="caption" sx={{ color: (theme) => theme.palette.text.disabled }}>
            Do not show this message for 14 days
          </Typography>
        }
      />
    )
  }
  return (
    <ModalV2 title="Disclaimers" hideCloseButton maxWidth="486px" maxHeight="600px" onDismiss={onDismiss}>
      <Box display="flex" flexDirection="column" height="100%">
        <BoxStyle>
          <Typography variant="caption" color="textSecondary" className="d-block mb-4">
            Definix is solely a marketplace (the “Marketplace”) which provides a tool. The Rebalancing Farm (the “Farm”)
            has been managed by a 3rd party called “Enigma” (the “Manager”). The information about the Farm has been
            displayed on Definix website (this “Website”) for informational purposes only in relation to a potential
            opportunity available in the Farm.
          </Typography>
          <Typography variant="body2" className="d-block mb-1">
            No advice on investment; Risk of Loss
          </Typography>
          <Typography variant="caption" color="textSecondary" className="d-block mb-4">
            Each investor must undertake its own independent examination and investigation of the Marketplace and the
            Farm, including the merits and risks involved in an investment in the Farm, and must base its investment
            decision - including a determination whether the Farm would be a suitable investment for the investor - on
            such examination and investigation and must not rely on the Manager in making such investment decision.
            Prospective investors must not construe the contents of this Website as legal, tax, investment, or other
            advice. Prospective investors must acknowledge that the Farm may be affected by factors, including technical
            difficulties with the performance, bugs, glitches, lack of functionality, and attacks. The Marketplace will
            not be liable for any loss, whether such loss is direct, indirect, special or consequential, suffered by any
            party as a result of their use of the Marketplace and the Farm. Each investor must be solely responsible for
            any damage to any loss that results from any activities on the Marketplace and the Farm.
          </Typography>
          <Typography variant="body2" className="d-block mb-1">
            Performance Disclosures
          </Typography>
          <Typography variant="caption" color="textSecondary" className="d-block mb-4">
            Performance information is provided for informational purposes only. Past performance of the Farm and/or the
            Manager is not necessarily indicative of future results, and there can be no assurance that any projections,
            targets or estimates of future performance will be realized. Future performance of the Farm may vary
            substantially from the performance provided on this Website. An investor may lose all or a substantial part
            of its investment in the Farm.
          </Typography>
          <Typography variant="caption" color="textSecondary">
            The information on this Website may be subject to change at any time without prior notice to the user.
          </Typography>
        </BoxStyle>

        <Box className="mt-auto">
          {isConfirm ? (
            <>
              <FormControlLabel
                value={isAccept}
                className="ml-0 mb-2"
                onChange={() => {
                  setIsAccept(!isAccept)
                }}
                control={
                  <RoundCheckbox
                    color="primary"
                    size="medium"
                    checkedIcon={<CheckCircleRounded />}
                    icon={<RadioButtonUnchecked />}
                  />
                }
                label={
                  <Typography variant="body2">
                    I have read all the information above and agree to using the service.
                  </Typography>
                }
              />
              {renderCheckBox()}
              <Button fullWidth size="large" variant="contained" onClick={onExit} className="mt-5" disabled={!isAccept}>
                Confirm
              </Button>
            </>
          ) : (
            <>
              {renderCheckBox()}
              <Button fullWidth onClick={onDismiss} className="mt-5">
                Close
              </Button>
            </>
          )}
        </Box>
      </Box>
    </ModalV2>
  )
}

export default DisclaimersModal
