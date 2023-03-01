import { commonClasses } from "@components/layouts/Default";
import { EditHomePageSecondSection } from "@components/shared/common/Dialog/editDialogFunctions";
import KnockTrademark from "@components/shared/core/KnockTrademark";
import ProductShowcase from "@components/shared/core/ProductShowcase";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { getHomePageData } from "@utils/core/API";
import { useGetUserDataFromStore } from "@utils/core/hooks";

const OneProductShowCaseSection = ({ data }: { data: any }) => {
  const router = useRouter();
  const [isOpen , setIsOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState(null);


  const [OnLiveSecondSectionChange, setOnLiveSecondSectionChange] = useState({
    h2: "",
    tradeMark:"",
    p: "",
    button: "",
    buttonUrl: "",
    buttonColor: "",
    imageUrl: "",
    sectionId:'secondSection'
  });

  const { user } = useGetUserDataFromStore();


  return (
    <section className="bg-primary-2 text-primary-2 section-p-v1">
      {isOpen && user.data ? (
        <EditHomePageSecondSection
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        productShowCase={data}
        setOnLiveSecondSectionChange={setOnLiveSecondSectionChange}
        setPreviewImage={setPreviewImage}
        OnLiveSecondSectionChange={OnLiveSecondSectionChange}
        />
      ) : (
        ""
      )}
      {data ? (
        <ProductShowcase
          user={user.data}
          sectionEditor={
            {
              setIsOpen,
              isOpen
            }
          }
          textContainer={{
            h2: {
              children: (
                <>
                  <KnockTrademark tradeMark={OnLiveSecondSectionChange.tradeMark || data.tradeMark} />
                  {OnLiveSecondSectionChange.h2 || data.h2 }
                </>
              ),
            },
            p: {
              children: OnLiveSecondSectionChange.p || data.p,
              className: "text-h6 max-w-[300px]",
            },
            button: { children: OnLiveSecondSectionChange.button || data.button, href: OnLiveSecondSectionChange.buttonUrl ||  data.buttonUrl },
          }}
          imageContainer={{
            mainImg: {
              src: previewImage ? previewImage : `${process.env.NEXT_PUBLIC_KNOCK_URL_API}${( data.imageUrl) }`,
              alt: "",
              onClick: () => router.push(OnLiveSecondSectionChange.buttonUrl || data.buttonUrl),
              className: "cursor-pointer",
              priority: true,
            },
            backgroundImg: false,
          }}
          wrapper={{
            className: "flex-col-reverse lg:justify-center",
          }}
        />
      ) : (
        <SkeletonTheme baseColor="#000" highlightColor="#7d7b78">
          <Skeleton count={1} height={350} />
        </SkeletonTheme>
      )}
    </section>
  );
};

export default OneProductShowCaseSection;
