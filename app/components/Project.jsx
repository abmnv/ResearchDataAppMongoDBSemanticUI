import React from 'react';
import {connect} from 'react-redux';
import {firebaseRef, firebaseStorageRef} from 'app/firebase';
import {Link, hashHistory} from 'react-router';
import moment from 'moment';
import {Card, Image, Grid, Button, Header} from 'semantic-ui-react';

import * as actions from 'actions';
import ProjectControlBar from 'ProjectControlBar';

class Project extends React.Component {

  constructor(props){
    super(props);

    this.handleDeleteProject = this.handleDeleteProject.bind(this);
    this.handleEditProject = this.handleEditProject.bind(this);
  }
  // handleSetActiveProject () {
  //   var {id, dispatch} = this.props;
  //   dispatch(actions.setActiveProject(id));
  // },

  handleDeleteProject () {
    var {dispatch, id, files} = this.props;
    dispatch(actions.startDeleteProject(id, files));
  }

  handleEditProject () {
    //this.handleSetActiveProject();
    var {id} = this.props;
    hashHistory.push('/edit-projects/' + id);
  }

  render () {
    var {title, createdAt, id, description, logoImage, editModeStatus} = this.props;
    var briefDescription = description.length < 120 ? description : description.slice(0, 120) + '...';

    const projectControlBar = () => {
      if(editModeStatus){
        return (
          <Card.Content extra>
            <div className='ui two buttons'>
              <Button negative basic color="red" size="tiny" onClick={this.handleDeleteProject}>Delete</Button>
              <Button primary basic color="blue" size="tiny" onClick={this.handleEditProject}>Edit</Button>
            </div>
          </Card.Content>
        )
      }
      return null;
    }

    return (
      <Card fluid color="red" >
        <Card.Content as={Link} to={'/projects/'+id}>
          <Grid columns={2}>
            <Grid.Row>
              <Grid.Column width={4}>
                <Image src={logoImage.url}/>
              </Grid.Column>
              <Grid.Column width={12}>
                <Card.Header className="card-header">
                  {title}
                </Card.Header>
                <Card.Meta>
                  Created on {moment.unix(createdAt).format('MMM Do, YYYY @ h:mm a')}
                </Card.Meta>
                <Card.Description>
                  {briefDescription}
                </Card.Description>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Card.Content>
        {projectControlBar()}
      </Card>
    );
    // <div>
    //   <div className="project">
    //     <Link to={'/projects/'+id} className="button expanded hollow project-button">
    //       <div className="row">
    //         <div className="column small-3">
    //           <div className="image-container">
    //             <img src={logoImage.url}/>
    //           </div>
    //         </div>
    //         <div className="column small-9">
    //           <h4>{title}</h4>
    //           <p className="date-created">Created on {moment.unix(createdAt).format('MMM Do, YYYY @ h:mm a')}</p>
    //           <p className="brief-description">{briefDescription}</p>
    //         </div>
    //       </div>
    //     </Link>
    //   </div>
    //   {editModeStatus ? (<ProjectControlBar onDelete={this.handleDeleteProject} onEdit={this.handleEditProject}/>) : null}
    // </div>
  }
};

export default connect()(Project);
