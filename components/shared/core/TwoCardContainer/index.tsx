import type { ICustomNextImageProps } from "@components/shared/common/CustomNextImage";

import CustomNextImage from "@components/shared/common/CustomNextImage";
import AlertDialogComponent from "@components/shared/common/Dialog/alertDialog";
import {
  AddRequirementSectionBullet,
  EditKnockPageThirdSection,
  EditRequirementSection,
} from "@components/shared/common/Dialog/editDialogFunctions";
import { useGetUserDataFromStore } from "@utils/core/hooks";
import {
  Dispatch,
  Fragment,
  HTMLAttributes,
  SetStateAction,
  useState,
} from "react";
import { AiFillDelete, AiFillEdit, AiFillPlusCircle } from "react-icons/ai";

const TwoCardContainer = ({
  items1,
  items2,
  items1HeaderText,
  items2HeaderText,
  items1ListProps = {},
  items2ListProps = {},
  backgroundImg = {},
  sectionId,
  page,
}: {
  items1: any;
  items2: any;
  items1HeaderText?: string;
  items2HeaderText?: string;
  items1ListProps?: HTMLAttributes<HTMLUListElement>;
  items2ListProps?: HTMLAttributes<HTMLUListElement>;
  backgroundImg?: Partial<ICustomNextImageProps> | false;
  sectionId: string;
  page?: string;
}) => {
  const { user } = useGetUserDataFromStore();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAddBullet, setAddBulletIsOpen] = useState(false);

  const [formValues, setFormValues] = useState({
    sectionId: sectionId,
    requireId: "",
    li: "",
    macOrPc: "",
  });

  const [addFormValues, setAddFormValues] = useState({
    li: "",
    macOrPc: "",
    page,
  });

  const excludedIds = [1, 2, 3, 4];

  return (
    <div
      className="relative
			flex justify-center flex-wrap gap-4
			md:flex-nowrap md:gap-6 lg:gap-10"
    >
      <AddRequirementSectionBullet
        formValues={addFormValues}
        setFormValues={setAddFormValues}
        isOpen={isOpenAddBullet}
        setIsOpen={setAddBulletIsOpen}
      />
      <EditRequirementSection
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        setFormValues={setFormValues}
        formValues={formValues}
      />
      {backgroundImg && (
        <CustomNextImage
          src="/images/Rectangle 48.png"
          width={200}
          height={200}
          className="pointer-events-none select-none aspect-square absolute w-1/2 top-0 left-0 scale-150 -translate-y-1/3 -translate-x-1/4"
        />
      )}
      <div className="relative max-w-lg flex flex-col gap-5 bg-primary-4 px-10 py-8 rounded-3xl w-full lg:w-1/2 lg:max-w-[420px]">
        {items1HeaderText && (
          <header>
            <h3 className="text-2xl font-semibold capitalize">
              {items1HeaderText}
            </h3>
          </header>
        )}
        <ul
          {...items1ListProps}
          className={`${
            items1ListProps.className || ""
          } flex flex-col flex-wrap gap-x-4 gap-y-4 lg:text-md`}
          style={{
            listStyle: "url('/svgs/purple-circle.svg')",
            listStylePosition: "inside",
            ...(items1ListProps.style || {}),
          }}
        >
          {items1.map((item: any) => (
            <Fragment key={item.id}>
              <li>{item.li}</li>
              <div className="flex">
                {user.data ? (
                  <AiFillEdit
                    className="left-5 cursor-pointer m-auto 	 font-semibold outline-none  left-5
	duration-300 transition-all w-fit px-8 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                    color="white"
                    size={25}
                    onClick={() => {
                      setFormValues((el) => {
                        return {
                          ...el,
                          li: item.li,
                          requireId: item.id,
                          macOrPc: "mac",
                        };
                      }),
                        setIsOpen(true);
                    }}
                  />
                ) : (
                  ""
                )}
                {user.data && !excludedIds.includes(item.id) ? (
                  <AlertDialogComponent
                    action={"bullet"}
                    page={page}
                    macOrPc="mac"
                    bulletId={item.id}
                  >
                    <AiFillDelete
                      className="left-5 cursor-pointer m-auto 	 font-semibold outline-none  left-5
duration-300 transition-all w-fit px-8 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                      color="white"
                      size={25}
                    />
                  </AlertDialogComponent>
                ) : (
                  ""
                )}
              </div>
            </Fragment>
          ))}
          {user.data ? (
            <AiFillPlusCircle
              className="left-5 cursor-pointer m-auto 	 font-semibold outline-none  left-5
	duration-300 transition-all w-fit px-8 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
              color="white"
              size={25}
              onClick={() => {
                setAddBulletIsOpen(true);
                setAddFormValues((value) => {
                  return {
                    ...value,
                    macOrPc: "mac",
                  };
                });
              }}
            />
          ) : (
            ""
          )}
        </ul>
      </div>
      <div className="relative max-w-lg flex flex-col gap-5 bg-primary-4 px-12 py-8 rounded-3xl w-full lg:w-1/2 lg:max-w-[420px]">
        {items2HeaderText && (
          <header>
            <h3 className="text-2xl font-semibold capitalize">
              {items2HeaderText}
            </h3>
          </header>
        )}
        <ul
          {...items2ListProps}
          className={`${
            items2ListProps.className || ""
          } flex flex-col flex-wrap gap-x-4 gap-y-4 lg:text-md`}
          style={{
            listStyle: "url('/svgs/purple-circle.svg')",
            listStylePosition: "inside",
            ...(items2ListProps.style || {}),
          }}
        >
          {items2.map((item: any) => (
            <Fragment key={item.id}>
              <li>{item.li}</li>
              <div className="flex">
                {user.data ? (
                  <AiFillEdit
                    className="left-5 cursor-pointer m-auto font-semibold outline-none  left-5
	duration-300 transition-all w-fit px-8 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                    color="white"
                    size={25}
                    onClick={() => {
                      setFormValues((el) => {
                        return {
                          ...el,
                          li: item.li,
                          requireId: item.id,
                          macOrPc: "pc",
                        };
                      }),
                        setIsOpen(true);
                    }}
                  />
                ) : (
                  ""
                )}
                {user.data && !excludedIds.includes(item.id) ? (
                  <AlertDialogComponent
                    action={"bullet"}
                    page={page}
                    macOrPc="pc"
                    bulletId={item.id}
                  >
                    <AiFillDelete
                      className="left-5 cursor-pointer m-auto 	 font-semibold outline-none  left-5
	duration-300 transition-all w-fit px-8 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                      color="white"
                      size={25}
                    />
                  </AlertDialogComponent>
                ) : (
                  ""
                )}
              </div>
            </Fragment>
          ))}
          {user.data ? (
            <AiFillPlusCircle
              className="left-5 cursor-pointer m-auto 	 font-semibold outline-none  left-5
	duration-300 transition-all w-fit px-8 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
              color="white"
              size={25}
              onClick={() => {
                setAddBulletIsOpen(true);
                setAddFormValues((value) => {
                  return {
                    ...value,
                    macOrPc: "pc",
                  };
                });
              }}
            />
          ) : (
            ""
          )}
        </ul>
      </div>
    </div>
  );
};

export default TwoCardContainer;
