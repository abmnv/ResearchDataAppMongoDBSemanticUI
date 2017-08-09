import React from 'react';
import {connect} from 'react-redux';
import * as actions from 'actions';
import ProgressButton from 'react-progress-button';
import {Field, reduxForm, formValueSelector} from 'redux-form';
import {Card, Form, Input, Label, TextArea, Button, Grid, Icon, Progress, Checkbox, Dropdown} from 'semantic-ui-react';
import SpinningWheel from 'SpinningWheel';

import SimpleFileList from 'SimpleFileList';

const validate = (values) => {
  const errors = {};
  console.log('Validate values:', values);

  if(!values.title){
    errors.title = 'Please enter title';
  }

  if(!values.description){
    errors.description = 'Please enter description';
  }

  if(values.requiresPermission && !values.dua){
    errors.dua = 'Please, enter Data User Agreement';
  }

  if(!values.managers){
    errors.managers = 'Managers are not specified';
  }

  if(values.managers && values.managers.length === 0){
    errors.managers = 'At least one manager should be specified';
  }

  return errors;
}

class CreateProject extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      buttonLoading: false,
      requirePermissionChecked: false
    }
  }

  handleCreateProject = (values) => {
    const {dispatch, change, reset} = this.props;

    //console.log('values:', values);
    //change('buttonStatus', 'loading');
    this.setState({
      buttonLoading: true
    });

    dispatch(actions.startCreateProject({...values, change})).then(() => {
      reset();

      this.setState({
        buttonLoading: false,
      })
    });
  }

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
      <Form.TextArea inline rows={3} label={label} placeholder={placeholder} {...input} error={touched && error}/>
    );
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

  renderManagers = ({input, label, type, meta: {touched, error}}) => {
    //console.log('renderFileUploader this.fileUploader', this.fileUploader);
    const {users, username} = this.props;
    //console.log('renderManagers users:', users);
    const options = users.map(({username}) => ({key: username, text: username, value: username}));
    const value = input.value || [username];
    //console.log('options:', options);

    return (
      <Form.Field>
        <label>{label}</label>
        <Dropdown placeholder="Managers" className="medium-top-margin" fluid multiple selection options={options} value={value} onChange={(e, {value}) => input.onChange(value)} error={touched && error}/>
      </Form.Field>
    );
  }

  renderRequiresPermission = ({input, label, type}) => {
    //console.log('renderRequiresPermission input:', input);
    return (
      <Form.Checkbox toggle label={label} onChange={(e, {checked}) => input.onChange(checked)} checked={input.checked}/>
    )
    // input.onChange(event, data
    // <input label={label} {...input} type={type}/>
  }

  renderAllowedUsers = ({input, label, type, meta: {touched, error}}) => {
    //console.log('renderFileUploader this.fileUploader', this.fileUploader);
    const {users} = this.props;
    //console.log('renderManagers users:', users);
    const options = users.map(({username}) => ({key: username, text: username, value: username}));
    const value = input.value || [];
    //console.log('options:', options);

    return (
      <Form.Field>
        <label>{label}</label>
        <Dropdown placeholder="Users" className="medium-top-margin" fluid multiple selection options={options} value={value} onChange={(e, {value}) => input.onChange(value)}/>
      </Form.Field>
    );
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

  handleChangeRequirePermission = () => {
    const {requirePermissionChecked} = this.state;
    this.setState({
      requirePermissionChecked: !requirePermissionChecked
    })
  }

  render () {
    const {requiresPermission, isLoading} = this.props;
    //console.log('isLoading:', isLoading);
    const {buttonLoading} = this.state;

    const dua = () => {
      if(requiresPermission){
        return (
          <div>
            <Field name="dua" component={this.renderTextArea} label="Data User Agreement:" placeholder="You can provide Data User Agreement here"/>
            <Field name="allowedUsers" component={this.renderAllowedUsers} label="Allowed Users"/>
          </div>
        )
      }else{
        return null;
      }
    }

    const createProject = () => {
      if(isLoading){
        return (
          <SpinningWheel/>
        )
      }else{
        return (
          <Card fluid>
            <Card.Content>
              <Form>
                <Field name="title" component={this.renderField} type="text" label="Title:" placeholder="My awesome project"/>
                <Field name="description" component={this.renderTextArea} label="Description:" placeholder="Description of my awesome project"/>
                <Field name="logoImage" component={this.renderLogoImage} type="file" label="Logo:"/>
                <Field name="fileList" component={this.renderFileList} type="file" label="Attach Files:"/>
                <Field name="managers" component={this.renderManagers} label="Managers"/>
                <Field name="requiresPermission" component={this.renderRequiresPermission} type="checkbox" label="Requires Permission"/>
                {dua()}
              </Form>
              <div className="large-top-margin">
                <Button primary loading={buttonLoading} floated="right" onClick={this.props.handleSubmit(this.handleCreateProject)}>Save</Button>
                <Button negative floated="right" onClick={this.resetForm}>Reset</Button>
              </div>
            </Card.Content>
          </Card>
        )
      }
    }

    return (
      <div>
        {createProject()}
      </div>
    )

    // <Form.Checkbox toggle label="Requires Permission" onChange={this.handleChangeRequirePermission} checked={requirePermissionChecked}/>

    // <div className="large-top-margin">
    //   <Button primary loading={loading} floated="right" onClick={this.props.handleSubmit(this.handleCreateProject)}>Save</Button>
    //   <Button negative floated="right" onClick={this.resetForm}>Reset</Button>
    // </div>
    // <div className="medium-top-margin">
    //   <Checkbox toggle label="Requires Permission" onChange={this.handleChangeRequirePermission} checked={requirePermissionChecked}/>
    // </div>
  }
  // <div style={{clear:"both"}}/>
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

CreateProject = connect((state) => {  //)(CreateProject);
  const requiresPermission = selector(state, 'requiresPermission');
  const {users, isLoading, auth: {username}} = state;
  const initialValues = {
    managers: [username]
  }
  // console.log('users:', users);
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
  return {requiresPermission, users, isLoading, username, initialValues};
})(CreateProject);

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
