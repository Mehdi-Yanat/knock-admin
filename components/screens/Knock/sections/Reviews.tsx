import { CSSProperties, useEffect, useState } from "react";
import Reviews from "@components/shared/core/Reviews";
import { useQuery } from "@tanstack/react-query";
import { getKnockPageData } from "@utils/core/API";
import {
  EditKnockPageReviewsSection,
} from "@components/shared/common/Dialog/editDialogFunctions";

const ReviewsSection = ({data}:{data:any}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reviewId, setreviewId] = useState("");

  const [previewImage, setPreviewImage] = useState(null);


  const [formValues, setFormValues] = useState({
    review: "",
    reviewBy: "",
    alt: "",
    reviewId:reviewId,
    imageUrl: "",
    sectionId: "sixSection-knock",
  });


  useEffect(() => {
    if (reviewId) {
      const filteredArray =
        data.sixSection.six_section_knock_page_content.filter(
          (item: any) => item.id === reviewId
        )[0];
      setFormValues(value => {
        return {
          ...filteredArray,
          sectionId: "sixSection-knock",
        }
      })
    }
  }, [reviewId]);

  


  return (
    <section
      className="bg-primary-1 section-p-v1"
      style={{ "--pt-multi": 0.5, "--pb-multi": 0.2 } as CSSProperties}
    >
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
        setreviewId={setreviewId}
        reviews={data ? data.sixSection.six_section_knock_page_content : []}
      />
    </section>
  );
};

export default ReviewsSection;
