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

export const signUp = (email, password) => {
  return axios.post('/users', {
    email,
    password
  }).then((res) => {
    const token = res.headers['x-auth'];
    return {...res.data, token};
  }).catch((err) => {
    return Promise.reject(err.response.data.message);
  });
}

export const login = (email, password) => {
  return axios.post('/users/login', {
    email,
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
    throw new Error(err);
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

export const updateProject = (projectId, formData, token) => {
  const config = {
    headers: {
      'x-auth': token
    }
  }
  return axios.patch(`/projects/${projectId}`, formData, config).then((res) => {
    //console.log('axios updateProject:', res.data);
    return res.data;
  }).catch((err) => {
    throw new Error(err);
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
