import React from 'react';

import SimpleFile from 'SimpleFile';

const SimpleFileList = React.createClass({

  render () {
    const {fileList} = this.props;
    //console.log('fileList:', fileList);


    /* Note that myFile variable is an object {file, progress} where file is DOM file object
       and progress is an upload progress
    */
    const fileRender = fileList.map((myFile, i) => {
      return (
        <SimpleFile key={i} myFile={myFile}/>
      )

      // if(fileUploadProgress.filename = myFile.name){
      //   return (
      //     <SimpleFile key={i} fileName={myFile.name} fileUploadProgress={fileUploadProgress.progress}/>
      //   )
      // }else{
      //   return (
      //     <SimpleFile key={i} fileName={myFile.name} fileUploadProgress={0}/>
      //   )
      // }
    });

    return (
      <div>
        {fileRender}
      </div>
    );
  }
});

export default SimpleFileList;
