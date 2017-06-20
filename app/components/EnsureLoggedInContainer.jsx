import React from 'react';
import {hashHistory} from 'react-router';
import {connect} from 'react-redux';

import * as actions from 'actions';

var EnsureLoggedInContainer = React.createClass({

  componentWillMount () {
    const {auth, currentUrl, dispatch} = this.props;
    console.log('EnsureLoggedInContainer props:', this.props);

    if(!auth.isAuth){
      dispatch(actions.setCurrentModal('Login'));
      // dispatch(actions.setRedirectUrl(currentUrl)).then(() => {
      //   hashHistory.push('/login');
      // });
    }
    // else if(auth.role !== 'admin'){
    //   hashHistory.push('/');
    // }
  },

  render () {
    const {auth: {isAuth, role}} = this.props;

    if(isAuth && role === 'admin'){
      return (
        this.props.children
      )
    }else if (isAuth && role !== 'admin'){
      return (
        <div className="callout callout-auth login-error">
          <h4>You do not have privilege to modify data. Please, contact your administrator.</h4>
        </div>
      );
    }else{
      return (
        <div>
        </div>
      );
    }
  }

});

export default connect((state, ownProps) => {
  return {
    auth: state.auth,
    currentUrl: ownProps.location.pathname
  }
})(EnsureLoggedInContainer);
