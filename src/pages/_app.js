import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "@web3uikit/core";

import { DefaultSeo } from "next-seo";
import { NProgress } from "~/components/ui/NProgress";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import "../styles.css";
import { toastOptions } from "~/utils/toastOptions";

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <MoralisProvider initializeOnMount={false}>
      <NotificationProvider>
        <ThemeProvider storageKey="preferred-theme" attribute="class">
          <DefaultSeo defaultTitle="D2D" titleTemplate="%s | D2D" />
          <NProgress />
          <Toaster position="top-right" toastOptions={toastOptions} />
          {getLayout(<Component {...pageProps} />)}
        </ThemeProvider>
      </NotificationProvider>
    </MoralisProvider>
  );
}
export default MyApp;
