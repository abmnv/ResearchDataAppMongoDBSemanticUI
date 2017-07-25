import React from 'react';
//import Modal from 'react-modal';
import {connect} from 'react-redux';
import {hashHistory, Link} from 'react-router';
import {Field, reduxForm} from 'redux-form';
import {Modal, Form, Divider, Button, Message} from 'semantic-ui-react';

import * as actions from 'actions';
import SignUpModal from 'SignUpModal';

const validate = (values) => {
  const errors = {};
  console.log('Validate values:', values);

  if(!values.username){
    errors.username = 'Please enter username'
  }

  // if(!values.email){
  //   errors.email = 'Please enter email'
  // }else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)){
  //   errors.email = 'Invalid email';
  // }

  if(!values.password){
    errors.password = 'Please enter password'
  }

  return errors;
}

class LoginModal extends React.Component {

  constructor(props){
    super(props);

    // this.state = {
    //   modalIsOpen: false
    // };

    //this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleOpenSignUpModal = this.handleOpenSignUpModal.bind(this);
  }

  // handleOpenModal () {
  //   this.setState({
  //     modalIsOpen: true
  //   })
  // }

  handleCloseModal () {
    const {dispatch} = this.props;

    dispatch(actions.setCurrentModal(null));
    hashHistory.push('/');
    // this.setState({
    //   modalIsOpen: false
    // })
  }

  handleOpenSignUpModal () {
    const {dispatch} = this.props;

    dispatch(actions.setCurrentModal('SignUp'));

    // this.setState({
    //   modalIsOpen: false
    // })
  }

  componentWillUnmount () {
    const {dispatch} = this.props;

    if(this.props.auth.error){
      dispatch(actions.authError(null));
    }
  }

  handleGithubLogin = () => {
    const {dispatch, redirectUrl} = this.props;

    dispatch(actions.startGitHubLogin()).then(() => {
      return dispatch(actions.setRedirectUrl('/'));
    }).then(() => {
      hashHistory.push(redirectUrl);
    });
  }

  handleUsernamePasswordLogin = (values) => {
    console.log('handleEmailPasswordSubmit values:', values);
    const {dispatch, change, untouch} = this.props;
    dispatch(actions.startUsernamePasswordLogin(values.username, values.password)).then(() => {
      dispatch(actions.setCurrentModal(null));
      dispatch(actions.startAddUsers());
      // dispatch(actions.setRedirectUrl('/'));
      // hashHistory.push(this.props.redirectUrl);
    }).catch(() => {
      dispatch(change('password', null));
      dispatch(untouch('password'));
    });
  }

  renderField = ({input, label, type, meta: {touched, error}}) => {
    console.log('renderField touched, error:', touched, error);
    return (
      <Form.Input {...input} placeholder={label} type={type} error={touched && error}/>
    )
    //{touched && error && <Message negative>{error}</Message>}

    // <fieldset>
    //   <div>
    //     <input className="modal-input" {...input} placeholder={label} type={type}/>
    //     {touched && error && <div className="login-error">{error}</div>}
    //   </div>
    // </fieldset>
  }

  renderAuthError () {
    if(this.props.auth.error){
      return (
        <Message error content={this.props.auth.error}/>
      )
      // <div className="login-error">
      //   {this.props.auth.error}
      // </div>
    }else{
      return null;
    }
  }

  render () {
    //const {modalIsOpen} = this.state;

    // const customStyles = {
    //   content : {
    //     top                   : '50%',
    //     left                  : '50%',
    //     right                 : 'auto',
    //     bottom                : 'auto',
    //     marginRight           : '-50%',
    //     transform             : 'translate(-50%, -50%)',
    //     borderRadius          : '5px',
    //     padding               : '25px'
    //   }
    // };

    return (
      <Modal size="tiny" open onClose={this.handleCloseModal}>
        <Modal.Content>
          {this.renderAuthError()}
          <Form onSubmit={this.props.handleSubmit(this.handleUsernamePasswordLogin)}>
            <Field name="username" component={this.renderField} type="text" label="Username"/>
            <Field name="password" component={this.renderField} type="password" label="Password"/>
            <Form.Button fluid primary>Login</Form.Button>
            <Divider horizontal>OR</Divider>
            <Form.Button fluid basic color={"red"} onClick={this.handleOpenSignUpModal}>Sign Up</Form.Button>
          </Form>
        </Modal.Content>
      </Modal>
    )
    // <div>
    //   <Modal isOpen={true} style={customStyles} onRequestClose={this.handleCloseModal}>
    //     <div>
    //       {this.renderAuthError()}
    //
    //       <form onSubmit={this.props.handleSubmit(this.handleEmailPasswordLogin)}>
    //         <Field name="email" component={this.renderField} type="text" label="Email"/>
    //         <Field name="password" component={this.renderField} type="password" label="Password"/>
    //         <button type="submit" className="button expanded radius">Login</button>
    //       </form>
    //
    //       <div className="center-text-align">
    //         <button className="signup-button" onClick={this.handleOpenSignUpModal}>Sign up for a new account</button>
    //       </div>
    //     </div>
    //   </Modal>
    // </div>
  }
}

export default connect(({redirectUrl, auth}) => ({redirectUrl, auth}))(reduxForm({
  form: 'login',
  validate
})(LoginModal));
// <Link to="/signup" activeClassName="active-link">Sign up here</Link>
