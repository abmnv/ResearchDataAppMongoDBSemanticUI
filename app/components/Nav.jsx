import React from 'react';
import {Link, IndexLink, hashHistory} from 'react-router';
import {connect} from 'react-redux';
import {Menu, Input, Dropdown} from 'semantic-ui-react';

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
    const {isAuth, role, username, location} = this.props;
    // console.log('location:', location);

    const auth = () => {
      if(isAuth){
        return (
          <Dropdown text={username} simple item labeled >
            <Dropdown.Menu>
              <Dropdown.Item text="Logout" onClick={this.handleLogout}/>
            </Dropdown.Menu>
          </Dropdown>
        )
        // <Menu.Item>
        //   <b>{username}</b>
      // </Menu.Item>

        // text={username}
      }else{
        return (
          <Menu.Item onClick={this.handleOpenLoginModal}>Login</Menu.Item>
        )
      }
    }

    // isAuth ? (<Menu.Item onClick={this.handleLogout}>Logout</Menu.Item>) : (<Menu.Item onClick={this.handleOpenLoginModal}>Login</Menu.Item>);
    //const auth = isAuth ? (<Link activeClassName="active-link" onClick={this.handleLogout}>Logout</Link>) : (<Link activeClassName="active-link" to="/login">Login</Link>);
    //const auth = isAuth ? (<Link activeClassName="active-link" onClick={this.handleLogout}>Logout</Link>) : (<button className='login-button' onClick={this.handleOpenLoginModal}>Login</button>);
    const menu = () => {

      const addMenu = () => {
        let menu = [];
        if(role === 'manager' || role === 'admin'){
          menu.push(
            <Menu.Item key="create-project" as={Link}
              to="/create-project"
              name="create-project"
              active={activeItem === 'create-project'}
              onClick={this.handleMenuItemClick}>
              Create Project
            </Menu.Item>
          )


        }
        if(role === 'admin') {
          menu.push(
            <Menu.Item key="users" as={Link}
              to="/users"
              name="users"
              active={activeItem === 'users'}
              onClick={this.handleMenuItemClick}>
              Users
            </Menu.Item>
          )
        }

        return menu;
      }

      return (
        <Menu.Menu position="left">
          <Menu.Item as={IndexLink}
            to="/"
            name="projects"
            active={activeItem === 'projects'}
            onClick={this.handleMenuItemClick}>
            Projects
          </Menu.Item>
          {addMenu()}
        </Menu.Menu>
      )

        // <Menu.Item as={Link}
        //   to="/edit-projects"
        //   name='edit-projects'
        //   active={activeItem === 'edit-projects'}
        //   onClick={this.handleMenuItemClick}>
        //   Edit Projects
        // </Menu.Item>
        // <Menu.Item as={Link}
        //   to="/manage-project"
        //   name="manage-project"
        //   active={activeItem === "manage-project"}
        //   onClick={this.handleMenuItemClick}>
        //   Manage Project
        // </Menu.Item>

    }
    const {activeItem} = this.state;

    return (
      <Menu>
        <Menu.Item header fitted="vertically" as={Link} to="/">
          <img src="/images/martinos-logo-square.png"/>
          Neuroimaging Archive
        </Menu.Item>
        {menu()}
        <Menu.Menu position="right">
          <Input icon='search' placeholder='Search projects...' />
        </Menu.Menu>
        {auth()}
      </Menu>
    );
  }
}

export default connect(({auth: {isAuth, role, username}}) => ({isAuth, role, username}), null, null, {pure:false})(Nav);
//export default Nav;
// <div onClick={this.handleLogout}>
//   Logout
// </div>
// <li>
//   <input type="submit" className="button" value="Search"/>
// </li>
