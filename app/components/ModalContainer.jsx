import React from 'react';
import {connect} from 'react-redux';

import LoginModal from 'LoginModal';
import SignUpModal from 'SignUpModal';

class ModalContainer extends React.Component {

  render () {
    const {currentModal} = this.props;
    console.log('currentModal:', currentModal);

    const renderModal = () => {
      switch(currentModal){
        case 'Login':
          return (<LoginModal/>);
        case 'SignUp':
          return (<SignUpModal/>);
        default:
          return null;
      }
    }

    return (
      <div>
        {renderModal()}
      </div>
    )
  }
}

export default connect(({currentModal}) => ({currentModal}))(ModalContainer);
