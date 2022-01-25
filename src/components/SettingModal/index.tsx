import React from "react";
import { Modal, ModalBody } from "@fingerlabs/definixswap-uikit-v2";
import SlippageToleranceSetting from "./SlippageToleranceSettings";
import TransactionDeadlineSetting from "./TransactionDeadlineSetting";
import { useTranslation } from "react-i18next";

const defaultOnDismiss = () => null;

const SettingsModal: React.FC<{ onDismiss?: () => void; }> = (props) => {
  const { t } = useTranslation();
  const { onDismiss = defaultOnDismiss } = props;
  return (
    <Modal title={t('Setting')} onDismiss={onDismiss}>
      <ModalBody isBody>
        <SlippageToleranceSetting />
        <TransactionDeadlineSetting />
      </ModalBody>
    </Modal>
  );
};

export default SettingsModal;
