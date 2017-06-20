import React from 'react';
import Nav from 'Nav';
import ModalContainer from 'ModalContainer';
import {Grid} from 'semantic-ui-react';

var Main = (props) => {
  return (
    <div>
      <Nav/>
      <ModalContainer/>
      <Grid centered columns="2">
          <Grid.Column textAlign="left">
            {props.children}
          </Grid.Column>
      </Grid>
    </div>
  );
  // <div className="row">
  //   <div className="column small-centered small-8 medium-6">
  //     {props.children}
  //   </div>
  // </div>
}

export default Main;
