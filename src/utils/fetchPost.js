export class APIError {
  constructor(obj) {
    this.code = obj.code;
  }
}

export default async (url, content) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(content),
  });
  if (res.status !== 200) {
    throw new APIError(await res.json());
  }
  return await res.json();
};
