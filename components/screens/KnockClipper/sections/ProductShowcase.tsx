import type { IKnockClipperPageProps } from "@pages/knock-clipper";

import KnockTrademark from "@components/shared/core/KnockTrademark";
import ProductShowcase from "@components/shared/core/ProductShowcase";
import { EditHomePageSecondSection } from "@components/shared/common/Dialog/editDialogFunctions";
import { useEffect, useState } from "react";
import { useGetUserDataFromStore } from "@utils/core/hooks";

const ProductShowcaseSection = ({
  knockClipperPlugin,
  data,
}: {
  knockClipperPlugin: IKnockClipperPageProps["knockClipperPlugin"];
  data: any;
}) => {
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
    sectionId: "thirdSection-knockclipper",
  });

  const { user } = useGetUserDataFromStore();

  return (
    <section className="bg-primary-1 text-primary-2 px-8 py-16 md:section-p-v1">
      {isOpen && user.data ? (
        <EditHomePageSecondSection
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          productShowCase={data.thirdSection}
          setOnLiveSecondSectionChange={setOnLiveSecondSectionChange}
          setPreviewImage={setPreviewImage}
          OnLiveSecondSectionChange={OnLiveSecondSectionChange}
        />
      ) : (
        ""
      )}
      {data ? (
        <ProductShowcase
          product={knockClipperPlugin}
          textContainer={{
            h2: {
              children: (
                <>
                  <KnockTrademark
                    tradeMark={
                      OnLiveSecondSectionChange.tradeMark ||
                      data?.thirdSection.tradeMark
                    }
                  />
                  {OnLiveSecondSectionChange.h2 || data?.thirdSection.h2}
                </>
              ),
            },
            p: {
              children: OnLiveSecondSectionChange.p || data?.thirdSection.p,
              className: "max-w-[420px]",
            },
            button: {
              children:
                OnLiveSecondSectionChange.button || data?.thirdSection.button,
            },
          }}
          imageContainer={{
            mainImg: {
              src: previewImage
                ? previewImage
                : data
                ? process.env.NEXT_PUBLIC_KNOCK_URL_API +
                  data.thirdSection.imageUrl
                : "",
              alt: "",
              className: "px-[5%] lg:px-[10%]",
            },

            backgroundImg: {
              className: "-translate-x-[30%] scale-[2]",
            },
          }}
          wrapper={{
            className:
              "lg:flex-row-reverse flex-col-reverse gap-10 lg:justify-center",
          }}
          user={user.data}
          sectionEditor={{
            setIsOpen,
            isOpen,
          }}
        />
      ) : (
        ""
      )}
    </section>
  );
};

export default ProductShowcaseSection;
