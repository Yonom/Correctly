import { mutate } from 'swr';

const fetchGet = (...args) => fetch(...args).then(async (res) => {
  if (!res.ok) throw await res.json();
  return await res.json();
});

export const revalidateSWR = (url) => {
  mutate(url, async () => {
    return await fetchGet(url);
  });
};

export default fetchGet;
