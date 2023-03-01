import { IHomePageProps } from "@pages/index";
import { useQuery } from "@tanstack/react-query";
import { getHomePageData } from "@utils/core/API";
import { useEffect, useState } from "react";
import {
  AboutSection,
  HeroSection,
  OneProductShowCaseSection,
  LatestSamplesSection,
} from "./sections";

const HomeScreen = ({ products, openPopUp }: IHomePageProps) => {
  const homePageData = useQuery(["home-page-data"], () => getHomePageData(), {
    onSuccess(data) {
      return data;
    },
    refetchInterval: 3000,
  });

  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    setWindowWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <HeroSection windowWidth={windowWidth} openPopUp={openPopUp} />
      <OneProductShowCaseSection
        data={homePageData.data && homePageData.data.secondSection}
      />
      <AboutSection
        data={homePageData.data && homePageData.data.thirdSection}
      />
      <LatestSamplesSection
        products={products}
        data={homePageData.data && homePageData.data.forthSection}
      />
    </>
  );
};

export default HomeScreen;
