import { DefaultSeo } from "next-seo";
import { NProgress } from "~/components/ui/NProgress";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import "../styles.css";
import { toastOptions } from "~/utils/toastOptions";

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <ThemeProvider storageKey="preferred-theme" attribute="class">
      <DefaultSeo defaultTitle="DogeSocial" titleTemplate="%s | DogeSocial" />
      <NProgress />
      <Toaster position="top-right" toastOptions={toastOptions} />
      {getLayout(<Component {...pageProps} />)}
    </ThemeProvider>
  );
}
export default MyApp;
