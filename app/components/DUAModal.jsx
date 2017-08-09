import React from 'react';
//import Modal from 'react-modal';
import {connect} from 'react-redux';
import {hashHistory, Link} from 'react-router';
import {Field, reduxForm} from 'redux-form';
import {Modal, Form, Divider, Button, Message, Segment, Checkbox, Icon} from 'semantic-ui-react';

import * as actions from 'actions';

const validate = (values) => {
  const errors = {};
  console.log('Validate values:', values);

  if(!values.firstName){
    errors.firstName = 'Please enter first name'
  }

  if(!values.lastName){
    errors.lastName = 'Please enter last name'
  }

  // if(!values.email){
  //   errors.email = 'Please enter email'
  // }else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)){
  //   errors.email = 'Invalid email';
  // }

  if(!values.institution){
    errors.institution = 'Please enter password'
  }

  return errors;
}

class DUAModal extends React.Component {

  constructor(props){
    super(props);
    //this.handleOpenModal = this.handleOpenModal.bind(this);
    this.state = {
      DUAChecked: false,
      firstModalOn: true
    }
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleOpenSignUpModal = this.handleOpenSignUpModal.bind(this);
    this.handleProceed = this.handleProceed.bind(this);
    this.handleGoBack = this.handleGoBack.bind(this);

  }

  toggleDUACheckbox = () => {
    this.setState({
      DUAChecked: !this.state.DUAChecked
    })
  }

  handleCloseModal () {
    //const {dispatch} = this.props;
    this.props.onClose();

    //dispatch(actions.setCurrentModal(null));
    //hashHistory.goBack();
    // this.setState({
    //   modalIsOpen: false
    // })
  }

  handleOpenSignUpModal () {
    const {dispatch} = this.props;

    dispatch(actions.setCurrentModal('SignUp'));

    // this.setState({
    //   modalIsOpen: false
    // })
  }

  // componentWillUnmount () {
  //   const {dispatch} = this.props;
  //
  //   if(this.props.auth.error){
  //     dispatch(actions.authError(null));
  //   }
  // }

  handleProceed () {
    this.setState({
      firstModalOn: false
    });
  }

  handleGoBack () {
    this.setState({
      firstModalOn: true
    });
  }

  handleSubmit = (values) => {
    this.props.onSubmit(values);
  }

  renderField = ({input, label, type, meta: {touched, error}}) => {
    // console.log('renderField touched, error:', touched, error);
    return (
      <Form.Input {...input} placeholder={label} type={type} error={touched && error}/>
    )
    //{touched && error && <Message negative>{error}</Message>}

    // <fieldset>
    //   <div>
    //     <input className="modal-input" {...input} placeholder={label} type={type}/>
    //     {touched && error && <div className="login-error">{error}</div>}
    //   </div>
    // </fieldset>
  }

  renderAuthError () {
    if(this.props.auth.error){
      return (
        <Message error content={this.props.auth.error}/>
      )
      // <div className="login-error">
      //   {this.props.auth.error}
      // </div>
    }else{
      return null;
    }
  }

  render () {
    const {open, dua} = this.props;
    const {DUAChecked, firstModalOn} = this.state;

    const proceedButton = () => {
      if(DUAChecked){
        return (
          <Modal.Actions>
            <Button primary onClick={this.handleProceed}>
              Proceed <Icon name='right chevron' />
            </Button>
          </Modal.Actions>
        )
      }else{
        return null;
      }
    }

    const duaModal = () => {
      if(firstModalOn){
        return (
          <Modal size="small" open={open} onClose={this.handleCloseModal}>
            <Modal.Header>Data User Agreement</Modal.Header>
            <Modal.Content scrolling>
              <Modal.Description>
                <Segment>
                  {dua}
                </Segment>
                <Checkbox label="I Agree" onChange={this.toggleDUACheckbox} checked={DUAChecked}/>
              </Modal.Description>
            </Modal.Content>
            {proceedButton()}
          </Modal>
        )
      }else{
        return (
          <Modal size="small" open={open} onClose={this.handleCloseModal}>
            <Modal.Header>Data User Agreement</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <Form>
                  <Field name="firstName" component={this.renderField} type="text" label="First name"/>
                  <Field name="lastName" component={this.renderField} type="text" label="Last name"/>
                  <Field name="institution" component={this.renderField} type="text" label="Institution"/>
                </Form>
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <Button primary basic onClick={this.handleGoBack}>
                Back <Icon name="left chevron"/>
              </Button>
              <Button primary onClick={this.props.handleSubmit(this.props.onDUASubmit)}>
                Submit
              </Button>
            </Modal.Actions>
          </Modal>
        )
      }
    }

    return (
      <div>
        {duaModal()}
      </div>
    )
    // <Field name="email" component={this.renderField} type="text" label="Email"/>
    // onSubmit={this.props.handleSubmit(this.handleUsernamePasswordLogin)}
    // <Form.Button fluid primary>Login</Form.Button>

  }
}

DUAModal = (reduxForm({
  form: 'dua',
  validate
})(DUAModal));

// DUAModal = connect((state, ownProps) => {
//   const {params: {projectId}} = ownProps;
//   console.log('projectId:', projectId);
//   return {projectId}
// })(DUAModal);

export default DUAModal;
