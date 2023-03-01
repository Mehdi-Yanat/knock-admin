import type { IKnockPluginPageProps } from "@pages/knock";
import { useQuery } from "@tanstack/react-query";
import { getKnockPageData } from "@utils/core/API";
import { useGetUserDataFromStore } from "@utils/core/hooks";
import { SystemRequirementsSection } from "../KnockClipper/sections";
import {
  DescriptionSection,
  EasyToUseSection,
  HeroSection,
  ShapesYourDrumsSection,
  DrumsThatKnockSection,
  ReviewsSection,
  VideosSection,
} from "./sections";
import AvailableOnIOSSection from "./sections/AvailableOnIOS";

// const shortReviews = reviews.filter((review) => review.review.length < 100);

const KnockScreen = ({ knockPlugin }: IKnockPluginPageProps) => {
  const { data } = useQuery(["knock"], () => getKnockPageData(), {
    onSuccess(data) {
      return data;
    },
    refetchInterval: 3000,
  });

  return (
    <>
      <HeroSection knockPlugin={knockPlugin} />
      <DescriptionSection data={data} />
      {data ? (
        <>
          <ShapesYourDrumsSection data={data} />
          <EasyToUseSection data={data} knockPlugin={knockPlugin} />
          <DrumsThatKnockSection data={data} knockPlugin={knockPlugin} />
          <AvailableOnIOSSection data={data} />
          <ReviewsSection data={data} />
          <SystemRequirementsSection
            data={data ? data.sevenSection : ""}
            items1={data ? data.sevenSection.seven_section_knock_page_mac : []}
            items1HeaderText="Mac"
            items2={data ? data.sevenSection.seven_section_knock_page_pc : []}
            items2HeaderText="PC"
            backgroundImg={false}
            sectionId={"sevenSection-knock"}
          />
          <section aria-hidden className="section-pb-v1 bg-primary-1"></section>
          <VideosSection
            data={data ? data.eightSection : ""}
            knockPlugin={knockPlugin}
            sectionId={"eightSection-knock"}
          />
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default KnockScreen;
