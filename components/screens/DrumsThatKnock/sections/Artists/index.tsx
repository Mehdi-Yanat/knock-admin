// import Swiper core and required modules
import { Navigation, A11y, Autoplay } from "swiper";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles

import "swiper/css";
import "swiper/css/navigation";
// import 'swiper/css/pagination'
// import 'swiper/css/scrollbar'

import { artists } from "data";
import KnockTrademark from "@components/shared/core/KnockTrademark";
import CustomNextImage from "@components/shared/common/CustomNextImage";
import Reviews from "@components/shared/core/Reviews";
import { useEffect, useState } from "react";
import {
  EditKnockPageArtistSection,
  EditKnockPageReviewsSection,
} from "@components/shared/common/Dialog/editDialogFunctions";
import { AiFillEdit } from "react-icons/ai";
import { useGetUserDataFromStore } from "@utils/core/hooks";

const ArtistsSection = ({ data }: { data: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenArtist, setIsOpenArtist] = useState(false);
  const [reviewId, setreviewId] = useState("");
  const [artistId, setArtistId] = useState("");

  const [previewImage, setPreviewImage] = useState(null);

  const [formValues, setFormValues] = useState({
    review: "",
    reviewBy: "",
    alt: "",
    reviewId: reviewId,
    imageUrl: "",
    sectionId: "reviewSection-dtkpage",
  });

  const [formValuesArtist, setFormValuesArtist] = useState({
    artistId: artistId,
    imageUrl: "",
    name: "",
    sectionId: "artistSection-dtkpage",
  });

  useEffect(() => {
    if (reviewId) {
      const filteredArray = data.reviews.review_section_dtk_page_content.filter(
        (item: any) => item.id === reviewId
      )[0];
      setFormValues((value) => {
        return {
          ...filteredArray,
          sectionId: "reviewSection-dtkpage",
        };
      });
    }
  }, [reviewId]);

  useEffect(() => {
    if (artistId) {
      const filteredArray = data.artist.artist_section_dtk_page_content.filter(
        (item: any) => item.id === artistId
      )[0];
      setFormValuesArtist((value) => {
        return {
          ...filteredArray,
          sectionId: "artistSection-dtkpage",
        };
      });
    }
  }, [artistId]);

  const { user } = useGetUserDataFromStore();

  return (
    <>
      <section className="bg-primary-2 section-p-v1 pb-0">
        <EditKnockPageArtistSection
          isOpen={isOpenArtist}
          setIsOpen={setIsOpenArtist}
          setFormValues={setFormValuesArtist}
          formValues={formValuesArtist}
          setPreviewImage={setPreviewImage}
          artistId={artistId}
        />
        <div className="flex flex-col gap-2 lg:px-8 sm:gap-4">
          <header className="text-center flex items-center justify-center">
            <h2 className="text-h4 font-semibold capitalize flex flex-wrap justify-center">
              SOME ARTISTS WHO HAVE USED DRUMS THAT&nbsp;
              <KnockTrademark />
            </h2>
          </header>
          <div className="w-[1200px] max-w-full mx-auto">
            <Swiper
              modules={[Navigation, A11y, Autoplay]}
              navigation
              slidesPerView="auto"
              breakpoints={{
                400: { slidesPerView: 4 },
                700: { slidesPerView: 6 },
                800: { slidesPerView: 8, spaceBetween: 5 },
              }}
              autoplay={{
                delay: 5000,
              }}
              loop
              className="select-none"
            >
              {data?.artist.artist_section_dtk_page_content.map((item: any) => (
                <SwiperSlide
                  key={item.id}
                  className="p-2 flex flex-col justify-center items-center text-center"
                >
                  <CustomNextImage
                    src={process.env.NEXT_PUBLIC_KNOCK_URL_API + item.imageUrl}
                    alt={item.alt}
                    width={100}
                    height={100}
                    className="rounded-full"
                  />
                  <p className="select-auto">{item.name}</p>
                  {user.data ? (
                    <AiFillEdit
                      className="left-5 cursor-pointer m-auto mt-5	 font-semibold outline-none  left-5
	duration-300 transition-all w-fit px-8 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                      color="white"
                      size={25}
                      onClick={() => {
                        setIsOpenArtist(true);
                        setArtistId(item.id);
                      }}
                    />
                  ) : (
                    ""
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
      <section className="bg-primary-1 section-p-v1 pb-0">
        <EditKnockPageReviewsSection
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          reviewId={reviewId}
          setFormValues={setFormValues}
          formValues={formValues}
          setPreviewImage={setPreviewImage}
        />
        <div className="-translate-y-6">
          <Reviews
            reviews={data ? data.reviews.review_section_dtk_page_content : []}
            reviewCardVariants={{ "min-h": "extra-sm", "max-w": "extra-sm" }}
            containerVariants={{ "max-w": "screen-sm" }}
            setIsOpen={setIsOpen}
            setreviewId={setreviewId}
          />
        </div>
      </section>
    </>
  );
};

export default ArtistsSection;
