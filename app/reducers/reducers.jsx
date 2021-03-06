import moment from 'moment';

// Note that myFile is an object that contains file DOM object and progress variable
export var fileUploadListReducer = (state = [], action) => {
  switch(action.type){
    case 'SET_FILE_UPLOAD_LIST':
      return action.fileList;
    case 'UPDATE_FILE_UPLOAD_PROGRESS':
      return state.map((myFile) => {
        //Note that I can't use file id because it is not in the database yet
        if(myFile.file.name === action.name){
          return {
            file: myFile.file,
            progress: action.progress
          }
        }else{
          return myFile;
        }
      });
    case 'DELETE_FILE_FROM_UPLOAD_LIST':
      return state.filter((myFile) => {
        return myFile.file.name !== action.name;
        // if(myFile.file.name !== action.name){
        //   return myFile
        // }
      });
    default:
      return state;
  }
}

// const initState = {
//   title: null,
//   description: null,
//   fileList: [],
//   logoImage: null
// }

// export var createProjectReducer = (state = {buttonStatus: 'disabled'}, action) => {
//   switch(action.type){
//     case 'CHANGE_CREATE_PROJECT_BUTTON_STATUS':
//       const {buttonStatus} = action;
//       return {
//         buttonStatus
//       }
//     // case 'SET_CREATE_PROJECT_FILE_UPLOAD_LIST':
//     //   const {fileList} = action;
//     //   return {
//     //     ...state,
//     //     fileList
//     //   }
//     // case 'SET_CREATE_PROJECT_LOGO_IMAGE':
//     //   const {logoImage} = action;
//     //   return {
//     //     ...state,
//     //     logoImage
//     //   }
//     // case 'CLEAR_CREATE_PROJECT_FORM':
//     //   return initState;
//     // case 'DELETE_LOGO_IMAGE_FROM_CREATE_PROJECT_FORM':
//     //   return {
//     //     ...state,
//     //     logoImage: null
//     //   }
//     default:
//       return state;
//   }
// }

export const projectReducer = (state = [], action) => {
  switch(action.type){
    case 'ADD_PROJECT':
      return [
        ...state,
        action.project
      ]

    case 'ADD_PROJECTS':
      return [
        ...state,
        ...action.projects
      ]

    case 'UPDATE_PROJECT':
      return state.map((project) => {
        if(project.id === action.project.id){
          var files = [
            ...project.files,
            ...(action.project.files || [])
          ]
          return {...project, ...action.project, files}
          //return action.project;
        }else{
          return project
        }
      });

    case 'DELETE_PROJECT':
      return state.filter((project) => {
        return  project.id !== action.id; //project.id === action.id ? false : true;
      });

    case 'DELETE_FILE':
      return state.map((project) => {
        if(project.id === action.projectId){
          var files = project.files.filter((file) => {
            return !(file.id === action.fileId);
          });
          return {
            ...project,
            files
          }
        }else{
          return project;
        }
      });

    case 'UPDATE_PROJECT_MANAGERS':
      return state.map((project) => {
        if(project.id === action.id){
          return {...project, managers: action.managers}
        }else{
          return project;
        }
      });

    case 'DELETE_PROJECT_MANAGER':
      return state.map((project) => {
        if(project.id === action.id){
          const managers = project.managers.filter((m) => {
            return m !== action.username;
          });
          return {...project, managers}
        }else{
          return project;
        }
      });

    case 'DELETE_ALLOWED_USER':
      return state.map((project) => {
        if(project.id === action.id){
          const allowedUsers = project.allowedUsers.filter((username) => {
            return username !== action.username;
          });
          return {...project, allowedUsers}
        }else{
          return project;
        }
      });

    case 'UPDATE_ALLOWED_USERS':
      return state.map((project) => {
        if(project.id === action.id){
          return {...project, allowedUsers: action.allowedUsers}
        }else{
          return project
        }
      });

    case 'ADD_USER_TO_ALLOWED_USERS':
      return state.map((project) => {
        if(project.id === action.id){
          //Set insures that array is unque
          return {...project, allowedUsers: [...new Set([...project.allowedUsers, action.username])]}
        }else{
          return project
        }
      });

    case 'ADD_DUA_REQUEST':
      return state.map((project) => {
        if(project.id === action.id){
          return {...project, DUARequests: [...project.DUARequests, action.values]}
        }else{
          return project;
        }
      });

    case 'DELETE_DUA_REQUEST':
      return state.map((project) => {
        if(project.id === action.id){
          const newDUARequests = project.DUARequests.filter((req) => {
            return req.id !== action.DUARequestId;
          });
          console.log('newDUARequests', newDUARequests);

          return {...project, DUARequests: newDUARequests}
        }else{
          return project;
        }
      });

    default:
      return state;
  }
}

export const userReducer = (state = [], action) => {
  switch(action.type) {
    case 'ADD_USERS':
      return [
        ...state,
        ...action.users
      ];

    case 'UPDATE_USERS':
      return [
        ...action.users
      ];

    case 'UPDATE_USER_ROLE':
      return state.map((user) => {
        if(user.id === action.id){
          return {...user, role: action.role}
        }else{
          return user;
        }
      });

    case 'DELETE_USER':
      return state.filter((user) => {
        return user.id !== action.id;
      });

    case 'DELETE_USERS':
      return [];

    default:
      return state;
  }
}

export const authReducer = (state = {isAuth: false, error: null, role: null, token: null, username: null, email: null}, action) => {
  switch(action.type) {
    case 'AUTH_USER':
      return {
        ...state,
        isAuth: true,
        error: null,
        role: action.role,
        token: action.token,
        username: action.username,
        email: action.email
      };

    case 'AUTH_ERROR':
      return {
        ...state,
        error: action.error
      }

    case 'LOGOUT':
      return {
        ...state,
        isAuth: false,
        error: null,
        role: null,
        token: null,
        username: null,
        email: null
      }

    default:
      return state;
  }
}

// export var setLoginStatus = (state = false, action) => {
//   switch(action.type) {
//     case 'SET_LOGIN_STATUS':
//       return action.status;
//     default:
//       return state;
//   }
// }

export var activeProjectReducer = (state = '', action) => {
  switch(action.type){
    case 'SET_ACTIVE_PROJECT':
      return action.id;
    default:
      return state;
  }
}

export var editModeStatusReducer = (state = false, action) => {
  switch(action.type) {
    case 'CHANGE_EDIT_MODE_STATUS':
      return action.status;
    default:
      return state;
  }
}

export var setLoadingStatusReducer = (state = false, action) => {
  switch(action.type) {
    case 'SET_LOADING_STATUS':
      return action.status;
    default:
      return state;
  }
}

export var setSearchText = (state = '', action) => {
  switch(action.type) {
    case 'SET_SEARCH_TEXT':
      return action.text;
    default:
      return state;
  }
}

export const setRedirectUrl = (state = '/', action) => {
  switch(action.type) {
    case 'SET_REDIRECT_URL':
      return action.url;
    default:
      return state
  }
}

export const modalReducer = (state = null, action) => {
  switch(action.type) {
    case 'SET_CURRENT_MODAL':
      return action.currentModal;
    default:
      return state;
  }
}
