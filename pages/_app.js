// add bootstrap css
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.css";
import "../styles/globals.css";
import axios from "axios";

export default function MyApp({ Component, pageProps, currentAdmin }) {
  return <Component {...pageProps} currentUser={currentAdmin} />;
}

MyApp.getInitialProps = async (appContext) => {
  let data = {};
  if (typeof window === "undefined" && appContext.ctx.req != null) {
    const { data: responseData } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/currentadmin`,
      {
        headers: {
          cookies: appContext.ctx.req.headers.cookie,
        },
      }
    );
    data = responseData;
  } else {
    const { data: responseData } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/currentadmin`,
      {
        headers: {
          cookies: document.cookie,
        },
      }
    );
    data = responseData;
  }
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      data.currentAdmin
    );
  }

  return {
    pageProps,
    ...data,
  };
};
