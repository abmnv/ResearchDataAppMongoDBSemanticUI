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

    let managers, admins;
    if(users){
      managers = users.filter((user) => (user.role === 'manager')).map(({username}) => username);
      admins = users.filter((user) => (user.role === 'admin')).map(({username}) => username);
    }

    this.state = {
      managers,
      admins,
      uploadIsLoading: false
    };

    this.handleChangeSelection = this.handleChangeSelection.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  componentWillReceiveProps (nextProps) {

    if(this.props.isLoading && !nextProps.isLoading){
      const {users} = nextProps;

      const managers = users.filter((user) => (user.role === 'manager')).map(({username}) => username);
      const admins = users.filter((user) => (user.role === 'admin')).map(({username}) => username);

      this.setState({
        managers,
        admins
      });
    }
  }

  handleChangeSelection (e, {name, value}) {
    //console.log('handleChange data:', data);

    this.setState({
      [name]: value
    });
  }

  handleUpdate = () => {
    const {dispatch, users} = this.props;
    const {managers, admins} = this.state;

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
      newUsers[user.username] = {...user, role: 'user'};
    });

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
      if(role !== newRole){
        seq = seq.then(() => {
          return dispatch(actions.startUpdateUserRole(id, newRole));
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

    const managers = users.filter((user) => (user.role === 'manager')).map(({username}) => username);
    const admins = users.filter((user) => (user.role === 'admin')).map(({username}) => username);

    this.setState({
      managers,
      admins
    });
  }

  render () {
    const {users, isLoading} = this.props;
    const {managers, admins, updateIsLoading} = this.state;


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

      return (
        <Card fluid>
          <Card.Content>
            <Card.Description>
              <Header as="h3">Managers</Header>
              <Dropdown name="managers" placeholder="Managers" fluid multiple selection options={optionsManagers} value={managers} onChange={this.handleChangeSelection}/>
              <Header as="h3">Admins</Header>
              <Dropdown name="admins" placeholder="Admins" fluid multiple selection options={optionsAdmins} value={admins} onChange={this.handleChangeSelection}/>
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
