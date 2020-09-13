const fetchGet = (...args) => fetch(...args).then(async (res) => {
  if (!res.ok) throw await res.json();
  return await res.json();
});

export default fetchGet;
