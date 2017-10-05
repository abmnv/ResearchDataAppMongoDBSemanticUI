import React from 'react';
import {connect} from 'react-redux';
import SpinningWheel from 'SpinningWheel';
import {Card, Label, Dropdown, Button, Header, Table} from 'semantic-ui-react';
import _ from 'lodash';

import * as actions from 'actions';

class Users extends React.Component {

  constructor (props) {
    super(props);

    const {users} = props;

    let managers, admins, selectedUsers;
    if(users){
      selectedUsers = users.filter((user) => (user.role === 'user')).map(({username}) => username);
      managers = users.filter((user) => (user.role === 'manager')).map(({username}) => username);
      admins = users.filter((user) => (user.role === 'admin')).map(({username}) => username);
    }

    this.state = {
      managers,
      admins,
      selectedUsers,
      uploadIsLoading: false
    };

    this.handleChangeSelection = this.handleChangeSelection.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  componentWillReceiveProps (nextProps) {
    const {users} = nextProps;

    if(this.props.isLoading && !nextProps.isLoading){
      const managers = users.filter((user) => (user.role === 'manager')).map(({username}) => username);
      const admins = users.filter((user) => (user.role === 'admin')).map(({username}) => username);
      const selectedUsers = users.filter((user) => (user.role === 'user')).map(({username}) => username);

      this.setState({
        managers,
        admins,
        selectedUsers
      });
    }
  }

  handleChangeSelection (e, {name, value}) {
    //console.log('handleChange data:', data);
    const {managers, admins, selectedUsers} = this.state;
    console.log(name, value);

    let newManagers = managers;
    let newAdmins = admins;
    let newSelectedUsers = selectedUsers;

    if(name === 'selectedUsers'){
      newSelectedUsers = value;
      if(value.length > selectedUsers.length){
        const newUsername = value[value.length - 1];
        newManagers = managers.filter((username) => {
          return username !== newUsername;
        });
        newAdmins = admins.filter((username) => {
          return username !== newUsername;
        });
      }
    }else if(name === 'managers'){
      newManagers = value;
      if(value.length > managers.length){
        const newUsername = value[value.length - 1];
        newSelectedUsers = selectedUsers.filter((username) => {
          return username !== newUsername;
        });
        newAdmins = admins.filter((username) => {
          return username !== newUsername;
        });
      }
    }else if(name === 'admins'){
      newAdmins = value;
      if(value.length > admins.length){
        const newUsername = value[value.length - 1];
        newSelectedUsers = selectedUsers.filter((username) => {
          return username !== newUsername;
        });
        newManagers = managers.filter((username) => {
          return username !== newUsername;
        });
      }
    }

    console.log('newSelectedUsers:', newSelectedUsers);
    console.log('newManagers:', newManagers);
    console.log('newAdmins:', newAdmins);

    this.setState({
      selectedUsers: newSelectedUsers,
      managers: newManagers,
      admins: newAdmins
    });
  }

  handleUpdate = () => {
    const {dispatch, users} = this.props;
    const {managers, admins, selectedUsers} = this.state;

    const managersOld = users.filter((user) => (user.role === 'manager')).map(({username}) => username);
    const adminsOld = users.filter((user) => (user.role === 'admin')).map(({username}) => username);

    this.setState({
      updateIsLoading: true
    });

    //newUsers is an array for objects
    // let newUsers = users.map((user) => {
    //   return {...user, role: 'user'}
    // });

    const newUsers = {};
    users.forEach((user) => {
      newUsers[user.username] = {...user, role: null};
    });

    selectedUsers.forEach((username) => {
      newUsers[username].role = 'user';
    })

    managers.forEach((username) => {
      newUsers[username].role = 'manager';
    });

    admins.forEach((username) => {
      newUsers[username].role = 'admin';
    });

    console.log('newUsers:', newUsers);
    let seq = Promise.resolve();

    users.forEach((user) => {
      const {role, username, id} = user;
      const newRole = newUsers[username].role;
      if(!newRole){
        seq = seq.then(() => {
          return dispatch(actions.startDeleteUser(id, username));
        });
      }else if(role !== newRole){
        seq = seq.then(() => {
          return dispatch(actions.startUpdateUserRole(id, username, newRole));
        });
      }
    });

    seq.then(() => {
      this.setState({
        updateIsLoading: false
      });
    });

    //   if(!_.isEqual(managers.sort(), managersOld.sort())){
    //     console.log('managers are different');
    //     return dispatch(actions.startUpdateManagers(managers));
    //   }else{
    //     console.log('managers are the same');
    //     return Promise.resolve();
    //   }
    // }).then(() => {
    //   if(!_.isEqual(admins.sort(), adminsOld.sort())){
    //     return dispatch(actions.startUpdateAdmins(admins));
    //   }else{
    //     return Promise.resolve();
    //   }
    // }).then(() => {
    //   this.setState({
    //     updateIsLoading: false
    //   })
    // });
  }

  handleReset () {
    const {users} = this.props;

    const selectedUsers = users.filter((user) => (user.role === 'user')).map(({username}) => username);
    const managers = users.filter((user) => (user.role === 'manager')).map(({username}) => username);
    const admins = users.filter((user) => (user.role === 'admin')).map(({username}) => username);

    this.setState({
      selectedUsers,
      managers,
      admins
    });
  }

  render () {
    const {users, isLoading} = this.props;
    const {managers, admins, updateIsLoading, selectedUsers} = this.state;

    if(isLoading){
      return (
        <SpinningWheel/>
      )
    }else{

      const options = users.map(({username}) => ({key: username, text: username, value: username}));

      const optionsManagers = options.filter(({value}) => {
        let keep = true;
        admins.forEach((admin) => {
          if(admin === value){
            keep = false;
          }
        });
        return keep;
      });

      const optionsAdmins = options.filter(({value}) => {
        let keep = true;
        managers.forEach((manager) => {
          if(manager === value){
            keep = false;
          }
        });
        return keep;
      });

      const optionsUsers = options.filter(({value}) => {
        let keep = true;
        admins.forEach((admin) => {
          if(admin === value){
            keep = false;
          }
        });
        managers.forEach((manager) => {
          if(manager === value){
            keep = false;
          }
        });
        return keep;
      });

      return (
        <Card fluid>
          <Card.Content>
            <Card.Description>
              <Header as="h3">Users</Header>
              <Dropdown name="selectedUsers" placeholder="Users" fluid multiple selection options={options} value={selectedUsers} onChange={this.handleChangeSelection}/>
              <Header as="h3">Managers</Header>
              <Dropdown name="managers" placeholder="Managers" fluid multiple selection options={options} value={managers} onChange={this.handleChangeSelection}/>
              <Header as="h3">Admins</Header>
              <Dropdown name="admins" placeholder="Admins" fluid multiple selection options={options} value={admins} onChange={this.handleChangeSelection}/>
              <div className="large-top-margin">
                <Button primary floated="right" onClick={this.handleUpdate} loading={updateIsLoading}>Save</Button>
                <Button negative floated="right" onClick={this.handleReset}>Reset</Button>
              </div>
            </Card.Description>
          </Card.Content>
        </Card>
      )
    }
  }
}

export default connect(({users, isLoading}) => ({users, isLoading}))(Users);
