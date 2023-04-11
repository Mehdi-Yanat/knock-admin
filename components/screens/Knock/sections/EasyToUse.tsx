import { EditHomePageSecondSection } from "@components/shared/common/Dialog/editDialogFunctions";
import ProductShowcase from "@components/shared/core/ProductShowcase";
import { IKnockPluginPageProps } from "@pages/knock";
import { useGetUserDataFromStore } from "@utils/core/hooks";
import { useState } from "react";

const EasyToUseSection = ({
  knockPlugin,
  data
}: {
  knockPlugin: IKnockPluginPageProps["knockPlugin"];
  data:any
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);


  const { user } = useGetUserDataFromStore();

  const [OnLiveSecondSectionChange, setOnLiveSecondSectionChange] = useState({
    h2: "",
    p: "",
    button: "",
    imageUrl: "",
    sectionId: "forthSection-knock",
  });

  const imageUrl = data && data.forthSection.imageUrl;

  return (
    <section className="bg-primary-1 text-primary-2 section-p-v1">
      {data ? (
        <>
          <EditHomePageSecondSection
            setOnLiveSecondSectionChange={setOnLiveSecondSectionChange}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            setPreviewImage={setPreviewImage}
            productShowCase={data ? data.forthSection : ""}
            OnLiveSecondSectionChange={OnLiveSecondSectionChange}
          />
          <ProductShowcase
            product={knockPlugin}
            textContainer={{
              h2: {
                children: OnLiveSecondSectionChange.h2,
              },
              p: {
                children: <>{OnLiveSecondSectionChange.p}</>,
              },
              button: { children: OnLiveSecondSectionChange.button },
            }}
            imageContainer={{
              mainImg: {
                src: previewImage
                  ? previewImage
                  : `${process.env.NEXT_PUBLIC_KNOCK_URL_API + imageUrl}`,
                alt: "",
                className: "lg:px-[10%]",
              },
            }}
            wrapper={{
              className: "flex-col-reverse gap-4 lg:justify-center lg:gap-10",
            }}
            user={user.data}
            sectionEditor={{
              setIsOpen,
              isOpen,
            }}
          />
        </>
      ) : (
        ""
      )}
    </section>
  );
};

export default EasyToUseSection;
