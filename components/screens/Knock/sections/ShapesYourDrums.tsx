import CustomNextImage from "@components/shared/common/CustomNextImage";
import { EditKnockPageThirdSection } from "@components/shared/common/Dialog/editDialogFunctions";
import {
  useGetUserDataFromStore,
} from "@utils/core/hooks";
import { useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";


const ShapesYourDrumsSection = ({ data }: { data: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shapesId, setShapesId] = useState("");

  const [shapesData, setShapesData] = useState({});

  const { user } = useGetUserDataFromStore();

  const [formValues, setFormValues] = useState({
    h2: "",
    id: shapesId,
    h3: "",
    p: "",
    sectionId: "thirdSection",
  });

  useEffect(() => {
    if (shapesId) {
      const filteredArray =
        data.thirdSection.third_section_knock_page_content.filter(
          (item: any) => item.id === shapesId
        )[0];
      setShapesData(filteredArray);
      setFormValues((oldValue) => {
        return {
          ...oldValue,
          h3: filteredArray.h3,
          p: filteredArray.p,
          id: filteredArray.id,
        };
      });
    }
  }, [shapesId]);

  useEffect(() => {
    if (data) {
      setFormValues((oldValue) => {
        return {
          ...oldValue,
          h2: data.thirdSection.h2,
        };
      });
    }
  }, [data]);

  return (
    <section className=" text-primary-2 relative bg-primary-1 section-p-v1">
      <EditKnockPageThirdSection
        setFormValues={setFormValues}
        formValues={formValues}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        shapesId={shapesId}
      />
      <div className="absolute top-0 right-0 bottom-0 left-0 w-full h-full max-w-none overflow-hidden">
        <CustomNextImage
          src="/images/Pattern[1].png"
          width={800}
          height={800}
          className="pointer-events-none select-none left-0 w-full h-full object-cover scale-[2]"
        />
      </div>
      <div
        className="absolute top-0 right-0 bottom-0 left-0 w-full h-full max-w-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9), rgba(0, 0, 0))",
        }}
      >
        <CustomNextImage
          src="/images/Rectangle 105.png"
          width={800}
          height={800}
          className="pointer-events-none select-none left-0 w-full h-full"
        />
      </div>
      <div
        className="max-w-screen-xl
					relative flex flex-col gap-10 sm:gap-20"
      >
        <header className="text-center">
          <h2 className="text-h3 font-semibold uppercase text-primary-1">
            {formValues.h2}
          </h2>
          {user.data ? (
            <AiFillEdit
              className="left-5 cursor-pointer mt-10	m-auto font-semibold outline-none  left-5
	duration-300 transition-all w-fit px-8 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
              color="white"
              size={25}
              onClick={() => {
                setIsOpen(true);
                setShapesId("");
              }}
            />
          ) : (
            ""
          )}
        </header>
        <div className="flex flex-wrap items-baseline justify-center gap-12">
          {data &&
            data.thirdSection.third_section_knock_page_content.map(
              (item: any) => (
                <div
                  key={item.h3}
                  className="text-center w-[18rem] max-w-full flex flex-col items-center justify-start gap-6"
                >
                  <CustomNextImage
                    src={process.env.NEXT_PUBLIC_KNOCK_URL_API + item.image}
                    width={175}
                    height={175}
                    className="aspect-square max-w-[10rem]"
                  />
                  <p className="font-bold">{item.h3}</p>
                  <p className="mt-[-0.75rem]">{item.p}</p>
                  {user.data ? (
                    <AiFillEdit
                      className="left-5 cursor-pointer mt-10	 font-semibold outline-none  left-5
	duration-300 transition-all w-fit px-8 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                      color="white"
                      size={25}
                      onClick={() => {
                        setIsOpen(true), setShapesId(item.id);
                      }}
                    />
                  ) : (
                    ""
                  )}
                </div>
              )
            )}
        </div>
      </div>
    </section>
  );
};

export default ShapesYourDrumsSection;
