import React from 'react';
import {connect} from 'react-redux';

import EditProject from 'EditProject';
import SpinningWheel from 'SpinningWheel';

class EditProjectContainer extends React.Component {

  constructor(props) {
    super(props);

    const {isLoading} = props;
    console.log('constructor isLoading props:', isLoading);
  }

  render () {
    const {isLoading, params} = this.props;

    if(isLoading){
      console.log('spinning wheel');
      return (
        <SpinningWheel/>
      )
    }else{
      return (
        <EditProject params={params}/>
      )
    }
  }
}

EditProjectContainer = connect((state) => {

  const {isLoading} = state;
  // console.log('connect isLoading:', isLoading);

  return {isLoading};
})(EditProjectContainer);

export default EditProjectContainer;
