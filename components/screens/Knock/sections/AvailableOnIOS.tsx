import {
  EditHomePageSecondSection,
  EditKnockPageThirdSection,
} from "@components/shared/common/Dialog/editDialogFunctions";
import ProductShowcase from "@components/shared/core/ProductShowcase";
import { useGetUserDataFromStore } from "@utils/core/hooks";
import React, { useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { BsApple } from "react-icons/bs";

const AvailableOnIOSSection = ({ data }: { data: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const [OnLiveSecondSectionChange, setOnLiveSecondSectionChange] = useState({
    h2: "",
    tradeMark: "",
    p: "",
    button: "",
    buttonUrl: "",
    buttonColor: "",
    imageUrl: "",
    sectionId: "iosSection-knockpage",
  });

  const { user } = useGetUserDataFromStore();

  return (
    <section className="bg-primary-1 text-primary-2 section-p-v1">
      <EditHomePageSecondSection
        setPreviewImage={setPreviewImage}
        setOnLiveSecondSectionChange={setOnLiveSecondSectionChange}
        OnLiveSecondSectionChange={OnLiveSecondSectionChange}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        productShowCase={data ? data.iosSection : ""}
      />
      {data ? (
        <ProductShowcase
          // product={knockPlugin}
          textContainer={{
            h2: {
              children: OnLiveSecondSectionChange.h2,
            },
            p: {
              children: <>{OnLiveSecondSectionChange.p}</>,
            },
            button: {
              children: (
                <div className="flex items-center gap-2">
                  <BsApple /> {OnLiveSecondSectionChange.button}
                </div>
              ),
              onClick: () =>
                window.open(OnLiveSecondSectionChange.buttonUrl, "_blank"),
            },
          }}
          imageContainer={{
            mainImg: {
              src: previewImage
                ? previewImage
                : process.env.NEXT_PUBLIC_KNOCK_URL_API +
                  data.iosSection.imageUrl,
              alt: "",
              className: "scale-[1.4]",
            },
            backgroundImg: {
              src: "/images/Rectangle 48.png",
              variants: { translateY: null, translateX: "small" },
            },
          }}
          wrapper={{
            className: "gap-4 lg:justify-center lg:gap-10",
            variants: { flexDir: "col-reverse-lg:row-reverse" },
          }}
        />
      ) : (
        ""
      )}
      {user.data ? (
        <AiFillEdit
          className="left-5 cursor-pointer mt-20	 font-semibold outline-none  left-5
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

export default AvailableOnIOSSection;
