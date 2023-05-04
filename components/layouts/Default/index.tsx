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
import { getAllProducts, getPopup, getUpSellingPopup } from "@utils/core/API";
import Button from "@components/shared/core/Button";
import UpSellingPopup from "@components/shared/common/UpSellingPopup/UpSellingPopup";

export const commonClasses = "leading-relaxed text-primary-2 mx-auto";

const DefaultLayout = ({
  children,
  setOpenPop,
  openPopUp,
  openBanner,
  setBanner,
  openUpSellingPopUp,
  setOpenUpSellingPop,
}: {
  children: ReactNode;
  setOpenPop: Dispatch<SetStateAction<boolean>>;
  openPopUp: boolean;
  openBanner: boolean;
  setBanner: Dispatch<SetStateAction<boolean>>;
  openUpSellingPopUp: Boolean;
  setOpenUpSellingPop: Dispatch<SetStateAction<boolean>>;
}) => {
  const { user } = useGetUserDataFromStore();

  const popup = useQuery(["get-popup"], () => getPopup(), {
    refetchInterval: 3000,
  });

  const upselling = useQuery(["get-upselling-popup"], getUpSellingPopup,  {
    refetchInterval: 3000,
  });

  const products = useQuery(["all-products"], getAllProducts, {
    refetchOnWindowFocus: true,
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
      {upselling.data && products.data ? (
        <UpSellingPopup
          upselling={upselling.data.upselling}
          upsellingSettings={upselling.data.upsellingSettings[0]}
          products={products.data}
          isOpen={openUpSellingPopUp}
          setIsOpen={setOpenUpSellingPop}
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
          <div className="fixed flex flex-col items-left z-50  w-[400px] gap-5   bottom-2 left-10 ">
            <Button onClick={() => setOpenPop(true)}> Edit popup </Button>
            <Button onClick={() => setOpenUpSellingPop(true)}>
              Edit upselling popup
            </Button>
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
