/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import { createMocks } from 'node-mocks-http';
import * as fetchGet from '../../src/utils/fetchGet';
import * as fetchPost from '../../src/utils/fetchPost';
import { getCookie } from './setLogin';

const dynamicallyCallAPI = async (url, params) => {
  const { req, res } = createMocks({
    url,
    ...params,
  });
  const method = require(`../../src/pages${url}`);
  await method.default(req, res);

  if (res._getStatusCode() !== 200) throw res._getJSONData();
  return res._getJSONData();
};

const apiMock = () => {
  jest
    .spyOn(fetchGet, 'default')
    .mockImplementation(async (url) => dynamicallyCallAPI(url, {
      method: 'GET',
      headers: { cookie: getCookie() },
      url,
    }));

  jest
    .spyOn(fetchPost, 'default')
    .mockImplementation(async (url, body) => dynamicallyCallAPI(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: getCookie(),
      },
      body,
    }));
};

export default apiMock;
