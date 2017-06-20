//import firebase, {firebaseRef, firebaseStorageRef, githubProvider} from 'app/firebase/';
import moment from 'moment';
import * as dbAPI from 'ResearchDataAPI';

const DEFAULT_IMAGE_URL =  'https://firebasestorage.googleapis.com/v0/b/research-data-app.appspot.com/o/icons%2Fdefault-project.png?alt=media&token=a16a1fa3-df80-4c28-becf-562ff9a61d13';

export var setLoadingStatus = (status) => {
  return {
    type: 'SET_LOADING_STATUS',
    status
  }
}

export var setSearchText = (text) => {
  return {
    type: 'SET_SEARCH_TEXT',
    text
  }
}


export var setActiveProject = (id) => {
  return {
    type: 'SET_ACTIVE_PROJECT',
    id
  }
}

export var changeEditModeStatus = (status) => {
  return {
    type: 'CHANGE_EDIT_MODE_STATUS',
    status
  }
}

export var deleteProject = (id) => {
  return {
    type: 'DELETE_PROJECT',
    id
  }
}

export const authError = (error) => {
  return {
    type: 'AUTH_ERROR',
    error
  }
}

export const authUser = (token) => {
  return {
    type: 'AUTH_USER',
    token
  }
}

export const setCurrentModal = (currentModal) => {
  return {
    type: 'SET_CURRENT_MODAL',
    currentModal
  }
}

export const startSignUpUser = (email, password) => {
  return (dispatch, getState) => {
    return dbAPI.signUp(email, password).then((user) => {
      console.log('startSignUpUser user:', user);
      dispatch(authUser(user.token));
      localStorage.setItem('researchDataAppToken', user.token);
    }).catch((err) => {
      console.log('startSignUpUser error:', err);
      dispatch(authError(err));
      return Promise.reject();
    });
  }
  // return (dispatch, getState) => {
  //   return firebase.auth().createUserWithEmailAndPassword(credentials.email, credentials.password).then((user) => {
  //   //   console.log('user:', user);
  //   //   return firebaseRef.child(`users/${user.uid}`).set({role: 'user'});
  //   // }).then(() => {
  //     dispatch(authUser('user'));
  //   }).catch((err) => {
  //     dispatch(authError(err.message));
  //   });
  // }
}

export const verifyAuth = () => {
  return (dispatch, getState) => {
    const token = localStorage.getItem('researchDataAppToken');
    console.log('verifyAuth token:', token);
    if(token){
      dispatch(authUser(token));
    }
  }
}

export const startEmailPasswordLogin = (email, password) => {
  console.log('email:', email);
  console.log('password:', password);
  return (dispatch, getState) => {
    return dbAPI.login(email, password).then((user) => {
      console.log('startEmailPasswordLogin user:', user);
      dispatch(authUser(user.token));
      localStorage.setItem('researchDataAppToken', user.token);
    }).catch((err) => {
      console.log('startEmailPasswordLogin error:', err);
      dispatch(authError(err));
      return Promise.reject();
    });

    // return firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password).then((user) => {
    //   return firebaseRef.child(`users/${user.uid}/role`).once('value');
    // }).then((snapshot) => {
    //   console.log('user role', snapshot.val());
    //   dispatch(authUser(snapshot.val()));
    // }).catch((err) => {
    //   //console.log('startEmailPasswordLogin:', err);
    //   dispatch(authError(err.message));
    // });
  }
}

export var login = () => {
  return {
    type: 'SET_LOGIN_STATUS',
    status: true
  }
}

// export var startGithubLogin = () => {
//   return (dispatch, getState) => {
//     return firebase.auth().signInWithPopup(githubProvider).then((result) => {
//       console.log('Auth worked', result);
//       dispatch(authUser());
//     }).catch((e) => {
//       console.log('Unable to auth', e);
//     });
//   }
// }

export var logout = () => {
  return {
    type: 'LOGOUT',
  }
}

export var startLogout = () => {
  return (dispatch, getState) => {
    const {auth: {token}} = getState();
    return dbAPI.logout(token).then(() => {
      console.log('token was removed from MongoDB');
      localStorage.removeItem('researchDataAppToken');
      dispatch(logout());
    }).catch((err) => {
      console.log('Logout error:', err);
    })

    // return firebase.auth().signOut().then(() => {
    //   dispatch(logout());
    //   //console.log('Successfully logged out');
    // }).catch((e) => {
    //   //console.log('Error while trying to log out', e);
    // });
  }
}

export const setRedirectUrl = (url) => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      resolve();
    }).then(() => {
      dispatch({
        type: 'SET_REDIRECT_URL',
        url
      });
    });
  }
}

export var startDeleteProject = (projectId) => {
  return (dispatch, getState) => {
    const {auth: {token}} = getState();

    return dbAPI.deleteProject(projectId, token).then((project) => {
      dispatch(deleteProject(projectId));
    })
  }
}

// export var startDeleteProject = (id, files) => {
//
//   return (dispatch, getState) => {
//     var projectRef = firebaseRef.child('projects/' + id);
//
//     var seq = Promise.resolve();
//
//     files.forEach((myFile) => {
//       seq = seq.then(() => {
//         console.log('file name:', myFile.name, 'File:', myFile);
//         return firebaseStorageRef.child(id + '/' + myFile.name).delete();
//       });
//     });
//
//     return seq.then(() => {
//       return projectRef.remove();
//     }).then(() => {
//       dispatch(deleteProject(id));
//     });
//   }
// }

export var addProjects = (projects) => {
  return {
    type: 'ADD_PROJECTS',
    projects
  }
}

export var startAddProjects = () => {
  return (dispatch, getState) => {
    dispatch(setLoadingStatus(true));

    dbAPI.getProjects().then((projects) => {
      console.log('projects:', projects);
      // console.log('newProjects:', newProjects);
      dispatch(addProjects(projects));
      dispatch(setLoadingStatus(false));
    });
  }
}

// export var startAddProjects = () => {
//
//   return (dispatch, getState) => {
//     //console.log('inside startAddProjects');
//     dispatch(setLoadingStatus(true));
//     var projectsRef = firebaseRef.child('projects');
//
//     return projectsRef.once('value').then((snapshot) => {
//       //console.log('shapshot:', snapshot.val());
//
//       var firebaseProjects = snapshot.val() || {};
//
//       var keys = Object.keys(firebaseProjects);
//       var projects = keys.map((key) => {
//         var projectFiles = firebaseProjects[key].files || {};
//         var fileKeys = Object.keys(projectFiles);
//         return {
//           ...firebaseProjects[key],
//           files: fileKeys.map((fKey) => {
//             return {
//               ...firebaseProjects[key].files[fKey],
//               id: fKey
//             }
//           }),
//           id: key
//         }
//       });
//
//       dispatch(addProjects(projects));
//       dispatch(setLoadingStatus(false));
//     });
//   }
// }

export var addProject = (project) => {
  return {
    type: 'ADD_PROJECT',
    project
  }
}

export var deleteFile = (projectId, fileId) => {
  return {
    type: 'DELETE_FILE',
    projectId,
    fileId
  }
}

export var startDeleteFile = (projectId, fileId) => {
  return (dispatch, getState) => {
    const {auth: {token}} = getState();
    return dbAPI.deleteFile(projectId, fileId, token).then(() => {
      dispatch(deleteFile(projectId, fileId));
    });
  }
}

// export var startDeleteFile = (projectId, fileId, fileName) => {
//   return (dispatch, getState) => {
//     return firebaseStorageRef.child(projectId + '/' + fileName).delete().then(() => {
//       return firebaseRef.child('projects/' + projectId + '/files/' + fileId).remove();
//     }).then(() => {
//       dispatch(deleteFile(projectId, fileId));
//     }).catch((e) => {
//       console.log('firebase error:', e);
//     });
//   }
// }

// export var startUpdateFileSelection = (projedtId, fileId, isSelected) => {
//   return (dispatch, getState) => {
//     return firebaseRef.child('projects/' + projectId + '/files/' + fileId).update({isSelected}).then((snapshot) => {
//
//     })
//   }
// }

export const setCreateProjectFileUploadList = (fileList) => {
  return {
    type: 'SET_CREATE_PROJECT_FILE_UPLOAD_LIST',
    fileList
  }
}

export const setCreateProjectLogoImage = (logoImage) => {
  return {
    type: 'SET_CREATE_PROJECT_LOGO_IMAGE',
    logoImage
  }
}

export const clearCreateProjectForm = () => {
  return {
    type: 'SET_CLEAR_CREATE_PROJECT_FORM'
  }
}

export const setFileUploadList = (fileList) => {
  return {
    type: 'SET_FILE_UPLOAD_LIST',
    fileList
  }
}

export const updateFileUploadProgress = (name, progress) => {
  return {
    type: 'UPDATE_FILE_UPLOAD_PROGRESS',
    name,
    progress
  }
}

export const deleteFileFromUploadList = (name) => {
  return {
    type: 'DELETE_FILE_FROM_UPLOAD_LIST',
    name
  }
}

export var updateProject = (project) => {
  return {
    type: 'UPDATE_PROJECT',
    project
  }
}

export var startUpdateProject = ({id, title, description, fileList, uploadFileList=[], change, array}) => {
  return (dispatch, getState) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);

    const {auth: {token}} = getState();
    return dbAPI.updateProject(id, formData, token).then(() => {
      dispatch(updateProject({id, title, description}));

      let seq = Promise.resolve();

      let numOfDeletedFiles = 0;
      fileList.forEach((myfile, i) => {
        if(myfile.selected){
          seq = seq.then(() => {
            return dbAPI.deleteFile(id, myfile.id, token);
          }).then(() => {
            dispatch(deleteFile(id, myfile.id));
            //Note that since array size is changing, everytime I have to find the current index
            //console.log('array:', array);
            console.log('inside promise i:', i, 'numOfDeletedFiles', numOfDeletedFiles);
            array.remove('fileList', i - numOfDeletedFiles);
            numOfDeletedFiles++;
            // for(let i=0; i<array.length; i++){
            //   if(array[i].id === myfile.id){
            //     array.remove('fileList', i);
            //     break;
            //   }
            // }
          });
        }
      });

      let numOfUploadedFiles = 0;
      uploadFileList.forEach((myfile, i) => {
        seq = seq.then(() => {
          const fd = new FormData();
          fd.append('dataFiles', myfile.file);
          console.log('my file:', myfile);
          //Note that myfile object contains file object and progress property
          //const uploadProgress = null;
          const uploadProgress = (e) => {
              const progress = (100.0 * e.loaded) / e.total;
              //Note that I have to use a hack because array size changes and indexes can not be used
              //Because files are always deleted at the end I assume that the index of the next file is
              //always 0. If there is an error to delete a file, it may cause a problem
              change(`uploadFileList[${i - numOfUploadedFiles}].progress`, progress);
              //uploadProgressFunction(progress);
              //dispatch(actions.updateFileUploadProgress(filename, progress));
          }
          return dbAPI.uploadFile(id, fd, token, uploadProgress);
        }).then((doc) => {
          //Note that the updated project is not in Redux store yet
          //console.log('doc:', doc);
          dispatch(updateProject({id, files: [doc]}));
          array.push('fileList', {...doc, selected: false});
          array.remove('uploadFileList', i - numOfUploadedFiles);
          numOfUploadedFiles++;
          //array.shift('uploadFileList');
          //array.remove('uploadFileList', i);
          //dispatch(deleteFileFromUploadList(myfile.file.name));
          //files.push(doc);
        });
      });

      return seq;
    });

    // .then(() => {
    //   dispatch(updateProject({id, title, description, files}));
    // })

    // fileList.forEach((myfile) => {
    //   formData.append('dataFiles', myfile.file);
    // });
    //
    // return dbAPI.updateProject(id, formData).then((project) => {
    //   console.log('startUpdateProject project:', project);
    //   dispatch(updateProject(project));
    // });
  }
}

// export var startUpdateProject = (id, title, description, fileList) => {
//   return (dispatch, getState) => {
//
//     var project = {
//       id,
//       title,
//       description
//     }
//
//     // var myFiles = [];
//     // let fileInfo = {};
//     var projectRef = firebaseRef.child('projects/' + id);
//
//     return projectRef.update(project).then((snapshot) => {
//       var seq = Promise.resolve();
//
//       //console.log('fileList inside actions:', fileList);
//
//       fileList.forEach(({file}) => {
//         const fileInfo = {
//           name: file.name
//         };
//
//         seq = seq.then(() => {
//           console.log('file name:', file.name, 'File:', file);
//           const uploadTask = firebaseStorageRef.child(id + '/' + file.name).put(file);
//           uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
//             console.log('bytesTransfered:', snapshot.bytesTransferred);
//             console.log('totalBytes:', snapshot.totalBytes);
//
//             const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//             dispatch(updateFileUploadProgress(file.name, progress));
//             console.log('progress:', progress);
//           });
//           return uploadTask;
//         }).then((snapshot) => {
//           fileInfo.url = snapshot.downloadURL;
//           return projectRef.child('files').push(fileInfo);
//         }).then((snapshot) => {
//           fileInfo.id = snapshot.key;
//           dispatch(updateProject({...project, files: [fileInfo]}));
//           dispatch(deleteFileFromUploadList(file.name));
//           //console.log('snapshot.key:', snapshot.key)
//           //myFiles.push({...fileInfo, id: snapshot.key})
//         });
//       });
//
//       return seq;
//
//       // return seq.then(() => {
//       //   console.log('myFiles:', myFiles);
//       //   dispatch(updateProject({...project, id, files: myFiles}));
//       // });
//     });
//   }
// }

export var changeCreateProjectButtonStatus = (buttonStatus) => {
  return {
    type: 'CHANGE_CREATE_PROJECT_BUTTON_STATUS',
    buttonStatus
  }
}

export var deleteLogoImageFromCreateProjectForm = () => {
  return {
    type: 'DELETE_LOGO_IMAGE_FROM_CREATE_PROJECT_FORM'
  }
}

//Note that fileList elements contain DOM file object and progress property
export var startCreateProject = ({title, description, logoImage=null, fileList=null, change}) => {

  return (dispatch, getState) => {
    const {auth: {token}} = getState();

    const formData = new FormData();
    let uploadProgress = null;

    formData.append('title', title);
    formData.append('description', description);

    if(logoImage){
      formData.append('logoImage', logoImage.file);
      uploadProgress = (e) => {
          const progress = (100.0 * e.loaded) / e.total;
          change(`logoImage.progress`, progress);
          //dispatch(actions.updateFileUploadProgress(filename, progress));
      }
    }

    return dbAPI.createProject(formData, token, uploadProgress).then((project) => {
      dispatch(addProject(project));

      let seq = Promise.resolve();

      if(fileList){
        fileList.forEach((myfile, i) => {
          seq = seq.then(() => {
            const fd = new FormData();
            fd.append('dataFiles', myfile.file);
            console.log('my file:', myfile);
            //Note that myfile object contains file object and progress property
            const uploadProgress = (e) => {
                const progress = (100.0 * e.loaded)/e.total;
                change(`fileList[${i}].progress`, progress);
                //uploadProgressFunction(progress);
                //dispatch(actions.updateFileUploadProgress(filename, progress));
            }
            return dbAPI.uploadFile(project.id, fd, token, uploadProgress);
          }).then((doc) => {
            dispatch(updateProject({id: project.id, files: [doc]}));
            //dispatch(deleteFileFromUploadList(myfile.file.name));
            //files.push(doc);
          });
        });
      }

      return seq;

      //change('logoImage', '');
      //dispatch(deleteLogoImageFromCreateProjectForm());

      // fileList.forEach((myfile) => {
      //   formData.append('dataFiles', myfile.file);
      // });
    });
  }
}

// export var startAddProject = (title, description, logoImage, fileList) => {
//   return (dispatch, getState) => {
//
//     const project = {
//       title,
//       description,
//       createdAt: moment().unix(),
//       logoImage: null,
//       files: null
//     }
//
//     const projectsRef = firebaseRef.child('projects');
//     //var fileRef = firebaseStorageRef.child(project.fileName);
//     let myFiles = [];
//     let fileInfo = {};
//     let logoImageInfo =  {
//       name: logoImage ? logoImage.name : 'default-image.png',
//       url: DEFAULT_IMAGE_URL
//     };
//
//     let projectSnapshot;
//
//     return projectsRef.push(project).then((snapshot) => {
//       projectSnapshot = snapshot;
//       return (logoImage ? (firebaseStorageRef.child(projectSnapshot.key + '/' + logoImage.name).put(logoImage)) : undefined);
//     }).then((snapshot) => {
//       if(snapshot) {
//         logoImageInfo.url = snapshot.downloadURL;
//       }
//       return projectsRef.child(projectSnapshot.key + '/logoImage').update(logoImageInfo);
//     }).then((snapshot) => {
//
//       let seq = Promise.resolve();
//
//       //console.log('fileList inside startAddProject actions:', fileList);
//
//       fileList.forEach((myFile) => {
//         seq = seq.then(() => {
//           console.log('file name:', myFile.name, 'File:', myFile);
//           return firebaseStorageRef.child(projectSnapshot.key + '/' + myFile.name).put(myFile);
//         }).then((snapshot) => {
//           fileInfo = {name: myFile.name, url: snapshot.downloadURL};
//           return projectsRef.child(projectSnapshot.key + '/files').push(fileInfo);
//         }).then((snapshot) => {
//           //console.log('snapshot.key:', snapshot.key)
//           myFiles.push({...fileInfo, id: snapshot.key})
//         });
//       });
//
//       return seq;
//     }).then(() => {
//       dispatch(addProject(
//         {
//           ...project,
//           id: projectSnapshot.key,
//           logoImage: logoImageInfo,
//           files: myFiles
//         }
//       ));
//     });

    // return fileRef.put(fileList[0]).then((snapshot) => {
    //   //console.log('download url', snapshot.downloadURL);
    //   //project.fileUrl = snapshot.downloadURL;
    //   return projectRef.push({...project, fileUrl: snapshot.downloadURL});
    // }).then((snapshot) => {
    //   dispatch(addProject(
    //     {
    //       ...project,
    //       id: snapshot.key
    //     }
    //   ));
    // });


    // fileRef.getDownloadURL().then((url) => {
    //   console.log('url:', url);
    // });

    // .then(() => {
    //   return fileRef.getDownloadURL();
    // }).then((url) => {
    //   report.fileUrl = url;
    //   return reportRef.push(report);
    // }).then(() => {
      // dispatch(addReport(
      //   {
      //     ...report,
      //     id: reportRef.key
      //   }
      // ));
    // });
//   }
// }
