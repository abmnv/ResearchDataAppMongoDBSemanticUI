import React from 'react';
import {Modal, Header, Button, Icon} from 'semantic-ui-react';


class ConfirmDeleteProjectModal extends React.Component {

  constructor(props){

    super(props);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleConfirmDelete = this.handleConfirmDelete.bind(this);
  }

  handleCloseModal () {
    this.props.onClose();
  }

  handleConfirmDelete () {
    this.props.onConfirm();
  }

  render () {
    const {open} = this.props;
    console.log('open:', open);

    return (
      <Modal basic size="tiny" open={open} onClose={this.handleCloseModal}>
        <Header>
          Confirm Delete Project
        </Header>
        <Modal.Content color="red">
          Do you really want to delete this project? This can't be undone.
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" inverted onClick={this.handleCloseModal}>
            <Icon name="remove"/>No
          </Button>
          <Button color="green" inverted onClick={this.handleConfirmDelete}>
            <Icon name="checkmark"/>Yes
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

export default ConfirmDeleteProjectModal;
