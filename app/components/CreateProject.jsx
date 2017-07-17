import React from 'react';
import {connect} from 'react-redux';
import * as actions from 'actions';
import ProgressButton from 'react-progress-button';
import {Field, reduxForm, formValueSelector} from 'redux-form';
import {Card, Form, Input, Label, TextArea, Button, Grid, Icon, Progress} from 'semantic-ui-react';

import SimpleFileList from 'SimpleFileList';

const validate = (values) => {
  const errors = {};
  //console.log('Validate values:', values);

  if(!values.title){
    errors.title = 'Please enter title'
  }

  if(!values.description){
    errors.description = 'Please enter description'
  }

  return errors;
}

class CreateProject extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    }
  }

  handleCreateProject = (values) => {
    const {dispatch, change, reset} = this.props;

    //console.log('values:', values);
    //change('buttonStatus', 'loading');
    this.setState({
      loading: true
    });

    dispatch(actions.startCreateProject({...values, change})).then(() => {
      reset();
      
      this.setState({
        loading: false,
      })
    });
  }

  // adaptFileEventToValueLogoImage = (e) => {
  //   const {change} = this.props;
  //   change('logoImage', {file: e.target.files[0], progress: 0});
  // }

  adaptFileEventToValueLogoImage = (inputOnChange) => {
    return (e) => {
      //Note that I have to check if logoImage exists on the props if it exists use its progress value
      return inputOnChange({file: e.target.files[0], progress: 0});
      //return inputOnChange({file: e.target.files[0], progress: (this.props.logoImage ? this.props.logoImage.progress : 0)});
    }
  }

  adaptFileEventToValueFileList = (inputOnChange) => {
    return (e) => {
      const files = [...e.target.files].map((file, i) => {
        return {file, progress: 0}
        //return {file, progress: (this.props.fileList ? this.props.fileList[i] : 0)}
      })
      return inputOnChange(files);
    }
  }
  // <div>
  //   <input className="modal-input" {...input} placeholder={label} type={type}/>
  //   {touched && error && <div className="login-error">{error}</div>}
  // </div>

  renderField = ({input, label, placeholder, type, meta: {touched, error}}) => {
    //console.log('renderField title touched, error:', touched, error);
    return (
      <Form.Input inline fluid label={label} {...input} type={type} placeholder={placeholder} error={touched && error}/>
    );
    // <Form.Field inline>
    //   <label>
    //     {label}
    //   </label>
    //   <Input {...input} type={type} placeholder={placeholder} fluid error={touched && error}/>
    // </Form.Field>

    // <Grid columns={2}>
    //   <Grid.Column width={3}>
    //     <Label basic>
    //       {label}
    //     </Label>
    //   </Grid.Column>
    //   <Grid.Column width={13}>
    //     <Input {...input} type={type} placeholder={placeholder} width={13} fluid/>
    //   </Grid.Column>
    // </Grid>

    //<Form.Input inline id="create-project-form-title" label={label} {...input} type={type} placeholder={placeholder}/>

    // <label>{label}</label>
    // <Input {...input} type={type}/>

    // <fieldset>
    //   <div className="row">
    //     <label className="column small-3 project-label">
    //       {label}
    //     </label>
    //     <div className="column small-9">
    //       <input {...input} type={type} placeholder={placeholder}></input>
    //     </div>
    //   </div>
    // </fieldset>
  }

  renderTextArea = ({input, label, placeholder, meta: {touched, error}}) => {
    //console.log('renderField description touched, error:', touched, error);
    return (
      <Form.TextArea inline autoHeight label={label} placeholder={placeholder} {...input} error={touched && error}/>
    );
    // <fieldset>
    //   <div className="row">
    //     <label className="column small-3 project-label">
    //       {label}
    //     </label>
    //     <div className="column small-9">
    //       <textarea {...input} placeholder={placeholder}></textarea>
    //     </div>
    //   </div>
    // </fieldset>
  }

  renderLogoImage = ({input, label, type}) => {
    //console.log('renderLogoImage logoImage:', this.props.logoImage);
    return (
      <div>
        <Form.Field>
          <label>{label}</label>
          <label htmlFor={input.name}>
            <span className="mini ui blue basic button">Select</span>
          </label>
          <input type={type} id={input.name} onChange={this.adaptFileEventToValueLogoImage(input.onChange)} style={{display:"none"}}></input>
        </Form.Field>
        <SimpleFileList fileList={input.value ? [input.value] : []}/>
      </div>
    );
    // <Button basic color="red" size="mini">Select</Button>
    // <Icon name="attach" size="big"/>

    //<Form.Input label={label} type={type} onChange={this.adaptFileEventToValueLogoImage(input.onChange)}/>

    // <fieldset>
    //   <div className="row">
    //     <p className="column small-3 project-label middle">
    //       {label}
    //     </p>
    //     <div className="column small-2">
    //       <label htmlFor={input.name} className="button tiny radius">Select</label>
    //       <input type={type} id={input.name} className="show-for-sr" onChange={this.adaptFileEventToValueLogoImage(input.onChange)}></input>
    //     </div>
    //     <div className="column small-7">
    //       <SimpleFileList fileList={input.value ? [input.value] : []}/>
    //     </div>
    //   </div>
    // </fieldset>
    //(input.onChange)
  }

  renderFileList = ({input, label, type}) => {
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
    );
    // <fieldset>
    //   <div className="row">
    //     <p className="column small-3 project-label middle">
    //       {label}
    //     </p>
    //     <div className="column small-2">
    //       <label htmlFor={input.name} className="button tiny radius">Select</label>
    //       <input type={type} id={input.name} multiple="multiple" className="show-for-sr" onChange={this.adaptFileEventToValueFileList(input.onChange)}></input>
    //     </div>
    //     <div className="column small-7">
    //       <SimpleFileList fileList={input.value ? input.value : []}/>
    //     </div>
    //   </div>
    // </fieldset>
  }

  // componentWillUpdate (nextProps, nextState) {
  //   const {title, description, buttonStatus, change} = nextProps;
  //   // console.log('componentWillUpdate title:', title);
  //   // console.log('componentWillUpdate description:', description);
  //   // console.log('componentWillUpdate nextProps', nextProps);
  //
  //   if(title && description) {
  //     this.setState({
  //       disabled: false
  //     });
  //     // console.log('buttonStatus:', buttonStatus);
  //     // console.log('changing buttonStatus to empty');
  //     // change('buttonStatus', '');
  //     //dispatch(actions.changeCreateProjectButtonStatus(''));
  //   }
  // }

  resetForm = (e, data) => {
    console.log('this should reset form');
  }

  render () {
    return (
      <div>
        <Card fluid>
          <Card.Content>
            <Form onSubmit={this.props.handleSubmit(this.handleCreateProject)}>
              <Field name="title" component={this.renderField} type="text" label="Title:" placeholder="My awesome project"/>
              <Field name="description" component={this.renderTextArea} label="Description:" placeholder="Description of my awesome project"/>
              <Field name="logoImage" component={this.renderLogoImage} type="file" label="Logo:"/>
              <Field name="fileList" component={this.renderFileList} type="file" label="Attach Files:"/>
              <Button primary loading={this.state.loading} floated="right">Save</Button>
            </Form>
            <Button negative floated="right" onClick={this.resetForm}>Reset</Button>
          </Card.Content>
        </Card>
      </div>
    )
  }
  // <div className="create-project">
  //   <form onSubmit={this.props.handleSubmit(this.handleCreateProject)}>
  //     <Field name="title" component={this.renderField} type="text" label="Title:" placeholder="My awesome project"/>
  //     <Field name="description" component={this.renderTextArea} label="Description:" placeholder="Description of my awesome project"/>
  //     <Field name="logoImage" component={this.renderLogoImage} type="file" label="Logo Image:"/>
  //     <Field name="fileList" component={this.renderFileList} type="file" label="Attach Files:"/>
  //     <div className="row control-bar">
  //       <div className="column small-offset-8 small-4">
  //         <ProgressButton state={this.props.buttonStatus} durationSuccess={1000}>Save</ProgressButton>
  //       </div>
  //     </div>
  //     <Field name="buttonStatus" component="input" type="hidden"/>
  //   </form>
  // </div>
}

const selector = formValueSelector('createProject');

CreateProject = reduxForm({
  form: 'createProject',
  validate
})(CreateProject);

CreateProject = connect()(CreateProject);
  // (state) => {
  // const title = selector(state, 'title');
  // const description = selector(state, 'description');
  // const buttonStatus = selector(state, 'buttonStatus');
  // const fileList = selector(state, 'fileList');
  // const logoImage = selector(state, 'logoImage');
  // console.log('title:', title);
  // console.log('description:', description);
  //console.log('CreateProject logoImage:', logoImage);
  //const {createProject: {buttonStatus}} = state;
  // const initialValues = {
  //   buttonStatus: 'disabled'
  // }

  //return {title, description, buttonStatus};
// })(CreateProject);

export default CreateProject;

// export default connect((state) => {
//   const title = selector(state, 'title');
//   const description = selector(state, 'description');
//   const fileList = selector(state, 'fileList');
//   const logoImage = selector(state, 'logoImage');
//   // console.log('title:', title);
//   // console.log('description:', description);
//   console.log('CreateProject logoImage:', logoImage);
//
//   const {createProject: {buttonStatus}} = state;
//
//   return {title, description, fileList, logoImage, buttonStatus};
// })(reduxForm({
//   form: 'createProject'
// })(CreateProject));


//export default connect(({createProjectForm}) => ({...createProjectForm}))(CreateProject);
//<SimpleFileList fileList={this.state.fileList}/>
//<button  className="button expanded" onClick={this.handleCreateProject}>Create</button>
