import React from 'react';
import {connect} from 'react-redux';
import {Header} from 'semantic-ui-react';

import * as actions from 'actions';
import Project from 'Project';
import SpinningWheel from 'SpinningWheel';

class ProjectList extends React.Component {

  componentWillUnmount () {
    const {dispatch} = this.props;

    dispatch(actions.setSearchText(''));
  }

  render () {
    var {projects, isLoading, searchText, editModeStatus} = this.props;
    //console.log('ProjectList editModeStatus:', editModeStatus);

    var renderList = () => {

      if(isLoading){
        return (
          <SpinningWheel/>
        )
      }else if(projects.length === 0){
        return (
          <Header as="h4" textAlign="center" color="grey">Nothing to show</Header>
        );
      }

      let updatedProjects = JSON.parse(JSON.stringify(projects));

      if(searchText !== ''){
        updatedProjects = updatedProjects.filter((project) => {
          const title = project.title.toLowerCase();
          return title.indexOf(searchText) > -1;
        });
      }

      return updatedProjects.map((project) => {
        return (
          <Project key={project.id} {...project} editModeStatus={editModeStatus}/>
        );
      });
    }

    return (
      <div>
        {renderList()}
      </div>
    )
    // <div className="project-list">

  }
}

export default connect((state) => ({...state}))(ProjectList);
//<h4>Loading...</h4>
// <svg className="pb-progress-circle" viewBox='0 0 41 41'>
//   <path d='M38,20.5 C38,30.1685093 30.1685093,38 20.5,38' />
// </svg>


// <svg className={classNamespace + 'checkmark'} viewBox='0 0 70 70'>
//   <path d='m31.5,46.5l15.3,-23.2' />
//   <path d='m31.5,46.5l-8.5,-7.1' />
// </svg>
// <svg className={classNamespace + 'cross'} viewBox='0 0 70 70'>
//   <path d='m35,35l-9.3,-9.3' />
//   <path d='m35,35l9.3,9.3' />
//   <path d='m35,35l-9.3,9.3' />
//   <path d='m35,35l9.3,-9.3' />
// </svg>
