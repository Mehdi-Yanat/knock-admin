import KnockTrademark from "@components/shared/core/KnockTrademark";

import type { IKnockClipperPageProps } from "@pages/knock-clipper";
import CustomNextImage from "@components/shared/common/CustomNextImage";
import AddItemOnHeroSectionButton from "@components/shared/core/AddItemOnHeroSectionButton";
import { useEffect, useState, type CSSProperties } from "react";
import { EditMainSection } from "@components/shared/common/Dialog/editDialogFunctions";
import { useQuery } from "@tanstack/react-query";
import { getKnockClipperMainSection } from "@utils/core/API";
import { AiFillEdit } from "react-icons/ai";
import { useGetUserDataFromStore } from "@utils/core/hooks";
import Image from "next/image";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
const HeroSection = ({
  knockClipperPlugin,
}: {
  knockClipperPlugin: IKnockClipperPageProps["knockClipperPlugin"];
}) => {
  const [previewImage, setPreviewImage] = useState(null);

  const { data } = useQuery(
    ["knockClipperMainSection"],
    () => getKnockClipperMainSection(),
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
    sectionId: "main-section-clipper",
  });

  const { user } = useGetUserDataFromStore();

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
    <section
      className="bg-primary-1 section-p-v1 section-h-v1"
      style={
        {
          "--pt-multi": 1.3,
          "--pb-multi": 2,
          "--h": "fit-content",
          "--max-h": "fit-content",
        } as CSSProperties
      }
    >
      <EditMainSection
        mainSection={mainSection}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        setOnLiveMainSectionChange={setOnLiveMainSectionChange}
        setPreviewImage={setPreviewImage}
        mainSectionPageId={"knock-clipper-page"}
        OnLiveMainSectionChange={knockMainSectionData}
      />
      <div className="h-full flex items-center justify-center flex-col text-center">
        <div className="relative flex items-center justify-center max-w-[900px] mb-8">
          <CustomNextImage
            src="/images/Rectangle 48.png"
            width={700}
            height={700}
            priority
            className="pointer-events-none select-none absolute top-0 right-0 left-0 bottom-0 w-full h-full object-contain scale-75"
            style={{ transform: "translate(18%, 2%) scale(2.4, 2)" }}
          />

          {previewImage ? (
            <Image
              src={previewImage}
              alt="Preview mode"
              width={400}
              height={400}
              priority
              unoptimized
              className="object-cover relative"
              style={{ aspectRatio: "16 / 16" }}
            />
          ) : knockMainSectionData.mainImageUrl ? (
            <CustomNextImage
              src={
                knockMainSectionData.mainImageUrl
                  ? process.env.NEXT_PUBLIC_KNOCK_URL_API +
                    knockMainSectionData.mainImageUrl
                  : ""
              }
              width={400}
              height={400}
              priority
              unoptimized
              className="object-cover relative"
              style={{ aspectRatio: "16 / 16" }}
            />
          ) : (
            <SkeletonTheme baseColor="#000" highlightColor="#7d7b78">
              <Skeleton
                count={1}
                height={windowWidth < 500 ? 300  : 500}
                width={300}
              />
            </SkeletonTheme>
          )}
        </div>
        <h2 className="text-h3 font-semibold text-primary-1 mt-4 mb-3 flex flex-wrap justify-center uppercase">
          <KnockTrademark
            tradeMark={
              knockMainSectionData.tradeMark || (
                <SkeletonTheme baseColor="#000" highlightColor="#7d7b78">
                  <Skeleton count={1} width={250} height={25} />
                </SkeletonTheme>
              )
            }
          />
          {knockMainSectionData.h2}
        </h2>
        <p className="text-primary-2 mt-2 mb-5 leading-6 max-w-[350px] sm:text-[1.3rem]">
          {knockMainSectionData.p || (
            <SkeletonTheme baseColor="#000" highlightColor="#7d7b78">
              <Skeleton count={1} width={200} height={25} />
            </SkeletonTheme>
          )}
        </p>
        <AddItemOnHeroSectionButton
          product={knockClipperPlugin}
          buttonProps={{ children: knockMainSectionData.buttonText }}
        />
        {user.data ? (
          <AiFillEdit
            className="left-5 cursor-pointer mt-10	 font-semibold outline-none  left-5
	duration-300 transition-all w-fit px-8 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
            color="white"
            size={25}
            onClick={() => setIsOpen(true)}
          />
        ) : (
          ""
        )}
      </div>
    </section>
  );
};

export default HeroSection;
