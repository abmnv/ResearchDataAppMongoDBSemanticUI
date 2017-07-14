import React from 'react';
import {connect} from 'react-redux';
import {Field, FieldArray, reduxForm, formValueSelector} from 'redux-form';
import ProgressButton from 'react-progress-button';
import {Card, Form, Input, Label, TextArea, Button, Grid, Icon, Progress, Checkbox} from 'semantic-ui-react';

import FileList from 'FileList';
import SimpleFileList from 'SimpleFileList';
import * as actions from 'actions';

class EditProject extends React.Component {
//var EditProject = React.createClass({

  constructor (props) {
    super(props);

    const {files} = this.props;
    //console.log('projectId:', projectId);

    const filesSelection = files.map((myFile) => {
      return false;
    });
    //
    this.state = {
      //...currentProject,
      filesSelection,
      loading: false
      //buttonStatus: ''
    }

    this.handleUpdateProject = this.handleUpdateProject.bind(this);
    //this.handleCancel = this.handleCancel.bind(this);
    //this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleUpdateProject (values) {
    //e.preventDefault();
    const {dispatch, change, id, array} = this.props;
    // const {id, title, description} = this.state;
    // const {uploadFileList} = this.props;
    //var fileList = $.extend(true, [], this.refs.fileUploader.files);
    //change('buttonStatus', 'loading');
    this.setState({
      loading: true
    })

    //console.log('handleUpdateProject values:', values);
    dispatch(actions.startUpdateProject({...values, id, change, array})).then(() => {
      //console.log('startUpdateProject success');
      //change('buttonStatus', 'success');
      this.setState({
        loading: false
      })
    });

    // if(title && description){
    //   //this.refs.fileUploader.value='';
    //   //console.log('title:', title);
    //   this.setState({
    //     buttonStatus: 'loading'
    //   });
    //
    //   var {dispatch} = this.props;
    //   dispatch(actions.startUpdateProject(id, title, description, uploadFileList)).then(() => {
    //     // const {currentProject} = this.props;
    //     //dispatch(actions.setFileUploadList([]));
    //
    //     this.setState({
    //       buttonStatus: 'success'
    //     });
    //
    //     // setTimeout(() => {
    //     //   this.setState({
    //     //     buttonStatus: ''
    //     //   });
    //     // }, 1100);
    //     // this.setState({
    //     //   //...this.props.currentProject,
    //     //   uploadFileList: []
    //     // });
    //   });

      // .then(() => {
      //   this.props.history.push('/');
      // });
  }

  // handleInputChange (e) {
  //   e.preventDefault();
  //
  //   const {dispatch} = this.props;
  //
  //   //var title = this.refs.title.value;
  //   var name = e.target.name;
  //
  //   if(name === 'fileUploader'){
  //     const fileList = [...e.target.files].map((file) => {
  //       return {
  //         file,
  //         progress: 0
  //       }
  //     });
  //     dispatch(actions.setFileUploadList(fileList));
  //     // this.setState({
  //     //   uploadFileList: [...e.target.files]
  //     // });
  //   }else{
  //     this.setState({
  //       [name]: e.target.value
  //     });
  //   }
  //   //console.log(name, ':', e.target.value);
  // }
  adaptFileEventToValueFileList = (inputOnChange) => {
    return (e) => {
      const files = [...e.target.files].map((file, i) => {
        return {file, progress: 0}
        //return {file, progress: (this.props.fileList ? this.props.fileList[i] : 0)}
      });
      return inputOnChange(files);
    }
  }

  renderField = ({input, label, type, meta: {touched, error}}) => {
    //console.log('renderField touched, error:', touched, error);
    return (
      <Form.Input inline fluid {...input} label={label} type={type} error={touched && error}/>
    );
    // <fieldset>
    //   <div className="row">
    //     <label className="column small-3 project-label">
    //       {label}
    //     </label>
    //     <div className="column small-9">
    //       <input {...input} type={type}></input>
    //     </div>
    //   </div>
    // </fieldset>
  }

  renderTextArea = ({input, label, meta: {touched, error}}) => {
    //console.log('renderField touched, error:', touched, error);
    return (
      <Form.TextArea inline autoHeight {...input} label={label} error={touched && error}/>
    );
    // <fieldset>
    //   <div className="row">
    //     <label className="column small-3 project-label">
    //       {label}
    //     </label>
    //     <div className="column small-9">
    //       <textarea {...input}></textarea>
    //     </div>
    //   </div>
    // </fieldset>
  }

  renderUploadFileList = ({input, label, type}) => {
    //console.log('renderFileUploader this.fileUploader', this.fileUploader);
    return (
      <div>
        <Form.Field>
          <label>{label}</label>
          <label htmlFor={input.name}>
            <span className="basic blue mini ui button">Select</span>
          </label>
          <input type={type} id={input.name} multiple="multiple" onChange={this.adaptFileEventToValueFileList(input.onChange)} style={{display:"none"}}></input>
        </Form.Field>
        <SimpleFileList fileList={input.value ? input.value : []}/>
      </div>
    )
    // <fieldset>
    //   <div className="row">
    //     <p className="column small-3 project-label">
    //       {label}
    //     </p>
    //     <div className="column small-2 end text-align-left">
    //       <label htmlFor={input.name} className="button tiny radius">Select</label>
    //       <input type={type} id={input.name} multiple="multiple" className="show-for-sr" onChange={this.adaptFileEventToValueFileList(input.onChange)}></input>
    //     </div>
    //   </div>
    //   <div className="row">
    //     <div className="column small-offset-3 small-9 text-align-left">
    //       <SimpleFileList fileList={input.value ? input.value : []}/>
    //     </div>
    //   </div>
    // </fieldset>
  }

  renderFields = ({fields}) => {
    return (
      <div>
        <div className="small-bottom-margin">
          <label className="label bold">Files:</label>
          <Label basic size="mini" color="red" className="right">Mark for deletion</Label>
        </div>
        {fields.map(this.renderSubFields)}
      </div>
    )
    // <div className="row">
    //   <p className="column small-3 project-label middle">
    //     Files:
    //   </p>
    //   <div className="column small-9">
    //     {fields.map(this.renderSubFields)}
    //   </div>
    // </div>
  }

  renderSubFields = (member, index, fields) => {
    // console.log('file name:', fields.get(index).name)
    return (
      <div key={index}>
        <Field name={`${member}.selected`} component={this.renderCheckbox} type="checkbox" label={fields.get(index).name}/>
      </div>
    )
    // <Field name={`${member}.name`} component={this.renderFilename} id={`fileList${index}`}/>
    // <div className="row">
    //   <Field name={`${member}.name`} component={this.renderFilename} id={`fileList${index}`}/>
    //   <Field name={`${member}.selected`} component={this.renderCheckbox} type="checkbox" id={`fileList${index}`}/>
    // </div>
  }

  renderFilename = ({input, id}) => {
    return (
      <label htmlFor={id}>
        {input.value}
      </label>
    )
    // <label htmlFor={id} className="column small-10 left-text-align project-label normal-font-weight">
    //   {input.value}
    // </label>
    // htmlFor={id}
  }

  // renderCheckbox = ({input, label, type}) => {
  renderCheckbox = ({input: {onChange, name, value, checked}, label, type}) => {
    //console.log('renderChecbox input:', input);
    return (
      <div>
        <div className="field error">
          <span>{label}</span>
          <div className="ui checkbox fitted right">
            <input tabindex="0" class="hidden" onChange={(checked)=>(onChange(checked))} name={name} checked={checked} type={type} value={value}/>
            <label></label>
          </div>
        </div>
      </div>
    )
    // <label>{label}</label>
    // <label>I agree to the Terms and Conditions</label>
    // <span>{label}</span>
    // <Form.Checkbox onChange={(e, {checked})=>(onChange(checked))} name={name} checked={checked} type={type} value={value} error/>

    // <p>{label}</p>
    // <Form.Checkbox onChange={(e, {checked})=>(onChange(checked))} label={label} name={name} checked={checked} type={type} value={value} error/>

    // <div id={id}>
    //   <Checkbox onChange={(e, {checked})=>(onChange(checked))} d={id} name={name} checked={checked} type={type} value={value} color="red"/>
    // </div>
    // <div id={id} className="column small-2 right-text-align">
    //   <Checkbox onChange={(e, {checked})=>(onChange(checked))} name={name} checked={checked} type={type} value={value} color={"red"}/>
    // </div>
    //<input {...input} type={type} className="alert"/>
    // id={id}
    //<label className="column small-10 project-label" htmlFor={input.value}>
  }

  render () {
    //const {filesSelection} = this.state;
    const {files, id, buttonStatus} = this.props;

    return (
      <div>
        <Card fluid>
          <Card.Content>
            <Form onSubmit={this.props.handleSubmit(this.handleUpdateProject)}>
              <Field name="title" component={this.renderField} type="text" label="Title:"/>
              <Field name="description" component={this.renderTextArea} label="Description:"/>
              <FieldArray name="fileList" component={this.renderFields}/>
              <Field name="uploadFileList" component={this.renderUploadFileList} type="file" label="Attach Files:"/>
              <Button primary loading={this.state.loading} floated="right">Save</Button>
            </Form>
          </Card.Content>
        </Card>
      </div>
    )
    // <div className="create-project">
    //   <form onSubmit={this.props.handleSubmit(this.handleUpdateProject)}>
    //     <Field name="title" component={this.renderField} type="text" label="Title:"/>
    //     <Field name="description" component={this.renderTextArea} label="Description:"/>
    //     <FieldArray name="fileList" component={this.renderFields}/>
    //     <Field name="uploadFileList" component={this.renderUploadFileList} type="file" label="Attach Files:"/>
    //     <div className="row control-bar">
    //       <div className="column small-offset-8 small-4">
    //         <ProgressButton state={buttonStatus} durationSuccess={1000}>Save</ProgressButton>
    //       </div>
    //     </div>
    //     <Field name="buttonStatus" component="input" type="hidden"/>
    //   </form>
    // </div>

    // <div className="row">
    //   <label htmlFor="files" className="column small-3 project-label">Files:</label>
    //   <div className="column small-9">
    //     <FileList files={files} projectId={id} editModeStatus={true} filesSelection={filesSelection}/>
    //   </div>
    // </div>

    //const {title, description, createdAt, id, files, filesSelection} = this.state;

    //const renderUploadFileList = <SimpleFileList fileList={this.props.uploadFileList}/>;
    //const renderUploadFileList = this.props.uploadFileList ? <SimpleFileList fileList={[...this.props.uploadFileList]} fileUploadProgress={this.props.fileUploadProgress}/> : null;
    //const renderUploadFileList = this.state.uploadFileList ? <SimpleFileList fileList={[...this.state.uploadFileList]} fileUploadProgress={this.props.fileUploadProgress}/> : null;

    // return (
    //   <div className="edit-project">
    //     <div className="row">
    //       <label htmlFor="title" className="column small-3 project-label">Title:</label>
    //       <div className="column small-9">
    //         <input type="text" name="title" onChange={this.handleInputChange} value={this.state.title}></input>
    //       </div>
    //     </div>
    //     <div className="row">
    //       <label htmlFor="description" className="column small-3 project-label">Description:</label>
    //       <div className="column small-9">
    //         <textarea rows="3" name="description" onChange={this.handleInputChange} value={this.state.description}></textarea>
    //       </div>
    //     </div>
    //     <div className="row">
    //       <label htmlFor="files" className="column small-3 project-label">Files:</label>
    //       <div className="column small-9">
    //         <FileList files={this.props.currentProject.files} projectId={id} editModeStatus={true} filesSelection={filesSelection}/>
    //       </div>
    //     </div>
    //     <div className="row">
    //       <p className="column small-3 project-label">
    //         Attach files:
    //       </p>
    //       <div className="column small-9">
    //         <div className="row">
    //           <div className="column small-offset-9 small-3 right-text-align">
    //             <label htmlFor="fileUploader" className="button tiny radius">Select</label>
    //             <input type="file" id="fileUploader" name="fileUploader" ref="fileUploader" multiple="multiple" className={"show-for-sr"} onChange={this.handleInputChange}/>
    //           </div>
    //         </div>
    //         {renderUploadFileList}
    //       </div>
    //     </div>
    //     <div className="edit-save-button-container">
    //       <div className="edit-save-button">
    //         <ProgressButton onClick={this.handleSave} state={this.state.buttonStatus} durationSuccess={1000}>Save</ProgressButton>
    //       </div>
    //     </div>
    //   </div>
    // )
  }
};

const selector = formValueSelector('editProject');

EditProject = reduxForm({
  form: 'editProject'
})(EditProject);

EditProject = connect((state, ownProps) => {
  const {projects} = state;

  const {params: {projectId}} = ownProps;

  let currentProject;
  projects.forEach((project) => {
    if(project.id === projectId){
      //console.log('project:', project);
      currentProject = project;
    }
  });

  const fileList = currentProject.files.map((file) => {
    return {
      ...file,
      selected: false}
  });

  const initialValues = {
    title: currentProject.title,
    description: currentProject.description,
    buttonStatus: '',
    fileList
  };

  const buttonStatus = selector(state, 'buttonStatus');

  return {...currentProject, initialValues, buttonStatus};
})(EditProject);

export default EditProject;

// export default connect((state, ownProps) => {
//   const {projects, fileUploadProgress, uploadFileList} = state;
//   let currentProject;
//
//   const {params: {projectId}} = ownProps;
//
//   projects.forEach((project) => {
//     if(project.id === projectId){
//       //console.log('project:', project);
//       currentProject = project;
//     }
//   });
//
//   return {currentProject, fileUploadProgress, uploadFileList};
// })(EditProject);
// <label htmlFor="fileUploader" className="column small-3">Attach Files:</label>
// <button className="button expanded radius" onClick={this.handleSave}>Save</button>

// <div className="row control-bar">
//   <div className="column small-4 small-offset-8">
//     <ProgressButton onClick={this.handleSave} state={this.state.buttonStatus} durationSuccess={1000}>Save</ProgressButton>
//   </div>
// </div>
