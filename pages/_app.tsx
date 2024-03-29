import type { AppProps } from "next/app";

import dynamic from "next/dynamic";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";
import DefaultLayout from "@components/layouts/Default";
import { DefaultSeo } from "next-seo";

const DynamicTopProgressBar = dynamic(
  () => import("@components/shared/common/TopProgressBar"),
  { ssr: false }
);

import "@styles/globals.css";
import "@styles/swiper.css";
import "@styles/customNProgressStyles.css";
import { SharedCustomerStateProvider } from "context/Customer";
import Script from "next/script";
import { useRouter } from "next/router";
import SEODefaults from "@utils/core/next-seo.config";
import "react-loading-skeleton/dist/skeleton.css";

function MyApp({ Component, pageProps }: AppProps) {
  const [openPopUp, setOpenPop] = useState(false);
  const [openUpSellingPopUp, setOpenUpSellingPop] = useState(false);
  const [openBanner, setBanner] = useState(true);


  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchIntervalInBackground: false,
            refetchOnWindowFocus: false,
            refetchInterval: 3 * 60 * 1000,
          },
        },
      })
  );


  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <SharedCustomerStateProvider>
          <DefaultLayout setBanner={setBanner} openBanner={openBanner} setOpenUpSellingPop={setOpenUpSellingPop} openUpSellingPopUp={openUpSellingPopUp} openPopUp={openPopUp} setOpenPop={setOpenPop} >
            <DynamicTopProgressBar />
            <DefaultSeo {...SEODefaults} />
            <Component openPopUp={openPopUp} {...pageProps} />
          </DefaultLayout>
        </SharedCustomerStateProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
