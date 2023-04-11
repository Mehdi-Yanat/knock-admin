import { IDrumsThatKnockPageProps } from "@pages/drums-that-knock";
import { useQuery } from "@tanstack/react-query";
import { getDTKPageData } from "@utils/core/API";
import {
  ArtistsSection,
  DigitalProductsSection,
  HeroSection,
  KnockProductShowcaseSection,
} from "./sections";

const DrumsThatKnock = ({
  products,
  knockPlugin,
}: IDrumsThatKnockPageProps) => {
  const { data } = useQuery(["dtk-page"], () => getDTKPageData(), {
    onSuccess(data) {
      return data;
    },
    refetchInterval: 3000,
  });

  return (
    <>
      <HeroSection data={data ? data.main_section : ""} />
      <DigitalProductsSection products={products} />
      {/* <MerchSection /> */}
      {data ? <ArtistsSection data={data} /> : ""}
      {data ? (
        <KnockProductShowcaseSection data={data} knockPlugin={knockPlugin} />
      ) : (
        ""
      )}
    </>
  );
};

export default DrumsThatKnock;
