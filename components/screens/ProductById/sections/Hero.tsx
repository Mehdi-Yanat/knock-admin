import type { IProductByIdPageProps } from "@pages/products/[productId]";

import Button from "@components/shared/core/Button";

import CustomNextImage from "@components/shared/common/CustomNextImage";

import classes from "@styles/productsPages.module.scss";
import ProductDetails from "@components/screens/ProductById/sections/ProductDetails";
import Link from "next/link";
import { FaPlay } from "react-icons/fa";
import { Fragment, useEffect, useState } from "react";
import {
  AddDTKfeatures,
  EditDTKSection,
} from "@components/shared/common/Dialog/editDialogFunctions";
import { useGetUserDataFromStore } from "@utils/core/hooks";
import { AiFillDelete, AiFillEdit, AiFillPlusCircle } from "react-icons/ai";
import AlertDialogComponent from "@components/shared/common/Dialog/alertDialog";

const HeroSection = ({ product }: { product: any }) => {
  const [isYoutubeVideo, setIsYoutubeVideo] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [featureId, setFeatureId] = useState(null);
  const [youtubeId, setYoutubeId] = useState(null);
  const [filesIncludeId, setFilesIncludeId] = useState(null);
  const [descriptionId, setDescriptionId] = useState(null);

  const [typeAction, setTypeAction] = useState("");

  const { user } = useGetUserDataFromStore();

  const [formValues, setFormValues] = useState({
    li: "",
    src: "https://www.youtube.com/embed/<insert-youtube-video-id-here>",
    srcImage:
      "https://img.youtube.com/vi/<insert-youtube-video-id-here>/maxresdefault.jpg",
    title: "",
    handle: product.handle,
  });

  const renderFeature = () => {
    switch (product.handle) {
      case "decap-ableton-live-masterclass":
      case "complete-knock-bundle-v2-all-digital-products":
        return (
          <div>
            <div className="px-5">
              {product.description.map((el: any, index: any) => (
                <Fragment key={index}>
                  <p> {el.h3} </p>
                  {el.text.map((el: string, index: any) => (
                    <p key={index}> {el} </p>
                  ))}
                  {user.data ? (
                    <AiFillEdit
                      className="cursor-pointer m-auto mt-5	 font-semibold outline-none  
	duration-300 transition-all w-fit px-5 py-[0.20rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                      color="white"
                      size={20}
                      onClick={() => {
                        setIsOpen(true);
                        setFeatureId(null);
                        setYoutubeId(null);
                        setFilesIncludeId(null);
                        setDescriptionId(el.id);
                      }}
                    />
                  ) : (
                    ""
                  )}
                </Fragment>
              ))}
            </div>
            <div className={classes.productPageFeaturesWithOneBox}>
              <div className={classes.overLayFeatures}></div>
              <div>
                {product.filesIncluded.length ? (
                  <ul className={classes.productPageDetailsUl}>
                    {product.filesIncluded.map((el: any) => (
                      <Fragment key={el.id}>
                        <li key={el.id}>{el.li}</li>
                        {user.data ? (
                          <>
                            <AiFillEdit
                              className="cursor-pointer m-auto mt-5	 font-semibold outline-none  
	duration-300 transition-all w-fit px-5 py-[0.20rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                              color="white"
                              size={20}
                              onClick={() => {
                                setIsOpen(true);
                                setFeatureId(null);
                                setYoutubeId(null);
                                setFilesIncludeId(el.id);
                                setDescriptionId(null);
                              }}
                            />
                            {user.data ? (
                              <AlertDialogComponent
                                handle={product.handle}
                                id={el.id}
                                api="files-included"
                              >
                                <AiFillDelete
                                  className=" cursor-pointer m-auto mt-2	 font-semibold outline-none  
                                  duration-300 transition-all w-fit px-5 py-[0.20rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                                  color="white"
                                  size={20}
                                />
                              </AlertDialogComponent>
                            ) : (
                              ""
                            )}
                          </>
                        ) : (
                          ""
                        )}
                      </Fragment>
                    ))}
                  </ul>
                ) : (
                  ""
                )}
                {product.filesIncluded.length && user.data ? (
                  <div className="flex items-center justify-center">
                    <AiFillPlusCircle
                      className=" cursor-pointer mb-5  font-semibold outline-none 
	duration-300 transition-all w-fit px-5 py-[0.20rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                      color="white"
                      size={20}
                      onClick={() => {
                        setIsOpenAdd(true);
                        setTypeAction("files Included");
                      }}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        );

      case "melodies-that-knock-vol-1":
      case "melodies-that-knock-vol-2-free-download":
        return (
          <div>
            <div className={classes.productPageFeaturesWithOneBox}>
              <div className={classes.overLayFeatures}></div>
              <div>
                {product.features.length ? (
                  <ul className={classes.productPageDetailsUl}>
                    {product.features.map((el: any) => (
                      <Fragment key={el.id}>
                        <li>{el.li}</li>
                        <div>
                          {user.data ? (
                            <AiFillEdit
                              className="cursor-pointer m-auto mt-5	 font-semibold outline-none  
	duration-300 transition-all w-fit px-5 py-[0.20rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                              color="white"
                              size={20}
                              onClick={() => {
                                setIsOpen(true);
                                setFeatureId(el.id);
                                setYoutubeId(null);
                                setFilesIncludeId(null);
                              }}
                            />
                          ) : (
                            ""
                          )}
                          {user.data ? (
                            <AlertDialogComponent
                              handle={product.handle}
                              id={el.id}
                              api="feature"
                            >
                              <AiFillDelete
                                className=" cursor-pointer m-auto mt-2	 font-semibold outline-none  
                                  duration-300 transition-all w-fit px-5 py-[0.20rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                                color="white"
                                size={20}
                              />
                            </AlertDialogComponent>
                          ) : (
                            ""
                          )}
                        </div>
                      </Fragment>
                    ))}
                  </ul>
                ) : (
                  ""
                )}
                {product.features.length && user.data ? (
                  <div className="flex items-center justify-center">
                    <AiFillPlusCircle
                      className=" cursor-pointer mb-5  font-semibold outline-none 
	duration-300 transition-all w-fit px-5 py-[0.20rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                      color="white"
                      size={20}
                      onClick={() => {
                        setIsOpenAdd(true);
                        setTypeAction("features");
                      }}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        );

      case "drums-that-knock-vol-8":
      case "drums-that-knock-vol-9":
      case "drums-that-knock-vol-7":
        return (
          <div className={classes.productPageFeatures}>
            <div className={classes.overLayFeaturesSection}></div>
            <div>
              {product.features.length ? (
                <ul>
                  {product.features.map((el: any) => (
                    <div key={el.id} className="flex flex-col">
                      <li>{el.li}</li>
                      {user.data ? (
                        <div className="flex justify-between">
                          <AiFillEdit
                            className="  font-semibold outline-none disabled:cursor-not-allowed 
                            duration-300 transition-all w-fit px-5 py-[0.30rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                            color="white"
                            size={20}
                            onClick={() => {
                              setIsOpen(true);
                              setFeatureId(el.id);
                              setYoutubeId(null);
                              setFilesIncludeId(null);
                              setDescriptionId(null);
                            }}
                          />
                          {user.data ? (
                            <AlertDialogComponent
                              handle={product.handle}
                              id={el.id}
                              api="feature"
                            >
                              <AiFillDelete
                                className="  font-semibold outline-none disabled:cursor-not-allowed 
                            duration-300 transition-all w-fit px-5 py-[0.30rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                                color="white"
                                size={20}
                              />
                            </AlertDialogComponent>
                          ) : (
                            ""
                          )}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  ))}
                  {product.features.length && user.data ? (
                    <div className="flex items-center justify-center">
                      <AiFillPlusCircle
                        className=" cursor-pointer   font-semibold outline-none 
	duration-300 transition-all w-fit px-5 py-[0.20rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                        color="white"
                        size={20}
                        onClick={() => {
                          setIsOpenAdd(true);
                          setTypeAction("features");
                        }}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                </ul>
              ) : (
                ""
              )}
              {product.filesIncluded.length ? (
                <ul className={classes.ul}>
                  {product.filesIncluded.map((el: any) => (
                    <div key={el.id}>
                      <li>{el.li}</li>
                      {user.data ? (
                        <div className="flex justify-between">
                          <AiFillEdit
                            className=" cursor-pointer   font-semibold outline-none 
                        duration-300 transition-all w-fit px-5 py-[0.20rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                            color="white"
                            size={20}
                            onClick={() => {
                              setIsOpen(true);
                              setFeatureId(null);
                              setYoutubeId(null);
                              setFilesIncludeId(el.id);
                              setDescriptionId(null);
                            }}
                          />
                          {user.data ? (
                            <AlertDialogComponent
                              handle={product.handle}
                              id={el.id}
                              api="files-included"
                            >
                              <AiFillDelete
                                className="cursor-pointer font-semibold outline-none	duration-300 transition-all w-fit px-3 py-[0.20rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                                color="white"
                                size={20}
                              />
                            </AlertDialogComponent>
                          ) : (
                            ""
                          )}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  ))}
                  {product.filesIncluded.length && user.data ? (
                    <div className="flex items-center justify-center">
                      <AiFillPlusCircle
                        className=" cursor-pointer   font-semibold outline-none 
	duration-300 transition-all w-fit px-5 py-[0.20rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                        color="white"
                        size={20}
                        onClick={() => {
                          setIsOpenAdd(true);
                          setTypeAction("files Included");
                        }}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                </ul>
              ) : (
                ""
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className={classes.productPageFeatures}>
            <div className={classes.overLayFeaturesSection}></div>
            <div>
              {product.features.length ? (
                <ul>
                  {product.features.map((el: any) => (
                    <div key={el.id} className="flex flex-col">
                      <li>{el.li}</li>
                      {user.data ? (
                        <div className="flex justify-between">
                          <AiFillEdit
                            className="font-semibold outline-none disabled:cursor-not-allowed 
                            duration-300 transition-all w-fit px-5 py-[0.30rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                            color="white"
                            size={20}
                            onClick={() => {
                              setIsOpen(true);
                              setFeatureId(el.id);
                              setYoutubeId(null);
                              setFilesIncludeId(null);
                              setDescriptionId(null);
                            }}
                          />
                          {user.data ? (
                            <AlertDialogComponent
                              handle={product.handle}
                              id={el.id}
                              api="feature"
                            >
                              <AiFillDelete
                                className="  font-semibold outline-none disabled:cursor-not-allowed 
                            duration-300 transition-all w-fit px-5 py-[0.30rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                                color="white"
                                size={20}
                              />
                            </AlertDialogComponent>
                          ) : (
                            ""
                          )}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  ))}
                  {product.features.length && user.data ? (
                    <div className="flex items-center justify-center">
                      <AiFillPlusCircle
                        className=" cursor-pointer   font-semibold outline-none 
	duration-300 transition-all w-fit px-5 py-[0.20rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                        color="white"
                        size={20}
                        onClick={() => {
                          setIsOpenAdd(true);
                          setTypeAction("features");
                        }}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                </ul>
              ) : (
                ""
              )}
              {product.filesIncluded.length ? (
                <ul>
                  {product.filesIncluded.map((el: any) => (
                    <div key={el.id} className="flex flex-col">
                      <li>{el.li}</li>
                      {user.data ? (
                        <div className="flex justify-between">
                          <AiFillEdit
                            className=" cursor-pointer   font-semibold outline-none 
                        duration-300 transition-all w-fit px-5 py-[0.20rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                            color="white"
                            size={20}
                            onClick={() => {
                              setIsOpen(true);
                              setFeatureId(null);
                              setYoutubeId(null);
                              setFilesIncludeId(el.id);
                              setDescriptionId(null);
                            }}
                          />
                          {user.data ? (
                            <AlertDialogComponent
                              handle={product.handle}
                              id={el.id}
                              api="files-included"
                            >
                              <AiFillDelete
                                className="cursor-pointer font-semibold outline-none	duration-300 transition-all w-fit px-3 py-[0.20rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                                color="white"
                                size={20}
                              />
                            </AlertDialogComponent>
                          ) : (
                            ""
                          )}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  ))}
                  {product.filesIncluded.length && user.data ? (
                    <div className="flex items-center justify-center">
                      <AiFillPlusCircle
                        className=" cursor-pointer   font-semibold outline-none 
	duration-300 transition-all w-fit px-5 py-[0.20rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                        color="white"
                        size={20}
                        onClick={() => {
                          setIsOpenAdd(true);
                          setTypeAction("files Included");
                        }}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                </ul>
              ) : (
                ""
              )}
            </div>
          </div>
        );
    }
  };

  useEffect(() => {
    if (descriptionId) {
      const description = product.description.filter(
        (el: any) => el.id === descriptionId
      );

      setFormValues((value) => {
        return {
          ...description[0],
          text1: description[0].text[0],
          text2: description[0].text[1],
          type: "description",
        };
      });
    }
    if (filesIncludeId) {
      const filesInclude = product.filesIncluded.filter(
        (el: any) => el.id === filesIncludeId
      );

      setFormValues((value) => {
        return {
          ...filesInclude[0],
          type: "filesInclude",
        };
      });
    }

    if (youtubeId) {
      const youtube = product.youtubeVideo.filter(
        (el: any) => el.id === youtubeId
      );

      setFormValues((value) => {
        return {
          ...youtube[0],
          type: "youtube",
        };
      });
    }

    if (featureId) {
      const feature = product.features.filter((el: any) => el.id === featureId);

      setFormValues((value) => {
        return {
          ...feature[0],
          type: "feature",
        };
      });
    }
  }, [descriptionId, filesIncludeId, youtubeId, featureId]);

  return (
    <section className={classes.productPageSection}>
      <AddDTKfeatures
        formValues={formValues}
        setFormValues={setFormValues}
        setIsOpen={setIsOpenAdd}
        isOpen={isOpenAdd}
        type={typeAction}
      />
      <EditDTKSection
        formValues={formValues}
        setFormValues={setFormValues}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        featureId={featureId}
        youtubeId={youtubeId}
        filesIncludeId={filesIncludeId}
        descriptionId={descriptionId}
      />
      <div className={classes.productPageContainer}>
        <ProductDetails product={product} />

        {renderFeature()}
        {product.youtubeVideo.length ? (
          <div className={classes.productPageYoutubeSections}>
            {product.youtubeVideo[0].title ? (
              <h4>{product.youtubeVideo[0].title}</h4>
            ) : (
              ""
            )}
            <div>
              <div className={classes.overLayYoutubeSection}></div>
              {product.youtubeVideo.map((el: any) => (
                <div key={el.id} className={classes.youtubeVideo}>
                  {isYoutubeVideo !== el.id ? (
                    <>
                      <div
                        className="flex flex-col"
                        style={{
                          backgroundImage: `url(${el.srcImage})`,
                          backgroundPosition: "center",
                          backgroundSize: "cover",
                        }}
                      >
                        <button onClick={() => setIsYoutubeVideo(el.id)}>
                          <FaPlay />
                        </button>
                        <div className="flex gap-5">
                          {user.data ? (
                            <AiFillEdit
                              className=" cursor-pointer mt-5  font-semibold outline-none 
	duration-300 transition-all w-fit px-5 py-[0.20rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                              color="white"
                              size={20}
                              onClick={() => {
                                setIsOpen(true);
                                setFeatureId(null);
                                setYoutubeId(el.id);
                                setFilesIncludeId(null);
                                setDescriptionId(null);
                              }}
                            />
                          ) : (
                            ""
                          )}
                          {user.data ? (
                            <AlertDialogComponent
                              handle={product.handle}
                              id={el.id}
                              api="youtube-video"
                            >
                              <AiFillDelete
                                className=" cursor-pointer mt-5  font-semibold outline-none 
	duration-300 transition-all w-fit px-5 py-[0.20rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                                color="white"
                                size={20}
                              />
                            </AlertDialogComponent>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <iframe src={el.src + "?autoplay=1"} allow={"autoplay"} />
                      <div className="flex flex-col items-center mt-4">
                        {user.data ? (
                          <AiFillEdit
                            className="cursor-pointer m-auto 	 font-semibold outline-none  
	duration-300 transition-all w-fit px-5 py-[0.20rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                            color="white"
                            size={20}
                            onClick={() => {
                              setIsOpen(true);
                              setFeatureId(null);
                              setYoutubeId(el.id);
                              setFilesIncludeId(null);
                              setDescriptionId(null);
                            }}
                          />
                        ) : (
                          ""
                        )}
                        {user.data ? (
                          <AlertDialogComponent
                            handle={product.handle}
                            id={el.id}
                            api="youtube-video"
                          >
                            <AiFillDelete
                              className=" cursor-pointer mt-2  font-semibold outline-none 
	duration-300 transition-all w-fit px-5 py-[0.20rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                              color="white"
                              size={20}
                            />
                          </AlertDialogComponent>
                        ) : (
                          ""
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          ""
        )}

        {user.data ? (
          <>
            <label>add youtube video</label>
            <AiFillPlusCircle
              className=" cursor-pointer mb-5  font-semibold outline-none 
	duration-300 transition-all w-fit px-5 py-[0.20rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
              color="white"
              size={20}
              onClick={() => {
                setIsOpenAdd(true);
                setTypeAction("youtube");
              }}
            />
          </>
        ) : (
          ""
        )}
        <Button className={classes.GoBackLink} href={"/drums-that-knock"}>
          GO BACK
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
