import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import MainHeader from "./components/MainHeader";
import {
  getGetAccessTokenFromCookie,
  useGetUserData,
  useGetUserDataFromStore,
} from "@utils/core/hooks";
import MainFooter from "./components/MainFooter";
import MarketingPopUp from "../../shared/common/marketingPopup/marketing";
import { useQuery } from "@tanstack/react-query";
import { getPopup } from "@utils/core/API";
import Button from "@components/shared/core/Button";

export const commonClasses = "leading-relaxed text-primary-2 mx-auto";

const DefaultLayout = ({
  children,
  setOpenPop,
  openPopUp,
  openBanner,
  setBanner,
}: {
  children: ReactNode;
  setOpenPop: Dispatch<SetStateAction<boolean>>;
  openPopUp: boolean;
  openBanner: boolean;
  setBanner: Dispatch<SetStateAction<boolean>>;
}) => {
  const { user } = useGetUserDataFromStore();
  
  const popup = useQuery(["get-popup"], () => getPopup(), {
    onSuccess(data) {
      return data;
    },
    refetchInterval: 10000,
  });

  const accessToken = getGetAccessTokenFromCookie();

  useGetUserData({
    enabled: !!accessToken,
    accessToken: accessToken,
  });

  return (
    <>
      <MainHeader
        openBanner={openBanner}
        setBanner={setBanner}
        openPopUp={openPopUp}
      />
      {popup.data ? (
        <MarketingPopUp
          popup={popup.data}
          open={openPopUp}
          onOpenChange={setOpenPop}
        />
      ) : (
        ""
      )}
      <main
        className={`${commonClasses} relative bg-primary-2 ${
          openBanner ? "mt-[100px]" : "mt-[25px]"
        }  w-full flex flex-col`}
      >
        {user.data ? (
          <div className="fixed flex items-center z-50  w-[150px] h-[50px] bottom-2 left-10 ">
            <Button onClick={() => setOpenPop(true)}> Edit popup </Button>
          </div>
        ) : (
          ""
        )}
        {children}
      </main>
      <MainFooter />
    </>
  );
};

export default DefaultLayout;
