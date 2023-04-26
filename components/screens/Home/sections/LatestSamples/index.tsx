import {
  ChangeSamplesBox,
  EditHomePageForthSection,
} from "@components/shared/common/Dialog/editDialogFunctions";
import Button from "@components/shared/core/Button";
import ProductBasicCard from "@components/shared/core/Card/product/default";
import KnockTrademark from "@components/shared/core/KnockTrademark";
import type { IHomePageProps } from "@pages/index";
import { useGetUserDataFromStore } from "@utils/core/hooks";
import { getIdFromGid } from "@utils/core/shopify";
import { useMemo, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const LatestSamplesSection = ({
  products,
  data,
}: {
  products: IHomePageProps["products"];
  data: any;
}) => {
  const { user } = useGetUserDataFromStore();

  const [isOpen, setIsOpen] = useState(false);
  const [changeSmaplesBox, setChangeSmaplesBox] = useState(false);
  const [formValues, setFormValues] = useState({
    sampleBoxId: "",
    sampleBoxHandle: "",
  });
  const [OnLivelatestSamplesChange, setOnLivelatestSamplesChange] = useState({
    h2: data ? data.h2 : "",
    tradeMark: data ? data.tradeMark : "",
    p: data ? data.p : [],
    button: data ? data.button : "",
    buttonUrl: data ? data.buttonUrl : "",
    buttonColor: data ? data.buttonColor : "",
    itemOneHandle: data ? data.itemOneHandle : "",
    itemTwoHandle: data ? data.itemTwoHandle : "",
    sectionId: "forthSection",
  });

  let filteredProducts = useMemo(() => {
    const filteredProducts: typeof products = [];

    products.forEach((item) => {
      if (
        item.handle ===
        (OnLivelatestSamplesChange.itemOneHandle
          ? OnLivelatestSamplesChange.itemOneHandle
          : data && data.itemOneHandle)
      )
        filteredProducts[0] = item;
      if (
        item.handle ===
        (OnLivelatestSamplesChange.itemTwoHandle
          ? OnLivelatestSamplesChange.itemTwoHandle
          : data && data.itemTwoHandle)
      )
        filteredProducts[1] = item;
    });

    return filteredProducts.filter(Boolean);
  }, [
    products,
    data?.itemOneHandle,
    OnLivelatestSamplesChange.itemOneHandle,
    data?.itemTwoHandle,
    OnLivelatestSamplesChange.itemTwoHandle,
  ]);

  filteredProducts.filter(
    (item) =>
      item.handle ===
        (OnLivelatestSamplesChange.itemOneHandle
          ? OnLivelatestSamplesChange.itemOneHandle
          : data && data.itemOneHandle) ||
      item.handle ===
        (OnLivelatestSamplesChange.itemTwoHandle
          ? OnLivelatestSamplesChange.itemTwoHandle
          : data && data.itemTwoHandle)
  );

  return (
    <>
      <EditHomePageForthSection
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setOnLivelatestSamplesChange={setOnLivelatestSamplesChange}
        OnLivelatestSamplesChange={OnLivelatestSamplesChange}
        latestSamples={data}
      />

      <ChangeSamplesBox
        isOpen={changeSmaplesBox}
        setIsOpen={setChangeSmaplesBox}
        products={products}
        formValues={formValues}
        setFormValues={setFormValues}
      />

      <section className="bg-primary-2 section-p-v1">
        {data ? (
          <div
            className="
				flex flex-col
				md:flex-row
				gap-4
				lg:gap-6"
          >
            <div
              className="flex gap-4 flex-col items-center text-center p-4
						md:p-8 md:items-start md:text-align-initial md:flex-grow md:w-1/2 md:justify-center"
            >
              <h2
                className="text-h3 font-semibold text-primary-1 text-center flex flex-wrap justify-center
								md:text-align-initial md:justify-start"
              >
                {OnLivelatestSamplesChange.h2[0]}&nbsp;
                <KnockTrademark
                  tradeMark={OnLivelatestSamplesChange.tradeMark}
                />
                {OnLivelatestSamplesChange.h2[1]}
              </h2>
              {OnLivelatestSamplesChange.p[0] ||
              OnLivelatestSamplesChange.p[1] ? (
                <p className="text-primary-2 text-h6 mb-2">
                  {OnLivelatestSamplesChange.p[0]}
                  <br />{" "}
                  {OnLivelatestSamplesChange.p[1] === "undefined"
                    ? ""
                    : OnLivelatestSamplesChange.p[1]}
                </p>
              ) : (
                ""
              )}
              <Button
                className="hidden md:block"
                href={OnLivelatestSamplesChange.buttonUrl}
              >
                {OnLivelatestSamplesChange.button}
              </Button>
              {user.data ? (
                <AiFillEdit
                  className="left-5 cursor-pointer mt-2	 font-semibold outline-none  left-5
	duration-300 transition-all w-fit px-8 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                  color="white"
                  size={25}
                  onClick={() => setIsOpen(true)}
                />
              ) : (
                ""
              )}
            </div>
            {/* <div className='md:flex-grow md:w-1/2 flex justify-center items-center'>
					<ProductCardSlider products={products} />
				</div> */}
            <div className="md:flex-grow md:w-1/2 flex flex-col sm:flex-row justify-center items-center gap-8">
              {filteredProducts.length ? (
                <div key={filteredProducts[0].id}>
                  <div className="md:h-[390px]">
                    <ProductBasicCard
                      link={{
                        children: filteredProducts[0].title,
                        href: `/products/${getIdFromGid(
                          filteredProducts[0].id
                        )}`,
                      }}
                      productData={filteredProducts[0]}
                    />
                  </div>
                  {user.data ? (
                    <div className="flex item-center w-full justify-center mt-5">
                      <Button
                        onClick={() => {
                          setChangeSmaplesBox(true),
                            setFormValues((oldValue) => {
                              return {
                                ...oldValue,
                                sampleBoxId: "itemOneHandle",
                              };
                            });
                        }}
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}
              {filteredProducts.length ? (
                <div key={filteredProducts[1].id}>
                  <div className=" md:h-[390px]" >
                    <ProductBasicCard
                      link={{
                        children: filteredProducts[1].title,
                        href: `/products/${getIdFromGid(
                          filteredProducts[1].id
                        )}`,
                      }}
                      productData={filteredProducts[1]}
                    />
                  </div>
                  {user.data ? (
                    <div className="flex item-center w-full justify-center mt-5">
                      <Button
                        onClick={() => {
                          setChangeSmaplesBox(true),
                            setFormValues((oldValue) => {
                              return {
                                ...oldValue,
                                sampleBoxId: "itemTwoHandle",
                              };
                            });
                        }}
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="md:hidden flex justify-center items-center p-5">
              <Button href="/drums-that-knock">Explore it now</Button>
            </div>
          </div>
        ) : (
          <SkeletonTheme baseColor="#000" highlightColor="#7d7b78">
            <Skeleton count={1} height={350} />
          </SkeletonTheme>
        )}
      </section>
    </>
  );
};

export default LatestSamplesSection;
