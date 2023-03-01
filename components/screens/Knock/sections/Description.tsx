import { EditKnockPageSecondSection } from "@components/shared/common/Dialog/editDialogFunctions";
import Description from "@components/shared/core/Description";
import { useQuery } from "@tanstack/react-query";
import { getKnockPageData } from "@utils/core/API";
import { useGetUserDataFromStore } from "@utils/core/hooks";
import { useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const DescriptionSection = ({ data }: { data: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [formValues, setFormValues] = useState({
    p: data ? data.secondSection.p : "",
    sectionId: "secondSection",
  });

  useEffect(() => {
    if (data) {
      setFormValues((oldValue) => {
        return {
          ...oldValue,
          p: data.secondSection.p,
        };
      });
    }
  }, [data]);

  const { user } = useGetUserDataFromStore();

  return (
    <section className="bg-primary-2 section-p-v1">
      <EditKnockPageSecondSection
        formValues={formValues}
        setFormValues={setFormValues}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      />
      {data ? (
        <Description variants={{ "max-w": "none" }} className="max-w-[600px]">
          {formValues.p ? formValues.p : data && data.secondSection.p}
        </Description>
      ) : (
        <SkeletonTheme baseColor="#000" highlightColor="#7d7b78">
          <Skeleton
            count={1}
            height={350}
            className={"rounded-3xl mt-2 mt-2"}
          />
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
  );
};

export default DescriptionSection;
