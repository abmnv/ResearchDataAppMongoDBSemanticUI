import React from 'react';
import {Link, IndexLink, hashHistory} from 'react-router';
import {connect} from 'react-redux';
import {Menu, Input} from 'semantic-ui-react';

import * as actions from 'actions';
import LoginModal from 'LoginModal';

class Nav extends React.Component {

  constructor(props){
    super(props);

    this.state = {};

    this.handleLogout = this.handleLogout.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleOpenLoginModal = () => {
    const {dispatch} = this.props;

    dispatch(actions.setCurrentModal('Login'));
  }

  handleSubmit (e) {
    e.preventDefault();

    var searchText = this.refs.projectName.value;

    var {dispatch} = this.props;

    this.refs.projectName.value = '';
    //console.log('Search text:', searchText);

    dispatch(actions.setSearchText(searchText));
  }

  handleLogout (e) {
    e.preventDefault();

    const {dispatch} = this.props;

    dispatch(actions.startLogout()).then(() => {
      hashHistory.push('/');
    });
  }

  handleMenuItemClick = (e, {name}) => {this.setState({activeItem: name})}

  render () {
    const {isAuth, role} = this.props;
    console.log('role:', role);
    const auth = isAuth ? (<Menu.Item onClick={this.handleLogout}>Logout</Menu.Item>) : (<Menu.Item onClick={this.handleOpenLoginModal}>Login</Menu.Item>);
    //const auth = isAuth ? (<Link activeClassName="active-link" onClick={this.handleLogout}>Logout</Link>) : (<Link activeClassName="active-link" to="/login">Login</Link>);
    //const auth = isAuth ? (<Link activeClassName="active-link" onClick={this.handleLogout}>Logout</Link>) : (<button className='login-button' onClick={this.handleOpenLoginModal}>Login</button>);
    const menu = () => {
      if(role === 'user' || role === null){
        return null;
      } else {
        return (
          <Menu.Menu position="left">
            <Menu.Item as={IndexLink}
              to="/"
              name="projects"
              active={activeItem === 'projects'}
              onClick={this.handleMenuItemClick}>
              Projects
            </Menu.Item>
            <Menu.Item as={Link}
              to="/create-project"
              name='create-project'
              active={activeItem === 'create-project'}
              onClick={this.handleMenuItemClick}>
              Create Project
            </Menu.Item>
            <Menu.Item as={Link}
              to="/edit-projects"
              name='edit-projects'
              active={activeItem === 'edit-projects'}
              onClick={this.handleMenuItemClick}>
              Edit Projects
            </Menu.Item>
          </Menu.Menu>
        )
      }
    }
    const {activeItem} = this.state;

    return (
      <Menu>
        <Menu.Item header fitted="vertically">
          <img src="/images/martinos-logo-square.png"/>
          Neuroimaging Archive
        </Menu.Item>
        {menu()}
        <Menu.Menu position="right">
          <Input icon='search' placeholder='Search projects...' />
        </Menu.Menu>
        {auth}
      </Menu>
    );
  }
}

export default connect(({auth: {isAuth, role}}) => ({isAuth, role}), null, null, {pure:false})(Nav);
//export default Nav;
// <div onClick={this.handleLogout}>
//   Logout
// </div>
// <li>
//   <input type="submit" className="button" value="Search"/>
// </li>
