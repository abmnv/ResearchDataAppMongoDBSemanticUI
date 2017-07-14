import React from 'react';
import {connect} from 'react-redux';
import {hashHistory, Link} from 'react-router';
import {Field, reduxForm} from 'redux-form';

import * as actions from 'actions';

const validate = (values) => {
  const errors = {};
  //console.log('Validate values:', values);

  if(!values.email){
    errors.email = 'Please enter email'
  }else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)){
    errors.email = 'Invalid email';
  }

  if(!values.password){
    errors.password = 'Please enter password'
  }

  return errors;
}

class Login extends React.Component {

  // constructor(props) {
  //   super(props);
  //
  //   this.handleLogin = this.handleLogin.bind(this);
  // }

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

  handleEmailPasswordLogin = (values) => {
    //console.log('handleEmailPasswordSubmit values:', values);
    const {dispatch} = this.props;
    dispatch(actions.startEmailPasswordLogin(values)).then(() => {
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
        <h4>Log in</h4>

        {this.renderAuthError()}

        <form onSubmit={this.props.handleSubmit(this.handleEmailPasswordLogin)}>
          <Field name="email" component={this.renderField} type="text" label="Email"/>
          <Field name="password" component={this.renderField} type="password" label="Password"/>
          <button type="submit" className="button">Login</button>
        </form>

        <Link to="/signup" activeClassName="active-link">Sign up here</Link>

        <h4>-or-</h4>
        <h4>
          Log in with GitHub account
        </h4>
        <button className="button" onClick={this.handleGithubLogin}>Login with GitHub</button>
      </div>
    )
  }
}

export default connect(({redirectUrl, auth}) => ({redirectUrl, auth}))(reduxForm({
  form: 'login',
  validate
})(Login));
//<label>{label}</label>
