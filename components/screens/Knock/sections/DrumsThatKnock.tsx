import type { IKnockPluginPageProps } from "@pages/knock";

import KnockSection from "@components/shared/core/KnockSection";
import AddItemOnHeroSectionButton from "@components/shared/core/AddItemOnHeroSectionButton";
import KnockTrademark from "@components/shared/core/KnockTrademark";
import { useQuery } from "@tanstack/react-query";
import { getKnockPageData } from "@utils/core/API";
import { useState } from "react";

const DrumsThatKnockSection = ({
  knockPlugin,
  data
}: {
  knockPlugin: IKnockPluginPageProps["knockPlugin"];
  data:any
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [previewImage, setPreviewImage] = useState(null);


  const [OnLiveMainSectionChange, setOnLiveMainSectionChange] = useState({
    h2: "",
    p: "",
    button: "",
    imageUrl: "",
    tradeMark: "",
    sectionId: "fifth-section",
  });




  return (
    <KnockSection
      buttonElem={
        <AddItemOnHeroSectionButton
          product={knockPlugin}
          buttonProps={{ children: OnLiveMainSectionChange.button }}
        />
      }
      title={
        <>
          {OnLiveMainSectionChange.h2}&nbsp;
          <KnockTrademark tradeMark={OnLiveMainSectionChange.tradeMark} />
        </>
      }
      imageSrc={
        previewImage
          ? previewImage
          : OnLiveMainSectionChange.imageUrl
          ? process.env.NEXT_PUBLIC_KNOCK_URL_API + OnLiveMainSectionChange.imageUrl
          : ""
      }
      description={OnLiveMainSectionChange.p}
      // sectionTheme={{ p: 'section-p-x-v1' }}
      textContainerTheme={{ "sm:gap": 6 }}
      pTheme={{ width: "medium-2" }}
      h2theme={{ "text-size": "md" }}
      imagesContainerTheme={{ pb: "none" }}
      setOnLiveMainSectionChange={setOnLiveMainSectionChange}
      setIsOpen={setIsOpen}
      OnLiveMainSectionChange={OnLiveMainSectionChange}
      isOpen={isOpen}
      isHome={true}
      mainSection={data && data.fifthSection}
      setPreviewImage={setPreviewImage}
      mainSectionPageId={"knock-page"}
    />
  );
};

export default DrumsThatKnockSection;
