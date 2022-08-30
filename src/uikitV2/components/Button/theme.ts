import { ColorStyles } from '../../colors'
import { textStyle } from '../../text'
import { ButtonScales, ButtonVariants } from './types'

export const scaleVariants = {
  [ButtonScales.XS]: {
    height: '32px',
    padding: '7px 12px',
    // minWidth: "142px",
    ...textStyle.R_12B,
  },
  [ButtonScales.SM]: {
    height: '36px',
    padding: '0 16px',
    ...textStyle.R_12B,
  },
  [ButtonScales.MD]: {
    height: '40px',
    padding: '10px 12px',
    // minWidth: "186px",
    ...textStyle.R_14B,
  },
  [ButtonScales.LG]: {
    height: '48px',
    padding: '10px 12px',
    // minWidth: "186px",
    ...textStyle.R_16B,
  },
  [ButtonScales.ICON]: {
    height: '32px',
  },
}
export const styleVariants = {
  [ButtonVariants.RED]: {
    backgroundColor: ColorStyles.RED,
    color: ColorStyles.WHITE,
  },
  [ButtonVariants.BROWN]: {
    backgroundColor: ColorStyles.BROWN,
    color: ColorStyles.WHITE,
  },
  [ButtonVariants.DEEPBROWN]: {
    backgroundColor: ColorStyles.DEEPBROWN,
    color: ColorStyles.WHITE,
  },
  [ButtonVariants.LIGHTBROWN]: {
    backgroundColor: ColorStyles.LIGHTBROWN,
    color: ColorStyles.WHITE,
  },
  [ButtonVariants.LINE]: {
    backgroundColor: ColorStyles.WHITE,
    color: ColorStyles.DEEPGREY,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: ColorStyles.LIGHTGREY,
  },
  [ButtonVariants.TRANSPARENT]: {
    backgroundColor: 'transparent',
  },
  [ButtonVariants.YELLOW]: {
    backgroundColor: ColorStyles.YELLOW,
    color: ColorStyles.WHITE,
  },
  [ButtonVariants.BROWN30]: {
    backgroundColor: ColorStyles.BROWN_30,
    color: ColorStyles.WHITE_30,
  },

  [ButtonVariants.PRIMARY]: {
    backgroundColor: ColorStyles.RED,
    color: ColorStyles.WHITE,
  },
  [ButtonVariants.SECONDARY]: {
    backgroundColor: ColorStyles.BROWN,
    color: ColorStyles.WHITE,
  },
  [ButtonVariants.TERTIARY]: {
    backgroundColor: ColorStyles.DEEPBROWN,
    color: ColorStyles.WHITE,
  },

  [ButtonVariants.SUBTLE]: {
    backgroundColor: 'textSubtle',
    color: 'white',
  },
  [ButtonVariants.DANGER]: {
    backgroundColor: 'failure',
    color: 'white',
  },
  [ButtonVariants.SUCCESS]: {
    backgroundColor: 'success',
    color: 'white',
  },
  [ButtonVariants.TEXT]: {
    backgroundColor: 'transparent',
    color: 'textSubtle',
    boxShadow: 'none',
  },
}
