import React from 'react';
import {connect} from 'react-redux';
import {Card, Label, Dropdown, Button, Header, Table} from 'semantic-ui-react';

import * as actions from 'actions';
import SpinningWheel from 'SpinningWheel';

class ManageProject extends React.Component {

  constructor (props) {
    super(props);

    const {DUARequests} = props;

    let DUARequestsStatus;
    if(DUARequests){
      DUARequestsStatus = DUARequests.map((req) => {
        return null;
      });
    }

    this.state = {
      updateIsLoading: false,
      managers: props.managers,
      allowedUsers: props.allowedUsers,
      DUARequestsStatus
    }
  }

  componentWillReceiveProps(nextProps) {

    const areArraysDifferent = (arr1, arr2) => {
      if(arr1.length !== arr2.length){
        return true;
      }

      for(let i = 0; i < arr1.length; i++){
        if(arr1[i] !== arr2[i]){
          return true
        }
      }

      return false;
    }

    if(this.props.isLoading && !nextProps.isLoading){
      const DUARequestsStatus = nextProps.DUARequests.map((req) => {
        return null;
      });

      this.setState({
        managers: nextProps.managers,
        allowedUsers: nextProps.allowedUsers,
        DUARequestsStatus
      });
    }

    //update allowedUsers only if arrays are different ie allowedUsers array changed in the
    //redux store
    if(!this.props.isLoading && areArraysDifferent(this.props.allowedUsers, nextProps.allowedUsers)){
      this.setState({
        allowedUsers: nextProps.allowedUsers
      });
    }

    if(!this.props.isLoading && areArraysDifferent(this.props.DUARequests, nextProps.DUARequests)){
      const DUARequestsStatus = nextProps.DUARequests.map((req) => {
        return null;
      });
      this.setState({
        DUARequestsStatus
      });
    }
  }

  handleChangeManagers = (e, {value}) => {
    //console.log('handleChange data:', data);

    this.setState({
      managers: value
    });
  }

  handleChangeAlowedUsers = (e, {value}) => {
    this.setState({
      allowedUsers: value
    });
  }

  handleChangeDUARequestStatus = (e, data) => {
    const {DUARequestsStatus} = this.state;

    const {name} = data;
    let status, i;
    [status, i] = name.split('-');

    DUARequestsStatus[i] = DUARequestsStatus[i] === status ? null : status;
    this.setState({
      DUARequestsStatus
    });
  }

  handleUpdate = () => {
    const {dispatch, id, DUARequests} = this.props;
    const {managers, allowedUsers, DUARequestsStatus} = this.state;
    const managersOld = this.props.managers;
    const allowedUsersOld = this.props.allowedUsers;

    this.setState({
      updateIsLoading: true
    });

    let seq = Promise.resolve();

    seq = seq.then(() => {
      if(managers !== managersOld){
        dispatch(actions.startUpdateProjectManagers(id, managers));
      }else{
        return Promise.resolve();
      }
    }).then(() => {
      if(allowedUsers !== allowedUsersOld){
        dispatch(actions.startUpdateAllowedUsers(id, allowedUsers));
      }else{
        return Promise.resolve();
      }
    });

    DUARequestsStatus.forEach((status, i) => {
      if(status === 'approve'){
        seq = seq.then(() => {
          const DUARequestId = DUARequests[i].id;
          dispatch(actions.startApproveDUARequest(id, DUARequestId));
        });
      }else if(status === 'reject'){
        seq = seq.then(() => {
          const DUARequestId = DUARequests[i].id;
          dispatch(actions.startRejectDUARequest(id, DUARequestId));

        });
      }
    });

    seq.then(() => {
      this.setState({
        updateIsLoading: false
      });
    });
  }

  render () {
    const {users, isLoading, DUARequests} = this.props;
    const {managers, allowedUsers, updateIsLoading, DUARequestsStatus} = this.state;
    console.log('DUARequestsStatus:', DUARequestsStatus);

    if(isLoading){
      return (<SpinningWheel/>)
    }else{
      const options = users.map(({username}) => ({key: username, text: username, value: username}));
      const managersValue = managers.map(m => m);
      const allowedUsersValue = allowedUsers.map(u => u);

      const DUARequestsTable = () => {
        const rows = DUARequests.map(({firstName, lastName, institution}, i) => {
          return (
            <Table.Row key={i}>
              <Table.Cell>Date</Table.Cell>
              <Table.Cell>{firstName}</Table.Cell>
              <Table.Cell>{lastName}</Table.Cell>
              <Table.Cell>{institution}</Table.Cell>
              <Table.Cell><div className="ui two buttons"><Button name={`reject-${i}`} basic={DUARequestsStatus[i] !== 'reject'} negative compact size="mini" onClick={this.handleChangeDUARequestStatus}>Reject</Button><Button name={`approve-${i}`} basic={DUARequestsStatus[i] !== 'approve'} compact size="mini" color="green" onClick={this.handleChangeDUARequestStatus}>Approve</Button></div></Table.Cell>
            </Table.Row>
          )
        });

        return (
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell>First name</Table.HeaderCell>
                <Table.HeaderCell>Last name</Table.HeaderCell>
                <Table.HeaderCell>Institution</Table.HeaderCell>
                <Table.HeaderCell>Action</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
            {rows}
            </Table.Body>
          </Table>
        );
      }

      return (
        <Card fluid>
          <Card.Content>
            <Card.Description>
              <Header as="h3">Managers</Header>
              <Dropdown placeholder="Managers" fluid multiple selection options={options} value={managersValue} onChange={this.handleChangeManagers}/>
              <Header as="h3">Allowed Users</Header>
              <Dropdown placeholder="Allowed Users" fluid multiple selection options={options} value={allowedUsersValue} onChange={this.handleChangeAlowedUsers}/>
              <Header as="h3">DUA Requests</Header>
              {DUARequestsTable()}
              <div className="medium-top-margin">
                <Button primary floated="right" onClick={this.handleUpdate} loading={updateIsLoading}>Save</Button>
              </div>
            </Card.Description>
          </Card.Content>
        </Card>
      )
    }

    // className="medium-top-margin"
    // <Card.Header>
    //   Allowed Users
    // </Card.Header>
    // <div style={{clear:"both"}}/>

    // <Card.Header>
    //   Managers
    // </Card.Header>
    // value={value}
    // className="small-top-margin"
    // <label className="bold label">Managers:</label>
    // <select name="managers" multiple="" className="ui fluid dropdown">
    //   <option key={-1} value="">Managers</option>
    //   {options}
    // </select>
  }
}

ManageProject = connect((state, ownProps) => {
  const {projects, users, isLoading} = state;

  const {params: {projectId}} = ownProps;

  let currentProject;
  projects.forEach((project) => {
    if(project.id === projectId){
      //console.log('project:', project);
      currentProject = project;
    }
  });

  return {...currentProject, users, isLoading};
})(ManageProject);

export default connect()(ManageProject);
