import React from 'react';
import {connect} from 'react-redux';
import {hashHistory, Link} from 'react-router';
import {Field, reduxForm} from 'redux-form';

import * as actions from 'actions';

const validate = (values) => {
  const errors = {};
  console.log('Validate values:', values);

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


class SignUp extends React.Component {

  componentWillUnmount () {
    const {dispatch} = this.props;
    
    if(this.props.auth.error){
      dispatch(actions.authError(null));
    }
  }

  handleSignUp = (values) => {
    //console.log('handleEmailPasswordSubmit values:', values);
    const {dispatch} = this.props;
    dispatch(actions.startSignUpUser(values)).then(() => {
      if(this.props.auth.isAuth){
        dispatch(actions.setRedirectUrl('/'));
        hashHistory.push(this.props.redirectUrl);
      }
    });
  }

  renderField = ({input, label, type, meta: {touched, error}}) => {
    //console.log('renderField touched, error:', touched, error);
    return (
      <fieldset>

        <div>
          <input {...input} placeholder={label} type={type}/>
          {touched && error && <div className="login-error">{error}</div>}
        </div>
      </fieldset>
    )
  }

  renderAuthError () {
    if(this.props.auth.error){
      return (
        <div className="login-error">
          {this.props.auth.error}
        </div>)
    }else{
      return null;
    }
  }

  render () {
    return (
      <div className="callout callout-auth">
        <h4>Sign up for account</h4>

        {this.renderAuthError()}

        <form onSubmit={this.props.handleSubmit(this.handleSignUp)}>
          <Field name="email" component={this.renderField} type="text" label="Email"/>
          <Field name="password" component={this.renderField} type="password" label="Password"/>
          <Field name="passwordConfirmation" component={this.renderField} type="password" label="Password Confirmation"/>

          <button type="submit" className="button">Login</button>
        </form>
      </div>
    )
  }
}

export default connect(({redirectUrl, auth}) => ({redirectUrl, auth}))(reduxForm({
  form: 'signup',
  validate
})(SignUp));
//<label>{label}</label>
