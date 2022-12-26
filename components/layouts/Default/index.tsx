import { ReactNode } from "react";
import MainHeader from "./components/MainHeader";
import { getGetAccessTokenFromCookie, useGetUserData } from "@utils/core/hooks";
import MainFooter from "./components/MainFooter";

export const commonClasses = "leading-relaxed text-primary-2 mx-auto";

const DefaultLayout = ({
  children,
}: {
  children: ReactNode;
}) => {
  const accessToken = getGetAccessTokenFromCookie();

  useGetUserData({
    enabled: !!accessToken,
    accessToken: accessToken,
  });



  return (
    <>
      <MainHeader  />
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
