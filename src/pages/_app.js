import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "@web3uikit/core";
import { SessionProvider } from "next-auth/react";

import { DefaultSeo } from "next-seo";
import { NProgress } from "src/components/ui/NProgress";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import "../styles.css";
import { toastOptions } from "src/utils/toastOptions";
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
          <SessionProvider session={pageProps.session}>
            {getLayout(<Component {...pageProps} currentUser={currentUser} />)}
          </SessionProvider>
        </NotificationProvider>
      </MoralisProvider>
    </ThemeProvider>
  );
}

MyApp.getInitialProps = async (appContext) => {
  let data = {};
  if (typeof window === "undefined" && appContext.ctx.req != null) {
    const { data: responseData } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/currentuser`,
      {
        headers: {
          cookies: appContext.ctx.req.headers.cookie,
        },
      }
    );
    data = responseData;
  } else {
    const { data: responseData } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/currentuser`,
      {
        headers: {
          cookies: document.cookie,
        },
      }
    );
    data = responseData;
  }

  if (data.currentuser === null) {
    data.currentUser = {
      username: "guest",
      name: "Guest",
      image: "https://i.imgur.com/6uY0X2A.png",
      annonymous: true,
    };
  }

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
