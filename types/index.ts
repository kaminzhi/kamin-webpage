export type WindowState = {
  isOpen: boolean;
  isMinimized: boolean;
  isActive: boolean;
  isVisible: boolean;
  position: number;
};

export interface WindowPaneProps {
  title: string;
  type: string;
  isMinimized: boolean;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  isActive: boolean;
  isVisible: boolean;
  position: number;
  isLoaded: boolean;
}

export interface TaskbarButtonProps {
  title: string;
  isActive: boolean;
  isOpen: boolean;
  onClick: () => void;
} 