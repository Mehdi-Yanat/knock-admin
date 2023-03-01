import { EditHomePageThirdSection } from "@components/shared/common/Dialog/editDialogFunctions";
import Description from "@components/shared/core/Description";
import KnockTrademark from "@components/shared/core/KnockTrademark";
import { useGetUserDataFromStore } from "@utils/core/hooks";
import { useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const AboutSection = ({ data }: { data: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [OnLiveAboutSectionChange, setOnLiveAboutSectionChange] = useState({
    h2: "",
    tradeMark: "",
    p: "",
    sectionId: "thirdSection",
  });

  const { user } = useGetUserDataFromStore();

  return (
    <>
      <EditHomePageThirdSection
        OnLiveAboutSectionChange={OnLiveAboutSectionChange}
        setOnLiveAboutSectionChange={setOnLiveAboutSectionChange}
        aboutSection={data}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      />
      <section className="bg-primary-1 section-p-v1">
        {data ? (
          <div
            className="
					flex gap-4 flex-col items-center justify-center text-center"
          >
            <h2 className="text-h3 text-primary-1 capitalize font-semibold flex flex-wrap justify-center">
              {OnLiveAboutSectionChange.h2 || (data && data.h2)}&nbsp;
              <KnockTrademark
                tradeMark={
                  OnLiveAboutSectionChange.tradeMark || (data && data.h2)
                }
              />
            </h2>
            <Description>
              {OnLiveAboutSectionChange.p || (data && data.p)}
            </Description>
          </div>
        ) : (
          <SkeletonTheme baseColor="#000" highlightColor="#7d7b78">
            <Skeleton count={1} height={350} />
          </SkeletonTheme>
        )}
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
      </section>
    </>
  );
};

export default AboutSection;
