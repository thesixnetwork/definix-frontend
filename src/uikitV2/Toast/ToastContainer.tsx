import React from 'react'
import { TransitionGroup } from 'react-transition-group'
import styled from 'styled-components'
import Toast from './Toast'
import { ToastContainerProps } from './types'
import { pxToRem } from '../mixin'
import { mediaQueries } from '../base'
const NAV_HEIGHT_PC = 80
const NAV_HEIGHT_MOBILE = 56

const INNER_MARGIN_PC = 60
const INNER_MARGIN_MOBILE = 20

const ZINDEX = 1000
const TOP_POSITION = 80 // Initial position from the top

// display: flex;
// flex-direction: row-reverse;
const StyledToastContainer = styled.div`
  .toast-group {
    position: fixed;
    top: 0;
    left: 0;
    width: calc(100% - ${INNER_MARGIN_PC * 2}px);
    margin: ${NAV_HEIGHT_PC}px ${INNER_MARGIN_PC}px 0;
    z-index: 99;
  }

  .toast {
    position: absolute;
    top: 0;
    right: 0;

    padding-left: 16px;
    transition: transform 250ms, opacity 250ms ease-in;

    &.enter,
    &.appear {
      transform: translateX(50%);
      opacity: 0.01;
    }

    &.enter.enter-active,
    &.appear.appear-active,
    &.enter-done {
      opacity: 1;
      transform: translateX(0);
    }

    &.exit {
      opacity: 1;
    }

    &.exit.exit-active {
      opacity: 0.01;
      transition: opacity 250ms ease-out;
    }

    &:nth-child(2) {
      &.enter.enter-active,
      &.appear.appear-active,
      &.enter-done {
        opacity: 1;
        transform: translateX(-100%);
      }
    }

    &:nth-child(3) {
      &.enter.enter-active,
      &.appear.appear-active,
      &.enter-done {
        opacity: 0;
        transform: translateX(-200%);
      }
    }
  }

  ${mediaQueries.mobile} {
    .toast-group {
      width: calc(100% - ${INNER_MARGIN_MOBILE * 2}px);
      margin: ${NAV_HEIGHT_MOBILE}px ${INNER_MARGIN_MOBILE}px 0;
    }

    .toast {
      padding-left: 0;
      padding-top: 16px;
      transition: opacity 250ms ease-in, transform 250ms;

      &.enter {
        transform: translateX(0);
      }

      &.enter.enter-active,
      &.appear.appear-active {
        transition: opacity 250ms ease-in;
      }

      &.enter-done {
        transform: translateX(0);
      }

      &:nth-child(2) {
        &.enter.enter-active,
        &.appear.appear-active,
        &.enter-done {
          opacity: 1;
          transform: translateX(0) translateY(100%);
        }
      }
      &:nth-child(3) {
        &.enter.enter-active,
        &.appear.appear-active,
        &.enter-done {
          opacity: 0;
          transform: translateX(0) translateY(200%);
        }
      }
    }
  }
`

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove, ttl = 3000, stackSpacing = 24 }) => {
  return (
    <StyledToastContainer>
      <TransitionGroup className="toast-group">
        {toasts.map((toast, index) => {
          const zIndex = (ZINDEX - index).toString()
          return <Toast key={toast.id} toast={toast} onRemove={onRemove} ttl={ttl} style={{ zIndex }} />
        })}
      </TransitionGroup>
    </StyledToastContainer>
  )
}

export default ToastContainer
