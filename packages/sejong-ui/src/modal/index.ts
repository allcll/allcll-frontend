import ModalBody from './Modal.tsx';
import ModalHeader from './ModalHeader.tsx';
import ModalButton from './ModalButton.tsx';
import ModalButtonContainer from './ModalButtonContainer.tsx';

const Model = Object.assign(ModalBody, {
  Header: ModalHeader,
  Button: ModalButton,
  ButtonContainer: ModalButtonContainer,
});

export default Model;
