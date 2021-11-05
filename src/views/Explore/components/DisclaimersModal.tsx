import React, { useEffect, useState } from 'react'
import { Box, Button, Checkbox, CheckboxLabel, Text, Modal } from 'definixswap-uikit'
import styled from 'styled-components'

const ScrollArea = styled(Box)`
  border: 1px solid rgba(224, 224, 224, 0.5);
  height: 328px;
  overflow: scroll;
  border-radius: 8px;
  padding-bottom: 0;
`

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
  return (
    <Modal title="Disclaimers" hideCloseButton mobileFull onDismiss={onDismiss}>
      <Box maxWidth="438px">
        <ScrollArea textStyle="R_12R" className="px-s16 pt-s16">
          <Text className="mb-3">
            Definix is solely a marketplace (the “Marketplace”) which provides a tool. The Rebalancing Farm (the “Farm”)
            has been managed by a 3rd party called “Enigma” (the “Manager”). The information about the Farm has been
            displayed on Definix website (this “Website”) for informational purposes only in relation to a potential
            opportunity available in the Farm.
          </Text>

          <Text className="mb-3">
            No advice on investment; Risk of Loss
            <br />
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
          </Text>

          <Text className="mb-3">
            Performance Disclosures
            <br />
            Performance information is provided for informational purposes only. Past performance of the Farm and/or the
            Manager is not necessarily indicative of future results, and there can be no assurance that any projections,
            targets or estimates of future performance will be realized. Future performance of the Farm may vary
            substantially from the performance provided on this Website. An investor may lose all or a substantial part
            of its investment in the Farm.
          </Text>

          <Text>
            The information on this Website may be subject to change at any time without prior notice to the user.
          </Text>
        </ScrollArea>

        {isConfirm ? (
          <div className="mt-s24 flex flex-column">
            <CheckboxLabel
              control={
                <Checkbox
                  onChange={() => {
                    setIsAccept(!isAccept)
                  }}
                  checked={isAccept}
                />
              }
            >
              <Text textStyle="R_14R">I have read all the information above and agree to using the service.</Text>
            </CheckboxLabel>
            <Button onClick={onExit} scale="36" className="mt-s24" disabled={!isAccept}>
              Confirm
            </Button>
          </div>
        ) : (
          <Button onClick={onDismiss} scale="36" className="mt-s24" width="100%">
            Close
          </Button>
        )}

        <CheckboxLabel
          control={<Checkbox onChange={onCheckBoxChange} checked={isSkip} scale="sm" variantColor="lightbrown" />}
          className="mt-s32"
        >
          <Text textStyle="R_12R" color="mediumgrey">
            Do not show this message for 14 days
          </Text>
        </CheckboxLabel>
      </Box>
    </Modal>
  )
}

export default DisclaimersModal
