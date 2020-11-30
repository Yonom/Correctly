/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import { createMocks } from 'node-mocks-http';
import * as fetchGet from '../../src/utils/fetchGet';
import * as fetchPost from '../../src/utils/fetchPost';
import { getTestCookie, setTestCookie } from './setLogin';

const dynamicallyCallAPI = async (url, params) => {
  const { req, res } = createMocks({
    url,
    ...params,
  });
  const urlPart = url.split('?')[0];
  const method = require(`../../src/pages${urlPart}`);
  await method.default(req, res);

  const setCookieHeader = res._getHeaders()['set-cookie'];
  if (setCookieHeader !== undefined) {
    setTestCookie(setCookieHeader);
  }
  return res;
};

export const fetchFileDownload = async (url) => {
  const res = await dynamicallyCallAPI(url, {
    method: 'GET',
    headers: { cookie: getTestCookie() },
    url,
  });

  if (res._getStatusCode() !== 200) throw res._getJSONData();
  return {
    name: res._getHeaders()['content-disposition'].split('"')[1],
    content: res._getBuffer().toString(),
  };
};

const dynamicallyCallJSONAPI = async (url, params) => {
  const res = await dynamicallyCallAPI(url, params);
  const code = res._getStatusCode();
  const data = res._getJSONData();
  if (code !== 200) throw data;
  return res._getJSONData();
};

const apiMock = () => {
  jest
    .spyOn(fetchGet, 'default')
    .mockImplementation(async (url) => dynamicallyCallJSONAPI(url, {
      method: 'GET',
      headers: { cookie: getTestCookie() },
      url,
    }));

  jest
    .spyOn(fetchPost, 'default')
    .mockImplementation(async (url, body) => dynamicallyCallJSONAPI(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: getTestCookie(),
      },
      body,
    }));
};

export default apiMock;
