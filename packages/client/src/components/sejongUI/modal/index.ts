import React from 'react';
import ModalBody from './Modal.tsx';
import ModalHeader from './ModalHeader.tsx';
import ModalButton from './ModalButton.tsx';
import ModalButtonContainer from './ModerButtonContainer.tsx';

interface IModal extends React.FC<React.ComponentProps<typeof ModalBody>> {
  Header: typeof ModalHeader;
  Button: typeof ModalButton;
  ButtonContainer: typeof ModalButtonContainer;
}

const Model = ModalBody as IModal;
Model.Header = ModalHeader;
Model.Button = ModalButton;
Model.ButtonContainer = ModalButtonContainer;

export default Model;
