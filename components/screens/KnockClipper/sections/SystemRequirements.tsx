import { ICustomNextImageProps } from "@components/shared/common/CustomNextImage";
import { EditRequirementSection } from "@components/shared/common/Dialog/editDialogFunctions";
import TwoCardContainer from "@components/shared/core/TwoCardContainer";
import { useQuery } from "@tanstack/react-query";
import { getKnockPageData } from "@utils/core/API";
import { useGetUserDataFromStore } from "@utils/core/hooks";
import { HTMLAttributes, useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";

const SystemRequirementsSection = ({
  items1,
  items2,
  items1HeaderText,
  items2HeaderText,
  items1ListProps = {},
  items2ListProps = {},
  backgroundImg = {},
  data,
  sectionId,
}: {
  items1: any;
  items2: any;
  items1HeaderText?: string;
  items2HeaderText?: string;
  items1ListProps?: HTMLAttributes<HTMLUListElement>;
  items2ListProps?: HTMLAttributes<HTMLUListElement>;
  backgroundImg?: Partial<ICustomNextImageProps> | false;
  sectionId: string;
  data: any;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [formValues, setFormValues] = useState({
    h2: "",
    p: "",
  });

  useEffect(() => {
    if (data) {
      setFormValues((value) => {
        return {
          h2: data.h2,
          p: data.p,
          sectionId: sectionId,
          isHeader:true
        };
      });
    }
  }, [data]);

  const { user } = useGetUserDataFromStore();

  return (
    <section className="bg-primary-1 section-p-x-v1">
      <EditRequirementSection
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        setFormValues={setFormValues}
        formValues={formValues}
      />
      <div className="flex flex-col gap-2 sm:gap-6">
        <header className="p-4 text-primary-2 text-center flex flex-col justify-center items-center gap-4 sm:gap-6">
          <h2 className="text-h4 text-primary-1 uppercase font-semibold">
            {formValues.h2}
          </h2>
          <p className="text-h5">
            {formValues.p}
          </p>
          {user.data ? (
            <AiFillEdit
              className="left-5 cursor-pointer m-auto mt-5	 font-semibold outline-none  left-5
	duration-300 transition-all w-fit px-8 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
              color="white"
              size={25}
              onClick={() => {
                setIsOpen(true);
              }}
            />
          ) : (
            ""
          )}
        </header>

        <TwoCardContainer
          items1={items1}
          items2={items2}
          items1HeaderText={items1HeaderText}
          items2HeaderText={items2HeaderText}
          items1ListProps={items1ListProps}
          items2ListProps={items2ListProps}
          backgroundImg={backgroundImg}
          sectionId={sectionId}
        />
      </div>
    </section>
  );
};

export default SystemRequirementsSection;
