import Error from 'next/error';
import { useRouter } from 'next/router';

// TODO link back to application etc.
export default () => {
  const { query: { statusCode, title } } = useRouter();
  return (
    <Error statusCode={statusCode} title={title} />
  );
};
