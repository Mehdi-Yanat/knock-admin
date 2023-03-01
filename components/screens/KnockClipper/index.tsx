import { IKnockClipperPageProps } from "@pages/knock-clipper";
import { useQuery } from "@tanstack/react-query";
import { getKnockClipperPageData } from "@utils/core/API";
import {
  DescriptionSection,
  HeroSection,
  ProductShowcaseSection,
  SystemRequirementsSection,
  VideosSection,
} from "./sections";

const KnockScreen = ({ knockClipperPlugin }: IKnockClipperPageProps) => {
  const { data } = useQuery(
    ["knock-clipper-page"],
    () => getKnockClipperPageData(),
    {
      onSuccess(data) {
        return data;
      },
      refetchInterval: 3000,
    }
  );

  const macRequirement = data
    ? data.forthSection.forth_section_knock_clipper_page_mac.map((el: any) => {
        return {
          ...el,
        };
      })
    : [];
  const pcRequirement = data
    ? data.forthSection.forth_section_knock_clipper_page_pc.map((el: any) => {
        return {
          ...el,
        };
      })
    : [];

  return (
    <>
      <HeroSection knockClipperPlugin={knockClipperPlugin} />
      <DescriptionSection data={data} />

      {data ? (
        <>
          <ProductShowcaseSection
            data={data}
            knockClipperPlugin={knockClipperPlugin}
          />
          <SystemRequirementsSection
            items1={macRequirement}
            items1HeaderText="Mac"
            items2={pcRequirement}
            items2HeaderText="PC"
            backgroundImg={false}
            sectionId={"forthSection-knockclipper"}
            data={data ? data.forthSection : ""}
          />

          <VideosSection
            data={data.fifthSection}
            knockClipperPlugin={knockClipperPlugin}
            sectionId="fifthSection-knockclipper"
          />
        </>
      ) : (
        ''
      )}
    </>
  );
};

export default KnockScreen;
