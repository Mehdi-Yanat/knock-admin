import { ReactNode, useEffect, useState } from "react";
import MainHeader from "./components/MainHeader";
import { getGetAccessTokenFromCookie, useGetUserData } from "@utils/core/hooks";
import MainFooter from "./components/MainFooter";
import MarketingPopUp from "../../shared/common/marketingPopup/marketing";
import { useQuery } from "@tanstack/react-query";
import { getPopup } from "@utils/core/API";

export const commonClasses = "leading-relaxed text-primary-2 mx-auto";

const DefaultLayout = ({ children  }: { children: ReactNode  }) => {

  
  
	const popup = useQuery(["get-popup"], () => getPopup(), {
		onSuccess(data) {
      console.log('====================================');
      console.log(data , 'data');
      console.log('====================================');
		  return data;
		},
		refetchInterval: 10000,
	  });


  const [openPopUp, setOpenPop] = useState(false);

  const accessToken = getGetAccessTokenFromCookie();

  useGetUserData({
    enabled: !!accessToken,
    accessToken: accessToken,
  });

  useEffect(() => {
    setTimeout(() => {
      setOpenPop(true);
    }, 5000);
  }, []);

  return (
    <>
      <MainHeader />
      {popup.data ? <MarketingPopUp
        popup={popup.data}
        open={openPopUp}
        onOpenChange={setOpenPop}
      /> : ''}
      <main
        className={`${commonClasses} relative bg-primary-2 mt-main-nav-h w-full flex flex-col`}
      >
        {children}
      </main>
      <MainFooter />
    </>
  );
};

export default DefaultLayout;
