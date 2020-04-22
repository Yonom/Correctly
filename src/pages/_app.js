import { SWRConfig } from "swr"

export default ({ Component, pageProps }) => {
  return (
    <SWRConfig
      value={{
        fetcher: (...args) => fetch(...args).then(res => res.json())
      }}>
        <Component {...pageProps} />
    </SWRConfig>
  );
};