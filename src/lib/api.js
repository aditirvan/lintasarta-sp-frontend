import axios from 'axios'
import Vue from 'vue'
import localstorage from '@/lib/localstorage'

const config = {
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 100000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
}

const GET = (url, params) => REQUEST({...config, method: 'get', url, params})
const POST = (url, data) => REQUEST({...config, method: 'post', url, data})
const POST2 = (url, data) => REQUEST({
  method: 'post',
  url,
  data,
  timeout: 100000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: null,
  },
})
const POSTFORMDATA = (url, data) => REQUEST({...config, method: 'post', url, data, headers: {
  // Accept: 'application/json',
  'Content-Type': 'multipart/form-data',
}})
const DELETE = url => REQUEST({...config, method: 'delete', url})
const PUT = (url, data) => REQUEST({...config, method: 'put', url, data})
const PATCH = (url, data) => REQUEST({...config, method: 'patch', url, data})
const REQUEST = conf => {
  let access_token = (Vue.cookie ? Vue.cookie.get('access_token') : (localstorage.getItem('token') ? localstorage.getItem('token') : null))
  if (access_token) {
    conf.headers.Authorization = 'Bearer ' + access_token
  }

  return new Promise((resolve, reject) => {
    axios
      .request(conf)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        handlesError(error)
        reject(error)
      })
  })
}

/* https://github.com/axios/axios#handling-errors */
function handlesError(error) {
  if (error.response) {
    console.log(error.response);
    /**
     * The request was made and the server responded with a
     * status code that falls out of the range of 2xx
     */
    if (error.response.status && error.response.status === 401) {
      console.log(error.response);
      // router.replace({
      //   name: 'auth.login',
      //   query : { r: router.currentRoute.fullPath },
      // })
      return
    }
    if (error.response.data && error.response.data.errors) {
      console.log(error.response.data.errors);
      // let errors = Object.values(error.response.data.errors)
      // errors.forEach(error => {
      //   Vue.prototype.$notif.error(error.join(' '))
      // })
      // return
    }

    // Vue.prototype.$notif.error(error.response.data.message)
  } else if (error.request) {
    console.log(error.request);
    /**
     * The request was made but no response was received
     * `error.request` is an instance of XMLHttpRequest in the browser
     * and an instance of http.ClientRequest in node.js
     */
    // Vue.prototype.$notif.error(
    //   'Tidak dapat mengakses server. Silakan coba beberapa saat lagi.'
    // )
  } else {
    console.log(error);
    /* Something happened in setting up the request that triggered an Error */
    // Vue.prototype.$notif.error(error.message)
    // Vue.prototype.$notif.error(
    //   'Something happened in setting up the request that triggered an Error'
    // )
  }
}

export default {
  GET,
  POST,
  POST2,
  POSTFORMDATA,
  DELETE,
  PUT,
  PATCH,
  REQUEST,
}
