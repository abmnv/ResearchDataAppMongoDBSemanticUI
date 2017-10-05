var React = require('react');
var ReactDOM = require('react-dom');
var {Router, Route, IndexRoute, hashHistory} = require('react-router');
import {Provider} from 'react-redux';

import * as actions from 'actions';
import Main from 'Main';
import Projects from 'Projects';
//import EditProjects from 'EditProjects';
import EditProjectContainer from 'EditProjectContainer';
import DetailedProject from 'DetailedProject';
import CreateProject from 'CreateProject';
import Login from 'Login';
import SignUp from 'SignUp';
import EnsureLoggedInContainer from 'EnsureLoggedInContainer';
import ManageProject from 'ManageProject';
import Users from 'Users';
//import 'semantic-ui-css/semantic.min.css';

var store = require('configureStore').configure();
var state = store.getState();
console.log('Init state:', state);

store.dispatch(actions.verifyAuth());
store.dispatch(actions.startAddState());

// var store = require('configureStore').configure();
store.subscribe(() => {
  var state = store.getState();
  console.log('New state:', state);
})

//load foundation
//require('style!css!foundation-sites/dist/foundation.min.css');
//$(document).foundation();

require('style!css!sass!ApplicationStyles');

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={Main}>
        <IndexRoute component={Projects}/>
        <Route path="/projects/:projectId" component={DetailedProject}/>
        <Route component={EnsureLoggedInContainer}>
          <Route path="/create-project" component={CreateProject}/>
          <Route path="/projects/:projectId/edit" component={EditProjectContainer}/>
          <Route path="/projects/:projectId/manage" component={ManageProject}/>
          <Route path="/users" component={Users}/>
        </Route>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
// <Route path="/edit-projects" component={Projects}/>
// <Route path="/login" component={Login}/>
// <Route path="/signup" component={SignUp}/>
//<Route path="data" component={Data}/>
