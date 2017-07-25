import React from 'react';
import {connect} from 'react-redux';
import {Card, Label, Dropdown, Button} from 'semantic-ui-react';

import * as actions from 'actions';

class ManageProject extends React.Component {

  handleChange = (e, data) => {
    console.log('handleChange data:', data);
    const {dispatch, id} = this.props;

    dispatch(actions.startUpdateProjectManagers(id, data.value));
  }

  render () {
    const {managers, users} = this.props;
    console.log('users:', users);

    const options = users.map(({username}) => ({key: username, text: username, value: username}));
    const value = managers.map(m => m);

    return (
      <Card fluid>
        <Card.Content>
          <Card.Header>
            Managers
          </Card.Header>
          <Dropdown placeholder="Managers" className="medium-top-margin" fluid multiple selection options={options} value={value} onChange={this.handleChange}/>
          <div className="medium-top-margin">
            <Button primary floated="right" >Save</Button>
          </div>
        </Card.Content>
      </Card>
    )
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
  const {projects, users} = state;

  const {params: {projectId}} = ownProps;

  let currentProject;
  projects.forEach((project) => {
    if(project.id === projectId){
      //console.log('project:', project);
      currentProject = project;
    }
  });

  return {...currentProject, users};
})(ManageProject);

export default connect()(ManageProject);
