import axios from 'axios';

import * as actions from 'actions';

export const getFileBlob = (file) => {
  return axios.get(file.url, {responseType: 'blob'})
  .then((response) => {
    return response.data;
  }).catch((err) => {
    //console.log('Error:', err);
    throw new Error(err);
  });
}

export const addDUARequest = (values, projectId, token) => {
  const config = {
    headers: {
      'x-auth': token
    }
  }
  return axios.post(`/projects/${projectId}/duaRequests`, values, config).then((res) => {
    return res.data;
  }).catch((err) => {
    throw err;
  })
}

export const signUp = (username, email, password) => {
  return axios.post('/users', {
    username,
    email,
    password
  }).then((res) => {
    const token = res.headers['x-auth'];
    return {...res.data, token};
  }).catch((err) => {
    return Promise.reject(err.response.data.message);
  });
}

export const login = (username, password) => {
  return axios.post('/users/login', {
    username,
    password
  }).then((res) => {
    //console.log('dbAPI res:', res);
    const token = res.headers['x-auth'];
    return {...res.data, token};
  }).catch((err) => {
    //console.log('dbAPI err:', err.response.data);
    return Promise.reject(err.response.data.message);
  });
}

export const logout = (token) => {
  const config = {
    headers: {
      'x-auth': token
    }
  }
  return axios.delete('/users/me/token', config).then((res) => {
    return res.data;
  }).catch((err) => {
    return Promise.reject(err.response.data.message);
  });
}

export const getProjects = () => {
  return axios.get('/projects').then((res) => {
    return res.data;
  }).catch((err) => {
    return Promise.reject(err);
  });
}

export const getUsers = (token) => {
  const config = {
    headers: {
      'x-auth': token
    },
  }
  return axios.get('/users', config).then((res) => {
    return res.data;
  }).catch((err) => {
    return promise.reject(err);
  });
}

export const updateUserRole = (id, role, token) => {
  //console.log('updateProjetMangers token:', token);
  const config = {
    headers: {
      'x-auth': token
    }
  }
  return axios.patch(`/users/${id}/role`, {role}, config).then((res) => {
    return res.data;
  }).catch((err) => {
    throw err;
  });
}

export const deleteUser = (id, token) => {
  //console.log('updateProjetMangers token:', token);
  const config = {
    headers: {
      'x-auth': token
    }
  }
  return axios.delete(`/users/${id}`, config).then((res) => {
    return res.data;
  }).catch((err) => {
    return Promise.reject(err);
  });
}


export const createProject = (formData, token, uploadProgress) => {
  const config = {
    headers: {
      'x-auth': token
    },
    onUploadProgress: uploadProgress
    // function (e) {
    //     const progress = (100.0 * e.loaded)/e.total;
    //     change(`logoImage.progress`, progress);
    //     //dispatch(actions.updateFileUploadProgress(filename, progress));
    // }
  }

  return axios.post('/projects', formData, config).then((res) => {
    return res.data;
  }).catch((err) => {
    throw new Error(err);
  });
}

export const updateProject = (projectId, formData, uploadProgress, token) => {
  const config = {
    headers: {
      'x-auth': token
    },
    onUploadProgress: uploadProgress
  }
  return axios.patch(`/projects/${projectId}`, formData, config).then((res) => {
    //console.log('axios updateProject:', res.data);
    return res.data;
  }).catch((err) => {
    throw new Error(err);
  });
}

export const updateProjectManagers = (projectId, managers, token) => {
  //console.log('updateProjetMangers token:', token);
  const config = {
    headers: {
      'x-auth': token
    }
  }
  return axios.patch(`/projects/${projectId}/managers`, {managers}, config).then((res) => {
    return res.data;
  }).catch((err) => {
    throw err;
  });
}

export const deleteProjectManager = (projectId, username, token) => {
  //console.log('updateProjetMangers token:', token);
  const config = {
    headers: {
      'x-auth': token
    }
  }
  return axios.delete(`/projects/${projectId}/managers/${username}`, config).then((res) => {
    return res.data;
  }).catch((err) => {
    return Promise.reject(err);
  });
}

export const updateAllowedUsers = (projectId, allowedUsers, token) => {
  //console.log('updateProjetMangers token:', token);
  const config = {
    headers: {
      'x-auth': token
    }
  }
  return axios.patch(`/projects/${projectId}/allowedUsers`, {allowedUsers}, config).then((res) => {
    return res.data;
  }).catch((err) => {
    throw err;
  });
}

export const addUserToAllowedUsers = (projectId, username, token) => {
  //console.log('updateProjetMangers token:', token);
  const config = {
    headers: {
      'x-auth': token
    }
  }
  return axios.post(`/projects/${projectId}/allowedUsers`, {username}, config).then((res) => {
    return res.data;
  }).catch((err) => {
    return Promise.reject(err);
  });
}

export const deleteAllowedUser = (projectId, username, token) => {
  //console.log('updateProjetMangers token:', token);
  const config = {
    headers: {
      'x-auth': token
    }
  }
  return axios.delete(`/projects/${projectId}/allowedUsers/${username}`, config).then((res) => {
    return res.data;
  }).catch((err) => {
    return Promise.reject(err);
  });
}

export const deleteDUARequest = (projectId, DUARequestId, token) => {
  //console.log('updateProjetMangers token:', token);
  const config = {
    headers: {
      'x-auth': token
    }
  }
  return axios.delete(`/projects/${projectId}/DUARequests/${DUARequestId}`, config).then((res) => {
    return res.data;
  }).catch((err) => {
    return Promise.reject(err);
  });
}

export const deleteProject = (projectId, token) => {
  const config = {
    headers: {
      'x-auth': token
    }
  }
  return axios.delete(`/projects/${projectId}`, config).then((res) => {
    return res.data;
  }).catch((err) => {
    throw new Error(err);
  });
}

export const deleteFile = (projectId, fileId, token) => {
  const config = {
    headers: {
      'x-auth': token
    }
  }
  return axios.delete(`/projects/${projectId}/files/${fileId}`, config).then((res) => {
    return res.data;
  }).catch((err) => {
    throw new Error(err);
  });
}

export const uploadFile = (projectId, formData, token, uploadProgress) => {
  const config = {
    headers: {
      'x-auth': token
    },
    onUploadProgress: uploadProgress
    // function (e) {
    //     const progress = (100.0 * e.loaded)/e.total;
    //     uploadProgressFunction(progress);
    //     //dispatch(actions.updateFileUploadProgress(filename, progress));
    // }
  }

  return axios.post(`/projects/${projectId}/files`, formData, config).then((res) => {
    return res.data;
  }).catch((err) => {
    throw new Error(err);
  });
}
