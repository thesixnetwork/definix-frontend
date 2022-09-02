export interface ModalTheme {
  background: string;
}

export type Handler = (props?: any) => void;

export interface InjectedProps {
  onDismiss?: Handler;
}

export interface ModalProps extends InjectedProps {
  title?: string | React.ReactElement;
  hideHeader?: boolean;
  hideCloseButton?: boolean;
  onBack?: () => void;
  mobileFull?: boolean;
  noPadding?: boolean;
  maxWidth?: string;
}
