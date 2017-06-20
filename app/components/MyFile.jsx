import React from 'react';
import {connect} from 'react-redux';
import ProgressButton from 'react-progress-button';
import {Button} from 'semantic-ui-react';

import * as actions from 'actions';

var MyFile = React.createClass({

  getInitialState () {
    return {
      buttonStatus: ''
    }
  },

  handleDeleteFile (e) {
    e.preventDefault();

    this.setState({
      buttonStatus: 'loading'
    });

    const {id, name, projectId, dispatch} = this.props;
    //console.log('projectId:', projectId);
    dispatch(actions.startDeleteFile(projectId, id, name)).then(() => {
      // this.setState({
      //   buttonStatus: 'success'
      // });
    });
  },

  // handleToggleFileSelection (isSelected) {
  //   //e.preventDefault();
  //   this.props.onToggleFileSelection(isSelected);
  //
  //   //const {id, isSelected, projectId, dispatch} = this.props;
  //   //dispatch(actions.addFileId);
  //   //const checked = this.refs.checkbox.value;
  //   //dispatch(action.toggleFileSelection(projectId, id, !isSelected));
  //   //console.log('checked:', checked);
  //
  // },

  render () {
    const {id, name, url, isSelected, projectId, editModeStatus} = this.props;
    //console.log('editModeStatus:', editModeStatus);
    //console.log('MyFile editModeStatus:', editModeStatus);
    //sconsole.log('isSelected:', isSelected);

    //Note that I need to build a dynamic URL because static doesn't support file renaming for downloads
    const newUrl = `/projects/${projectId}/files/${id}`;
    //console.log('MyFile url:', newUrl);

    const renderFile = () => {
      if(editModeStatus){
        return (
          <div className="row">
            <div className="column small-9 left-text-align">
              {name}
            </div>
            <div className="column small-3 right-text-align">
              <div className="edit-delete-file-button-container">
                <div className="edit-delete-file-button">
                  <ProgressButton classNamespace='pb-delete-' onClick={this.handleDeleteFile} state={this.state.buttonStatus} durationSuccess={1000}>Delete</ProgressButton>
                </div>
              </div>
            </div>
          </div>
        )
      }else{
        return (
          <div>
            {name}
            <Button basic color="purple" size="tiny" as="a" href={newUrl}>Download</Button>
          </div>
        );
        // <div className="row">
        //   <div className="column small-8 left-text-align">
        //     {name}
        //   </div>
        //   <div className="column small-3 right-text-align">
        //     <a href={newUrl} className="button tiny success radius">Download</a>
        //   </div>
        //   <div className="column small-1">
        //     <input type="checkbox" checked={isSelected} onChange={() => {
        //         //console.log('checkbox was clicked');
        //         this.props.onToggleFileSelection(id);
        //       }}></input>
        //   </div>
        // </div>
      }
    }

    // var renderFileLink = () => {
    //   if(editModeStatus){
    //     return (
    //       <button className="button tiny alert" onClick={this.handleDeleteFile}>Delete</button>
    //     )
    //   }else{
    //     return (
    //       <a href={url} className="button tiny success">Download</a>
    //     )
    //   }
    // }

    return (
      <div>
        {renderFile()}
      </div>
    )
  }
});

export default connect()(MyFile);
//<button className="button tiny alert radius" onClick={this.handleDeleteFile}>Delete</button>
