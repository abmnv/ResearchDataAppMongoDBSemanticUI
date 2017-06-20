import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import * as actions from 'actions';
import ProjectList from 'ProjectList';
import {Button} from 'semantic-ui-react';

class Projects extends React.Component {

  constructor(props) {
    super(props);
  }

  render () {
    const {params, location} = this.props;
    //console.log('Projects props:', this.props);
    const editModeStatus = location.pathname.indexOf('/edit-projects') > -1;

    const createProjectButton = () => {
      if(editModeStatus){
        return (
          <div style={{marginTop:"16px"}}>
            <Button as={Link} to="/create-project" primary fluid>
              Create Project
            </Button>
          </div>
        )
      }
      return null;
    }

    return (
      <div>
        <ProjectList editModeStatus={editModeStatus}/>
        {createProjectButton()}
      </div>
    )
  }
};

export default connect()(Projects);
