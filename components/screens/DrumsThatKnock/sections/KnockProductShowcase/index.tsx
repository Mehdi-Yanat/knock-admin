import { EditHomePageSecondSection } from "@components/shared/common/Dialog/editDialogFunctions";
import KnockTrademark from "@components/shared/core/KnockTrademark";
import ProductShowcase from "@components/shared/core/ProductShowcase";
import { IDrumsThatKnockPageProps } from "@pages/drums-that-knock";
import { useGetUserDataFromStore } from "@utils/core/hooks";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const KnockProductShowcaseSection = ({
  knockPlugin,
  data,
}: {
  knockPlugin: IDrumsThatKnockPageProps["knockPlugin"];
  data: any;
}) => {
  const router = useRouter();
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
    sectionId: "lastSection-dtkpage",
    alt: "",
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
        productShowCase={data ? data.lastSection : ""}
      />
      {OnLiveSecondSectionChange.imageUrl ? (
        <ProductShowcase
          product={knockPlugin}
          user={user.data}
          sectionEditor={{
            isOpen: isOpen,
            setIsOpen: setIsOpen,
          }}
          textContainer={{
            h2: {
              children: (
                <Link
                  href={
                    OnLiveSecondSectionChange.buttonUrl
                      ? OnLiveSecondSectionChange.buttonUrl
                      : "/"
                  }
                  className="flex flex-wrap"
                >
                  {/* {knockPlugin.title.split(' ').map((item, index) => (
									<span key={index}>
										{item.toLowerCase() === 'knock' ? <KnockTrademark /> : item}
									</span>
								))} */}
                  {OnLiveSecondSectionChange.h2 ? (
                    <h2>{OnLiveSecondSectionChange.h2}&nbsp;</h2>
                  ) : (
                    ""
                  )}
                  <KnockTrademark
                    tradeMark={OnLiveSecondSectionChange.tradeMark}
                  />
                </Link>
              ),
            },
            p: {
              children: OnLiveSecondSectionChange.p,
              className: "lg:max-w-[410px]",
            },
            button: {
              children: OnLiveSecondSectionChange.button,
              onClick: () => {
                return;
              },
              href: OnLiveSecondSectionChange.buttonUrl
                ? OnLiveSecondSectionChange.buttonUrl
                : "/knock",
            },
          }}
          imageContainer={{
            mainImg: {
              // src: '/images/534aaf62a986c03ee09ee62a138d3845.gif',
              src: previewImage
                ? previewImage
                : process.env.NEXT_PUBLIC_KNOCK_URL_API +
                  OnLiveSecondSectionChange.imageUrl,
              alt: OnLiveSecondSectionChange.alt,
              className: "lg:px-[5%] cursor-pointer",
              onClick: () => router.push("/knock-clipper"),
            },
            index: {
              className: "lg:w-[50%]", // scale-[1.5]'
            },
            backgroundImg: { className: "scale-[3]" },
          }}
          wrapper={{
            className: "lg:flex-row-reverse flex-col-reverse lg:justify-center",
          }}
        />
      ) : (
        ""
      )}
    </section>
  );
};

export default KnockProductShowcaseSection;
