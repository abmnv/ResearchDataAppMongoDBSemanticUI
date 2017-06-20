import * as redux from 'redux';
import thunk from 'redux-thunk';

import * as reducers from 'reducers';
import {reducer as formReducer} from 'redux-form';

export var configure = () => {

  var reducer = redux.combineReducers({
    projects: reducers.projectReducer,
    activeProjectId: reducers.activeProjectReducer,
    //editModeStatus: reducers.editModeStatusReducer,
    isLoading: reducers.setLoadingStatusReducer,
    searchText: reducers.setSearchText,
    auth: reducers.authReducer,
    //isLoggedIn: reducers.setLoginStatus,
    redirectUrl: reducers.setRedirectUrl,
    form: formReducer,
    currentModal: reducers.modalReducer,
    uploadFileList: reducers.fileUploadListReducer,
    //createProject: reducers.createProjectReducer
    //fileUploadProgress: reducers.fileUploadProgressReducer
  });

  var store = redux.createStore(reducer, redux.compose(
    redux.applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ));

  return store;
}
