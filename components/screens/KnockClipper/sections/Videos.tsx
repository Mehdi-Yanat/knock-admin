import { EditYoutubeSection } from "@components/shared/common/Dialog/editDialogFunctions";
import AddItemOnHeroSectionButton from "@components/shared/core/AddItemOnHeroSectionButton";
import VideosContainer from "@components/shared/core/VideosContainer";
import { IKnockClipperPageProps } from "@pages/knock-clipper";
import { useGetUserDataFromStore } from "@utils/core/hooks";
import { useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";

const VideosSection = ({
  knockClipperPlugin,
  data,
  sectionId,
}: {
  knockClipperPlugin: IKnockClipperPageProps["knockClipperPlugin"];
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
    <section className="pt-[2.75rem] lg:pt-[4.75rem] bg-primary-1 text-primary-2 section-p-v1 flex flex-col">
      <EditYoutubeSection
        setFormValues={setFormValues}
        formValues={formValues}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      />
      <div className="p-1" />
      <VideosContainer
        data={formValues}
        iframes={[
          {
            src: `${formValues.youtubeUrl}?autoplay=1`,
            srcDoc: formValues.youtubeImageUrl,
            title:
              "The only soft clipper you'll ever need 🥁🔥 - YouTube video player",
            frameBorder: "0",
            allow:
              "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
            allowFullScreen: true,
          },
          {
            src: `${formValues.youtubeUrl2}?autoplay=1`,
            srcDoc: formValues.youtubeImageUrl2,
            title:
              "KNOCK Clipper vs Fruity Soft Clipper vs Glue Compressor - Shootout - YouTube video player",
            frameBorder: "0",
            allow:
              "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
            allowFullScreen: true,
          },
        ]}
        buttonElem={
          <AddItemOnHeroSectionButton
            product={knockClipperPlugin}
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
