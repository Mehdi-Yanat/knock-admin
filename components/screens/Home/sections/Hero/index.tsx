import KnockTrademark from "@components/shared/core/KnockTrademark";
import KnockSection from "@components/shared/core/KnockSection";
import { useState } from "react";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMainSection } from "@utils/core/API";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const HeroSection = ({
  openPopUp,
  windowWidth,
}: {
  openPopUp: boolean;
  windowWidth: number;
}) => {
  const [previewImage, setPreviewImage] = useState(null);
  const mainSection = useQuery(["main-section"], () => getMainSection(), {
    refetchOnWindowFocus: true,
  });

  const [OnLiveMainSectionChange, setOnLiveMainSectionChange] = useState({
    h2: "",
    p: "",
    buttonText: "",
    buttonUrl: "",
    h2Color: "",
    pColor: "",
    mainImageUrl: "",
  });

  const [isOpen, setIsOpen] = useState(false);

  return (
    <KnockSection
      windowWidth={windowWidth}
      openPopUp={openPopUp}
      description={OnLiveMainSectionChange.p}
      title={
        OnLiveMainSectionChange.h2 ? (
          <KnockTrademark
            tradeMark={
              OnLiveMainSectionChange.h2 || (
                <SkeletonTheme baseColor="#000" highlightColor="#7d7b78">
                  <Skeleton count={1} height={350} />
                </SkeletonTheme>
              )
            }
          />
        ) : (
          ""
        )
      }
      pTheme={{ width: "small" }}
      mainImgOrVideoLink={OnLiveMainSectionChange.buttonUrl}
      imageSrc={
        previewImage
          ? previewImage
          : OnLiveMainSectionChange.mainImageUrl
          ? process.env.NEXT_PUBLIC_KNOCK_URL_API +
            OnLiveMainSectionChange.mainImageUrl
          : ""
      }
      mainImgOrVideoProps={{ isAnimated: true }}
      buttonProps={{
        className: "capitalize",
        href: OnLiveMainSectionChange.buttonUrl,
        children: OnLiveMainSectionChange.buttonText,
      }}
      setOnLiveMainSectionChange={setOnLiveMainSectionChange}
      setIsOpen={setIsOpen}
      OnLiveMainSectionChange={OnLiveMainSectionChange}
      isOpen={isOpen}
      isHome={true}
      mainSection={mainSection.data}
      setPreviewImage={setPreviewImage}
      mainSectionPageId={"home-page"}
    />
  );
};

export default HeroSection;
