import * as React from "react";
import {useState} from 'react'
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider, useSession } from "next-auth/react"
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
import Index from "./index";
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps: { session, ...pageProps } } = props;
  const [queryClient] = React.useState(() => new QueryClient())

  // const getLayout = ((page) => page)
  // const getLayout = Component.getLayout
  // const getLayout = Component.getLayout || ((page) => page)
  const getLayout = Component.getLayout || ((page) => <FullLayout>{page}</FullLayout>)
  // {getLayout(<Component {...pageProps} />)}

  function Auth({ children }) {
    // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
    const { status, data } = useSession({ required: true, })
  
    // if (status === "loading") {
    //   return <p> loading...</p>
    // }
    
    if (status === "unauthenticated") {
      return <Index />
    }

    // if (!Component?.role?.includes(data?.user?.username)) {
    //   return <Index />
    // }


  
    return children
  }



  return (
    <SessionProvider session={session}>
    <QueryClientProvider client={queryClient}>
            {/* Hydrate query cache */}
            <Hydrate state={pageProps.dehydratedState}>
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Vigoplace Admin Console</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {
          Component.auth ? (
            getLayout(
              <Auth>
            <Component {...pageProps} />
             </Auth>
            )
          ) : (
            getLayout(<Component {...pageProps} />)
          )
        }


        {/* {getLayout(
          <Auth>
        <Component {...pageProps} />
        </Auth>
        )} */}


        {/* <FullLayout>
          <Component {...pageProps} />
        </FullLayout> */}
      </ThemeProvider>
    </CacheProvider>
    </Hydrate>
        </QueryClientProvider>
   </SessionProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
