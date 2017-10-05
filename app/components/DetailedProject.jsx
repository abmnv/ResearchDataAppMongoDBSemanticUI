import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import axios from 'axios';
import DownloadButton from 'ZipDownloadButton';
import JSZip from 'jszip';
import {Card, Header, Grid, Image, Checkbox, List, Button, Icon, Label, Segment} from 'semantic-ui-react';
import SpinningWheel from 'SpinningWheel';
import {Link, hashHistory} from 'react-router';

import FileList from 'FileList';
import {getFileBlob} from 'ResearchDataAPI';
import * as actions from 'actions';
import DUAModal from 'DUAModal';
import ConfirmDeleteProjectModal from 'ConfirmDeleteProjectModal';

class DetailedProject extends React.Component {

  constructor (props) {
    super(props);

    //destructering with default
    const {files=[]} = props;

    const fileSelection = {};

    files.forEach((file) => {
      fileSelection[file.id] = false;
    });

    this.state = {
      fileSelection,
      areAllFilesSelected: false,
      DUAModalOpen: false,
      confirmDeleteProjectModalOpen: false,
      isDeletingProject: false
    }

    this.handleToggleFileSelection = this.handleToggleFileSelection.bind(this);
    this.handleDownloadSelectedFiles = this.handleDownloadSelectedFiles.bind(this);
    this.handleCloseDUAModal = this.handleCloseDUAModal.bind(this);
    this.handleDUASubmit = this.handleDUASubmit.bind(this);
    this.handleOpenConfirmDeleteProjectModal = this.handleOpenConfirmDeleteProjectModal.bind(this);
    this.handleCloseConfirmDeleteProjectModal = this.handleCloseConfirmDeleteProjectModal.bind(this);
    this.handleDeleteProject = this.handleDeleteProject.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.isLoading && !nextProps.isLoading){
      const {files} = nextProps;

      const fileSelection = {};

      files.forEach((file) => {
        fileSelection[file.id] = false;
      });

      this.setState({
        fileSelection,
        areAllFilesSelected: false
      })
    }
  }

  handleOpenLoginModal = () => {
    const {dispatch} = this.props;

    dispatch(actions.setCurrentModal('Login'));
  }

  handleToggleFileSelection (fileId) {
    //console.log('fileId:', fileId);

    const {fileSelection} = this.state;
    //const {files} = this.props;
    fileSelection[fileId] = !fileSelection[fileId];

    let areAllFilesSelected = true;
    Object.keys(fileSelection).forEach((key) => {
      if(!fileSelection[key]){
        areAllFilesSelected = false;
      }
    });

    this.setState({
      areAllFilesSelected,
      fileSelection
    });
  }

  handleDownloadSelectedFiles () {
    const {fileSelection} = this.state;

    // console.log('fileSelection:', fileSelection);
    //
    // let selectedFiles = [];
    // fileSelection.forEach((status, id) => {
    //   if (status) {
    //     selectedFiles.push(files[id]);
    //   };
    // });
    //
    // console.log('selectedFiles:', selectedFiles);
    //
    // const zip = new JSZip();
    // let seq = Promise.resolve();
    //
    // selectedFiles.forEach((file) => {
    //   seq = seq.then(() => {
    //     return getFileBlob(file);
    //   }).then((blob) => {
    //     zip.file(file.name, blob);
    //     return zip.generateAsync({type: 'blob'});
    //   });
    // });
    //
    // seq.then((contents) => {
    //   //console.log('contents:', contents);
    //   return done({
    //     filename: 'data.zip',
    //     contents,
    //     mime: 'application/zip'
    //   });
    // }).then(() => {
    //   const newFileSelection = filesSelection.map(() => {
    //     return false;
    //   })
    //
    //   this.setState({
    //     fileSelection: newFileSelection,
    //     areAllFilesSelected: false
    //   });
    // });
  }

  handleToggleAllFileSelection = () => {
    const {fileSelection, areAllFilesSelected} = this.state;

    Object.keys(fileSelection).forEach((key) => {
        fileSelection[key] = !areAllFilesSelected
    });

    this.setState({
      areAllFilesSelected: !areAllFilesSelected,
      fileSelection

    })
  }
  // componentWillUnmount () {
  //   var {dispatch} = this.props;
  //   dispatch(actions.setActiveProject(''));
  // },
  downloadFiles () {
    console.log("download files");
  }

  handleOpenDUAModal = () => {
    const {dispatch} = this.props;

    //dispatch(actions.setCurrentModal('DUA'));
    this.setState({
      DUAModalOpen: true
    });
  }

  handleCloseDUAModal() {
    this.setState({
      DUAModalOpen: false
    });
  }

  handleDUASubmit(values) {
    console.log('handleDUASubmit values:', values);
    const {dispatch, id} = this.props;
    dispatch(actions.startAddDUARequest(values, id)).then(() => {
      this.setState({
        DUAModalOpen: false
      });
    });
    //   dispatch(actions.setCurrentModal(null));
    //   dispatch(actions.startUpdateUsers());
    //   // dispatch(actions.setRedirectUrl('/'));
    //   // hashHistory.push(this.props.redirectUrl);
    // }).catch(() => {
    //   dispatch(change('password', null));
    //   dispatch(untouch('password'));
    // });
  }

  handleCloseConfirmDeleteProjectModal () {
    this.setState({
      confirmDeleteProjectModalOpen: false
    });
  }

  handleDeleteProject () {
    var {dispatch, id, files} = this.props;
    this.setState({
      confirmDeleteProjectModalOpen: false,
      isDeletingProject: true
    });
    dispatch(actions.startDeleteProject(id, files)).then(() => {
      console.log('Deleting project...');
      hashHistory.push('/');
    });
  }

  handleOpenConfirmDeleteProjectModal () {
    console.log('handleOpenConfirmDeleteProjectModal');
    this.setState({
      confirmDeleteProjectModalOpen: true
    });
  }

  render () {
    const {id, title, createdAt, description, files, logoImage, requiresPermission, dua, managers, allowedUsers, isLoading, username, role, DUARequests} = this.props;
    const {fileSelection, areAllFilesSelected, DUAModalOpen, isDeletingProject} = this.state;
    // console.log('dua:', dua)
    //console.log('areAllFilesSelected:', areAllFilesSelected);
    //console.log('fileSelection:', fileSelection);

    const getStatus = () => {
      let status;

      if(!username){
        return 'requiresLoginOrSignup';
      }

      if(!requiresPermission || role === 'admin'){
        return 'allowed';
      }

      managers.forEach((m) => {
        if(m === username){
          status = 'allowed';
        }
      });

      if(!status){
        allowedUsers.forEach((u) => {
          if(u === username){
            status = 'allowed';
          }
        });
      }

      if(!status){
        DUARequests.forEach((req) => {
          if(req.username === username){
            status = 'pending';
          }
        });
      }

      if(!status){
        status = 'denied';
      }

      return status;
    }

    const manageProject = () => {

      let allowed = false;

      if(role === 'admin'){
        allowed = true;
      }

      if(!allowed){
        managers.forEach((m) => {
          if(m === username){
            allowed = true;
          }
        });
      }

      if(allowed){
        return (
          <Card.Content extra>
            <Button.Group fluid>
              <Button basic color="red" onClick={this.handleOpenConfirmDeleteProjectModal}>Delete</Button>
              <Button basic color="blue" as={Link} to={`/projects/${id}/manage`}>Manage</Button>
              <Button basic color="blue" as={Link} to={`/projects/${id}/edit`}>Edit</Button>
            </Button.Group>
          </Card.Content>
        )
        // <Button basic color="red" size="tiny" onClick={this.handleDeleteProject}>Delete</Button>

      }else{
        return null;
      }
    }

    const fileList = () => {

      const status = getStatus();
      // console.log('status:', status);

      switch(status){
        case 'allowed':
          let selectedFilesUrl = `/projects/${id}/files?`;
          let firstInstance = true;

          Object.keys(fileSelection).forEach((key) => {
            if(fileSelection[key]){
              if(!firstInstance){
                selectedFilesUrl += `&`;
              }
              selectedFilesUrl += `id=${key}`;
              firstInstance = false;
            }
          });

          return (
            <List>
              <List.Item>
                <List.Content floated="right">
                  <Checkbox onChange={this.handleToggleAllFileSelection} checked={areAllFilesSelected}/>
                </List.Content>
              </List.Item>
              {files.map((file) => {
                const url = `/projects/${id}/files/${file.id}`;
                return(
                  <List.Item key={file.id}>
                    <List.Content floated="right">
                      <Checkbox  checked={fileSelection[file.id]} onChange={() => {this.handleToggleFileSelection(file.id)}}/>
                    </List.Content>
                    <List.Content floated="right">
                      <a href={url}>
                        <Icon name="download"/>
                      </a>
                    </List.Content>
                    <List.Content>
                      {file.name}
                    </List.Content>
                  </List.Item>
                )
              })}
              <List.Item>
                <List.Content floated="right">
                  <a href={selectedFilesUrl}>
                    <Icon name="download" fitted/>
                  </a>
                </List.Content>
              </List.Item>
            </List>
          );

        case 'pending':
          return (
            <p style={{color:"#db2828"}}>
              Your Data User Agreement request is pending approval
            </p>
          );

        case 'denied':
          return (
            <div className="center-text-align">
              <p>Accessing data requires Data User Agreement</p>
              <Button negative basic fluid onClick={this.handleOpenDUAModal}>Request Permission</Button>
            </div>
          );

        case 'requiresLoginOrSignup':
          return (
            <div className="center-text-align">
              <Button negative basic fluid onClick={this.handleOpenLoginModal}>Accessing data requires Login</Button>
            </div>
          );

        default:
          return (
            <div className="center-text-align">
              <Button negative basic fluid onClick={this.handleOpenDUAModal}>Request Permission</Button>
            </div>
          );
      }
    }

    const duaLabel = () => {
      if(requiresPermission){
        return (
          <Label color="red" attached="top right">DUA</Label>
        )
      }else{
        return null;
      }
    }

    if(isLoading || isDeletingProject){
      return (
        <SpinningWheel/>
      )
    }else{
      return (
        <div>
          <Card fluid color="red" >
            <Card.Content>
              <Image floated="left" size="tiny" src={logoImage.url}/>
              {duaLabel()}
              <Card.Header>
                {title}
              </Card.Header>
              <Card.Meta>
                Created on {moment.unix(createdAt).format('MMM Do, YYYY')}
              </Card.Meta>
              <Card.Description>
                {description}
              </Card.Description>
            </Card.Content>
            {manageProject()}
            <Card.Content extra>
              {fileList()}
            </Card.Content>
          </Card>
          <DUAModal open={DUAModalOpen} onClose={this.handleCloseDUAModal} dua={dua} onDUASubmit={this.handleDUASubmit}/>
          <ConfirmDeleteProjectModal open={this.state.confirmDeleteProjectModalOpen} onClose={this.handleCloseConfirmDeleteProjectModal} onConfirm={this.handleDeleteProject}/>
        </div>
      );
    }

    // <Checkbox/>
    // <FileList files={files} filesSelection={filesSelection} onToggleFileSelection={this.handleToggleFileSelection} projectId={id} editModeStatus={false}/>
    // <div className="project">
    //   <h4>{title}</h4>
    //   <p className="date-created">Created on {moment.unix(createdAt).format('MMM Do, YYYY')}</p>
    //   <p className="project-description">{description}</p>
    //   <div className="row">
    //     <div className="column small-offset-11 small-1">
    //       <input type="checkbox" name="allSelection" checked={areAllSelected} onChange={this.handleToggleAllSelected}/>
    //     </div>
    //   </div>
    //   <div className="row">
    //     <div className="column small-12">
    //       <FileList files={files} filesSelection={filesSelection} onToggleFileSelection={this.handleToggleFileSelection} projectId={id} editModeStatus={false}/>
    //     </div>
    //   </div>
    //   <div className="row">
    //     <div className="column small-offset-6 small-6">
    //       <DownloadButton className="button success right radius" async={true} genFile={this.handleDownloadSelectedFiles} initTitle={'Download Selected Files'} zippingTitle={'Zipping Files...'} downloadingTitle={'Downloading...'}/>
    //     </div>
    //   </div>
    // </div>
  }
};

export default connect((state, ownProps) => {
  const {params: {projectId}} = ownProps;
  const {projects, isLoading, auth: {username, role}} = state;
  //console.log('projectId:', projectId);

  let currentProject;
  projects.forEach((project) => {
    if(project.id === projectId){
      //console.log('project:', project);
      currentProject = project;
    }
  });

  return {...currentProject, isLoading, username, role};
})(DetailedProject);
// <button className="button small success" onClick={this.handleDownloadSelectedFiles}>Download Selected</button>
//<button className="button small success" onClick={this.handleDownloadAllFiles}>Download All</button>
//{renderFileList()}
