export type WindowState = {
  isOpen: boolean;
  isActive: boolean;
};

export interface WindowPaneProps {
  title: string;
  type: string;
  onClose: () => void;
  isActive: boolean;
  isLoaded: boolean;
}

export interface TaskbarButtonProps {
  title: string;
  isActive: boolean;
  isOpen: boolean;
  onClick: () => void;
} 