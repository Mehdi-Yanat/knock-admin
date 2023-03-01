import type { IKnockPluginPageProps } from "@pages/knock";
import VideosContainer from "@components/shared/core/VideosContainer";

import AddItemOnHeroSectionButton from "@components/shared/core/AddItemOnHeroSectionButton";
import { AiFillEdit } from "react-icons/ai";
import { useGetUserDataFromStore } from "@utils/core/hooks";
import { useEffect, useState } from "react";
import { EditYoutubeSection } from "@components/shared/common/Dialog/editDialogFunctions";

const VideosSection = ({
  knockPlugin,
  data,
  sectionId,
}: {
  knockPlugin: IKnockPluginPageProps["knockPlugin"];
  data: any;
  sectionId: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useGetUserDataFromStore();

  const [formValues, setFormValues] = useState({
    h2: "",
    youtubeUrl: "",
    youtubeImageUrl: "",
    youtubeUrl2: "",
    youtubeImageUrl2: "",
    button: "",
  });



  useEffect(() => {
    if (data) {
      setFormValues((oldValue) => {
        return {
          ...data,
          sectionId: sectionId,
        };
      });
    }
  }, [data]);


  return (
    <section className="bg-primary-1 text-primary-2 section-p-x-v1 section-pb-v1">
      <EditYoutubeSection
        setFormValues={setFormValues}
        formValues={formValues}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      />
      <VideosContainer
        data={formValues}
        iframes={[
          {
            src: `${formValues.youtubeUrl}?autoplay=1`,
            srcDoc: `${formValues.youtubeImageUrl}`,
            title:
              "This plugin will make your drums KNOCK - YouTube video player",
            frameBorder: "0",
            allow:
              "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
            allowFullScreen: true,
          },
          {
            src: `${formValues.youtubeUrl2}?autoplay=1'`,
            srcDoc: `${formValues.youtubeImageUrl2}`,
            title:
              "KNOCK: Before and After | Before & After - YouTube video player",
            frameBorder: "0",
            allow:
              "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
            allowFullScreen: true,
          },
        ]}
        buttonElem={
          <AddItemOnHeroSectionButton
            product={knockPlugin}
            buttonProps={{ children: formValues.button }}
          />
        }
      />
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
    </section>
  );
};

export default VideosSection;
