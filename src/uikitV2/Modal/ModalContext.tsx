import React, { createContext, useState } from "react";
import styled from "styled-components";
import Overlay from "../components/Overlay/Overlay";
import theme from "../base";
import { Handler } from "./types";

interface ModalsContext {
  onPresent: (node: React.ReactNode, key?: string) => void;
  onDismiss: Handler;
  setCloseOnOverlayClick: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: ${({ theme }) => theme.zIndices.modal - 1};
  overflow-y: auto;
`;

export const Context = createContext<ModalsContext>({
  onPresent: () => null,
  onDismiss: () => null,
  setCloseOnOverlayClick: () => true,
});

const ModalProvider: React.FC = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalNode, setModalNode] = useState<React.ReactNode>();
  const [closeOnOverlayClick, setCloseOnOverlayClick] = useState(false);

  const handlePresent = (node: React.ReactNode) => {
    setModalNode(node);
    setIsOpen(true);
  };

  const handleDismiss = () => {
    setModalNode(undefined);
    setIsOpen(false);
  };

  const handleOverlayDismiss = () => {
    // if (closeOnOverlayClick) {
    //   handleDismiss();
    // }
  };

  return (
    <Context.Provider
      value={{
        onPresent: handlePresent,
        onDismiss: handleDismiss,
        setCloseOnOverlayClick,
      }}
    >
      {isOpen && (
        <ModalWrapper>
          <Overlay show zIndex={theme.zIndices.modal - 1} onClick={handleOverlayDismiss} />
          {React.isValidElement(modalNode) &&
            React.cloneElement(modalNode, {
              onDismiss: handleDismiss,
            })}
        </ModalWrapper>
      )}
      {children}
    </Context.Provider>
  );
};

export default ModalProvider;
