import KnockTrademark from "@components/shared/core/KnockTrademark";
import KnockSection from "@components/shared/core/KnockSection";
import { useState } from "react";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMainSection } from "@utils/core/API";

const HeroSection = ({openPopUp}:{openPopUp:boolean}) => {
  const [previewImage, setPreviewImage] = useState(null);
  const mainSection = useQuery(["main-section"], () => getMainSection(), {
    onSuccess(data) {
      return data;
    },
    refetchInterval: 3000,
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
      openPopUp={openPopUp}
      description={OnLiveMainSectionChange.p}
      title={
        OnLiveMainSectionChange.h2 ? <KnockTrademark
          isMainSection={true}
          OnLiveMainSectionChange={OnLiveMainSectionChange}
        /> : ''
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
    />
  );
};

export default HeroSection;
