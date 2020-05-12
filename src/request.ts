/*
import { get } from 'lodash';
import { getItem } from '../../storage';

export default class HttpHandler {
  constructor(resource = '', api = process.env.GATSBY_HOST + '/api') {
    this.url = api + resource;
  }

  _jsonToQueryString = obj => (
    obj ? `?${new URLSearchParams(obj).toString()}` : ''
  );

  _buildUrl(params) {
    const querystring = typeof params === 'string' ? params : this._jsonToQueryString(params);
    return `${this.url}/${querystring}`;
  }

  _getAuthorizationHeader() {
    const token = getItem('token');
    return token ? { Authorization: `bearer ${token}` } : {};
  }

  getConf(method, body) {
    let result = {
      method,
      headers: { 'content-type': 'application/json', ...this._getAuthorizationHeader() },
      mode: 'cors'
    };

    if (body) {
      result.body = JSON.stringify(body);
    }

    return result;
  }

  get(params = '') {
    return fetch(this._buildUrl(params), this.getConf('GET'))
      .then(data => data.json())
      .then(data => data)
      .catch(this.onError);
  }

  post(body) {
    return this.requestWrite(body, 'POST');
  }

  put(body) {
    return this.requestWrite(body, 'PUT');
  }

  async requestWrite(body, method) {
    if (!body) {
      throw new Error('This request needs body');
    } else if (!method) {
      throw new Error('This request needs method');
    }

    try {
      const response = await fetch(this.url, this.getConf(method, body))
      const data = await response.json();
      return response.ok ? data : this.onError({ statusCode: response.status, data });
    } catch (error) {
      throw error;
    }
  }

  formatErrorMessages = (messages = []) => (
    messages.map(({ text = '' }) => text).join(', ')
  )

  onError({ statusCode, data = {} }) {
    const errorMessages = get(data, 'messages') || [];
    const hasErrors = errorMessages.length > 0;
    const isBadRequest = statusCode === 400;
    const shouldFormatErrorMessage = hasErrors && isBadRequest;

    throw new Error(
      shouldFormatErrorMessage
        ? this.formatErrorMessages(errorMessages)
        : 'Ocorreu um erro inesperado.'
    );
  }

}
*/