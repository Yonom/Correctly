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
  if (res.status !== 200) {
    try {
      throw new APIError(await res.json());
    } catch (ex) {
      throw new APIError({ code: res.status });
    }
  }
  return await res.json();
};

export default fetchPost;
