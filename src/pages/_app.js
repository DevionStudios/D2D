import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "@web3uikit/core";

import { DefaultSeo } from "next-seo";
import { NProgress } from "~/components/ui/NProgress";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import "../styles.css";
import { toastOptions } from "~/utils/toastOptions";
import axios from "axios";

function MyApp({ Component, pageProps, currentUser }) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <ThemeProvider storageKey="preferred-theme" attribute="class">
      <DefaultSeo defaultTitle="Foxxi" titleTemplate="%s | Foxxi" />
      <NProgress />
      <Toaster position="top-right" toastOptions={toastOptions} />
      <MoralisProvider initializeOnMount={false}>
        <NotificationProvider>
          {getLayout(<Component {...pageProps} currentUser={currentUser} />)}
        </NotificationProvider>
      </MoralisProvider>
    </ThemeProvider>
  );
}

MyApp.getInitialProps = async (appContext) => {
  let data = {};
  if (typeof window === "undefined" && appContext.ctx.req != null) {
    const { data: responseData } = await axios.get(
      "http://localhost:5000/api/users/currentuser",
      {
        headers: {
          cookies: appContext.ctx.req.headers.cookie,
        },
      }
    );
    data = responseData;
  } else {
    const { data: responseData } = await axios.get(
      "http://localhost:5000/api/users/currentuser",
      {
        headers: {
          cookies: document.cookie,
        },
      }
    );
    data = responseData;
  }
  console.log(data);
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      data.currentuser
    );
  }

  return {
    pageProps,
    ...data,
  };
};

export default MyApp;
