import React from 'react';
import {Line} from 'rc-progress';
import {Progress} from 'semantic-ui-react';

const SimpleFile = React.createClass({
  render () {
    const {myFile} = this.props;
    console.log('myFile:', myFile);
    return (
      <div>
        {myFile.file.name}
        <Progress percent={myFile.progress} size="tiny" autoSuccess/>
      </div>
    );
  }
});

export default SimpleFile;
