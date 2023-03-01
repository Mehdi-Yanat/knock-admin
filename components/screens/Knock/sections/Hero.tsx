import { EditMainSection } from "@components/shared/common/Dialog/editDialogFunctions";
import AddItemOnHeroSectionButton from "@components/shared/core/AddItemOnHeroSectionButton";
import KnockSection from "@components/shared/core/KnockSection";
import KnockTrademark from "@components/shared/core/KnockTrademark";
import { IKnockPluginPageProps } from "@pages/knock";
import { useQuery } from "@tanstack/react-query";
import { getKnockMainSection } from "@utils/core/API";
import { useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const HeroSection = ({
  knockPlugin,
}: {
  knockPlugin: IKnockPluginPageProps["knockPlugin"];
}) => {
  const [previewImage, setPreviewImage] = useState(null);

  const { data } = useQuery(
    ["knock-main-section"],
    () => getKnockMainSection(),
    {
      onSuccess(data) {
        return data;
      },
    }
  );

  const mainSection = data ? data.main : "";
  const [isOpen, setIsOpen] = useState(false);

  const [knockMainSectionData, setOnLiveMainSectionChange] = useState({
    h2: "",
    p: "",
    buttonText: "",
    buttonUrl: "",
    h2Color: "",
    pColor: "",
    mainImageUrl: "",
    tradeMark: "",
    sectionId: "main-section",
  });

  return (
    <>
      <KnockSection
        buttonElem={
          <AddItemOnHeroSectionButton
            product={knockPlugin}
            buttonProps={{ children: knockMainSectionData.buttonText }}
          />
        }
        title={
          <>
            {knockMainSectionData.h2 || (
              <SkeletonTheme baseColor="#000" highlightColor="#7d7b78">
                <Skeleton count={1} height={25} width={150} />
              </SkeletonTheme>
            )}
            &nbsp;
            <KnockTrademark
              tradeMark={
                knockMainSectionData.tradeMark || (
                  <SkeletonTheme baseColor="#000" highlightColor="#7d7b78">
                    <Skeleton count={1} height={25} width={150} />
                  </SkeletonTheme>
                )
              }
            />
          </>
        }
        imageSrc={
          previewImage
            ? previewImage
            : knockMainSectionData.mainImageUrl
            ? process.env.NEXT_PUBLIC_KNOCK_URL_API +
              knockMainSectionData.mainImageUrl
            : ""
        }
        description={knockMainSectionData.p }
        pTheme={{ width: "small" }}
        setOnLiveMainSectionChange={setOnLiveMainSectionChange}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        mainSection={mainSection}
        setPreviewImage={setPreviewImage}
        mainSectionPageId="knock-page"
        OnLiveMainSectionChange={knockMainSectionData}
      />
    </>
  );
};

export default HeroSection;
