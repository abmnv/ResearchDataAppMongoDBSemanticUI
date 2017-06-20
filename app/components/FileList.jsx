import React from 'react';
import {connect} from 'react-redux';

import MyFile from 'MyFile';

var FileList = (props) => {
  var {files, filesSelection, projectId, editModeStatus} = props;

  var renderFileList = () => {
    return files.map((myFile, i) => {
        //console.log('myFile:', myFile, 'i:', i);
        return (
          <MyFile key={myFile.id} {...myFile} projectId={projectId} isSelected={filesSelection[i]} onToggleFileSelection={props.onToggleFileSelection} editModeStatus={editModeStatus}/>
        )
    });
  }

  return (
    <div>
      {renderFileList()}
    </div>
  );
}

export default connect()(FileList);
