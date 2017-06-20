import React from 'react';

var ProjectControlBar = React.createClass({

  handleDelete () {
    this.props.onDelete();
  },

  handleEdit () {
    this.props.onEdit();
  },

  render () {
    return (
      <div className="project-control-bar">
        <div className="row no-margins">
          <div className="column small-6">
            <button className="button tiny alert expanded" onClick={this.handleDelete}>Delete</button>
          </div>
          <div className="column small-6">
            <button className="button tiny expanded" onClick={this.handleEdit}>Edit</button>
          </div>
        </div>
      </div>
    );
  }
});

export default ProjectControlBar;
//<button className="button expand" onClick={this.handleEdit}>Edit</button>
