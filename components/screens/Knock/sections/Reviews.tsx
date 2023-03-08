import { CSSProperties, useEffect, useState } from "react";
import Reviews from "@components/shared/core/Reviews";
import {
  Addartist,
  Addreviews,
  EditKnockPageReviewsSection,
} from "@components/shared/common/Dialog/editDialogFunctions";

const ReviewsSection = ({ data }: { data: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAddReview, setIsOpenAddReview] = useState(false);
  const [isOpenAddArtist, setIsOpenAddArtist] = useState(false);
  const [reviewId, setreviewId] = useState("");

  const [previewImage, setPreviewImage] = useState(null);

  const [formValues, setFormValues] = useState({
    review: "",
    reviewBy: "",
    alt: "",
    reviewId: reviewId,
    imageUrl: "",
    sectionId: "sixSection-knock",
  });

  useEffect(() => {
    if (reviewId) {
      const filteredArray =
        data.sixSection.six_section_knock_page_content.filter(
          (item: any) => item.id === reviewId
        )[0];
      setFormValues((value) => {
        return {
          ...filteredArray,
          sectionId: "sixSection-knock",
        };
      });
    }
  }, [reviewId]);

  let formData = new FormData();
  formData.append("imageUrl", formValues.imageUrl);
  formData.append("sectionId", formValues.sectionId);
  formData.append("review", formValues.review);
  formData.append("reviewBy", formValues.reviewBy);
  formData.append("alt", formValues.alt);

  return (
    <section
      className="bg-primary-1 section-p-v1"
      style={{ "--pt-multi": 0.5, "--pb-multi": 0.2 } as CSSProperties}
    >
      <Addreviews
        setFormValues={setFormValues}
        formValues={formValues}
        setIsOpen={setIsOpenAddReview}
        formData={formData}
        isOpen={isOpenAddReview}
        setPreviewImage={setPreviewImage}
      />
      <EditKnockPageReviewsSection
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        reviewId={reviewId}
        setFormValues={setFormValues}
        formValues={formValues}
        setPreviewImage={setPreviewImage}
      />
      <Reviews
        setIsOpen={setIsOpen}
        setIsOpenAddReview={setIsOpenAddReview}
        setreviewId={setreviewId}
        reviews={data ? data.sixSection.six_section_knock_page_content : []}
        page="knockpage"
      />
    </section>
  );
};

export default ReviewsSection;
