import { event } from './gtag';

export class APIError {
  constructor(obj) {
    this.code = obj.code;
  }
}

const fetchPost = async (url, content) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(content),
  });
  event({ action: url });

  let resJson;
  try {
    resJson = await res.json();
  } catch {
    throw new APIError({ code: res.status });
  }

  if (!res.ok) {
    throw new APIError(resJson);
  }

  return resJson;
};

export default fetchPost;
