import React from 'react';
import {connect} from 'react-redux';
import {hashHistory, Link} from 'react-router';
import {Field, reduxForm} from 'redux-form';
import {Modal, Form, Divider, Button, Message} from 'semantic-ui-react';

import * as actions from 'actions';

const validate = (values) => {
  const errors = {};
  console.log('Validate values:', values);

  if(!values.username){
    errors.username = 'Please enter username';
  }

  if(!values.email){
    errors.email = 'Please enter email'
  }else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)){
    errors.email = 'Invalid email';
  }

  if(!values.password){
    errors.password = 'Please enter password'
  }

  if(!values.passwordConfirmation){
    errors.passwordConfirmation = 'Please enter password';
  }

  if(values.password !== values.passwordConfirmation){
    errors.passwordConfirmation = 'Passwords do not match';
  }

  return errors;
}


class SignUpModal extends React.Component {

  constructor(props){
    super(props);

    // this.state = {
    //   modalIsOpen: false
    // }

    // this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  // handleOpenModal () {
  //   //Close parent modal
  //   this.setState({
  //     modalIsOpen: true
  //   });
  // }

  handleCloseModal () {
    const {dispatch} = this.props;
    dispatch(actions.setCurrentModal(null));
    hashHistory.push('/');
    // this.setState({
    //   modalIsOpen: false
    // });
  }

  componentWillUnmount () {
    const {dispatch} = this.props;

    if(this.props.auth.error){
      dispatch(actions.authError(null));
    }
  }

  handleSignUp = ({username, email, password}) => {
    //console.log('handleEmailPasswordSubmit values:', values);
    const {dispatch, change, untouch} = this.props;
    dispatch(actions.startSignUpUser(username, email, password)).then(() => {
      dispatch(actions.setCurrentModal(null));
      // dispatch(actions.setRedirectUrl('/'));
      // hashHistory.push(this.props.redirectUrl);
    }).catch(() => {
      dispatch(change('password', null));
      dispatch(untouch('password'));
      disptach(change('passworConfirmation', null));
      dispatch(untouch('password'));
    });
  }

  renderField = ({input, label, type, meta: {touched, error}}) => {
    //console.log('renderField touched, error:', touched, error);
    return (
      <Form.Input {...input} placeholder={label} type={type} error={touched && error}/>
    )
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
    return (
      <div>
        <Modal open size="tiny" onClose={this.handleCloseModal}>
          <Modal.Content>
            {this.renderAuthError()}
            <Form onSubmit={this.props.handleSubmit(this.handleSignUp)}>
              <Field name="username" component={this.renderField} type="text" label="Username"/>
              <Field name="email" component={this.renderField} type="text" label="Email"/>
              <Field name="password" component={this.renderField} type="password" label="Password"/>
              <Field name="passwordConfirmation" component={this.renderField} type="password" label="Password Confirmation"/>
              <Form.Button fluid primary>Sign Up</Form.Button>
            </Form>
          </Modal.Content>
        </Modal>
      </div>
    )
  }
}

export default connect(({redirectUrl, auth}) => ({redirectUrl, auth}))(reduxForm({
  form: 'signup',
  validate
})(SignUpModal));
//<label>{label}</label>
//<h4 className="center-text-align">Sign up</h4>
