import * as React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import theme from "../src/theme/theme";
import createEmotionCache from "../src/createEmotionCache";
import FullLayout from "../src/layouts/FullLayout";
import HomeLayout from "../src/layouts/HomeLayout";
import "../styles/style.css";
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  // const getLayout = ((page) => page)
  // const getLayout = Component.getLayout
  // const getLayout = Component.getLayout || ((page) => page)
  const getLayout = Component.getLayout || ((page) => <FullLayout>{page}</FullLayout>)
  console.log(getLayout, "Component")
  // {getLayout(<Component {...pageProps} />)}



  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Vigoplace Admin Console</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {getLayout(<Component {...pageProps} />)}
        {/* <FullLayout>
          <Component {...pageProps} />
        </FullLayout> */}
      </ThemeProvider>
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
