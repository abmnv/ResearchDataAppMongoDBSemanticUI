import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import axios from 'axios';
import DownloadButton from 'ZipDownloadButton';
//var DownloadButton = require('downloadbutton/es5');
import JSZip from 'jszip';
import {Card, Header, Grid, Image, Checkbox, List, Button, Icon} from 'semantic-ui-react';

import FileList from 'FileList';
import {getFileBlob} from 'ResearchDataAPI';
//import * as actions from 'actions';

class DetailedProject extends React.Component {

//var DetailedProject = React.createClass({
  constructor (props) {
    super(props);

    const {files} = this.props;

    const fileSelection = {};

    files.forEach((file) => {
      fileSelection[file.id] = false;
    });
    // console.log('filesSelection:', filesSelection);

    this.state = {
      fileSelection,
      areAllFilesSelected: false
    }

    this.handleToggleFileSelection = this.handleToggleFileSelection.bind(this);
    this.handleDownloadSelectedFiles = this.handleDownloadSelectedFiles.bind(this);
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

  render () {
    const {fileSelection, areAllFilesSelected} = this.state;
    const {id, title, createdAt, description, files, logoImage} = this.props;
    //console.log('areAllFilesSelected:', areAllFilesSelected);
    //console.log('fileSelection:', fileSelection);

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
    console.log('url:', selectedFilesUrl);

    const fileList = () => {
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
      )
      // <Icon name="download" fitted className="show-cursor" onClick={this.handleDownloadSelectedFiles}/>

      // <Button compact icon className="no-margins button-padding" >
      //   <Icon name="download" fitted/>
      // </Button>
      // onClick={this.downloadFiles}
    }

    return (
      <Card fluid color="red" >
        <Card.Content>
          <Image floated="left" size="tiny" src={logoImage.url}/>
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
        <Card.Content extra>
          {fileList()}
        </Card.Content>
      </Card>
    );
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
  const {projects} = state;
  //console.log('projectId:', projectId);

  let currentProject;
  projects.forEach((project) => {
    if(project.id === projectId){
      //console.log('project:', project);
      currentProject = project;
    }
  });

  return {...currentProject};
})(DetailedProject);
// <button className="button small success" onClick={this.handleDownloadSelectedFiles}>Download Selected</button>
//<button className="button small success" onClick={this.handleDownloadAllFiles}>Download All</button>
//{renderFileList()}
