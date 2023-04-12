import CustomNextImage from "@components/shared/common/CustomNextImage";
import type { NextPage } from "next";
import { defaultSiteName3 } from "@utils/core/next-seo.config";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getFaqPageData } from "@utils/core/API";
import {
  getGetAccessTokenFromCookie,
  useGetUserDataFromStore,
} from "@utils/core/hooks";
import {
  AiFillDelete,
  AiFillEdit,
  AiFillMinusCircle,
  AiFillPlusCircle,
} from "react-icons/ai";
import { useEffect, useState } from "react";
import {
  AddFAQ,
  AddFAQList,
  EditFAQSection,
  EditRequirementSection,
} from "@components/shared/common/Dialog/editDialogFunctions";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import Button from "@components/shared/core/Button";
import axios from "axios";
import { toast } from "react-toastify";
import AlertDialogComponent from "@components/shared/common/Dialog/alertDialog";

const FAQSPages: NextPage = () => {
  const { data } = useQuery(["faq"], () => getFaqPageData(), {
    onSuccess(data) {
      return data;
    },
    refetchInterval: 3000,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenNewFaq, setIsOpenNewFaq] = useState(false);
  const [isOpenNewFaqList, setIsOpenNewFaqList] = useState(false);
  const [faqId, setFaqId] = useState("");
  const [listId, setListId] = useState("");

  const [formValues, setFormValues] = useState({});

  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    setWindowWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (faqId) {
      const filteredArray = data?.FAQpage.filter(
        (item: any) => item.id === faqId
      )[0];
      setFormValues((value) => {
        return {
          ...filteredArray,
          sectionId: "faqSection",
        };
      });
    }
  }, [faqId]);

  useEffect(() => {
    if (listId) {
      const array = data?.FAQpage.map((el: any) => el.faq_list);
      const findFaqArray = array.filter(
        (item: any) => item[0]?.faqId === faqId
      );

      const findListArray = findFaqArray[0].filter(
        (item: any) => item.id === listId
      );

      setFormValues((value) => {
        return {
          ...findListArray[0],
          sectionId: "faqSection",
        };
      });
    }
  }, [listId]);

  const { user } = useGetUserDataFromStore();

  const accessToken = getGetAccessTokenFromCookie();

  const resetSection = useMutation({
    mutationFn: (event) => {
      return fetch(`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/reset-FAQ`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: accessToken,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          if ("success" in result && !result.success)
            throw new Error(result.message);

          return result;
        });
    },
    onSuccess: (result) => setTimeout(() => toast(result.message), 0),
    onError: (result: any) =>
      setTimeout(() => toast(result.message, { type: "error" }), 0),
  });

  const [newFaq, setNewFaq] = useState({
    answer_type: "",
    faq_list: [],
    h2: "",
    h3: null,
    p: "",
  });

  const [newFaqList, setNewFaqList] = useState({
    li: "",
    id: "",
  });

  return (
    <>
      <section className="bg-primary-1 section-p-v1 flex flex-col">
        <AddFAQ
          setFormValues={setNewFaq}
          formValues={newFaq}
          isOpen={isOpenNewFaq}
          setIsOpen={setIsOpenNewFaq}
        />
        <AddFAQList
          setFormValues={setNewFaqList}
          formValues={newFaqList}
          isOpen={isOpenNewFaqList}
          setIsOpen={setIsOpenNewFaqList}
        />
        <EditFAQSection
          formValues={formValues}
          setFormValues={setFormValues}
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          listId={listId}
        />
        <div className="max-w-full md:max-w-[800px] mx-auto text-primary-4">
          <header>
            <h1 className="text-h2 mt-5 capitalize font-semibold text-primary-1">
              FAQs
            </h1>
          </header>
          <ul className="flex flex-col gap-8 my-8 border-[0.125rem] border-bg-secondary-1 px-8 sm:px-20 py-12 rounded-2xl leading-[2] text-[rgb(200, 200, 200)]">
            {!data ? (
              <>
                <SkeletonTheme baseColor="#000" highlightColor="#7d7b78">
                  <Skeleton
                    count={1}
                    width={windowWidth < 600 ? 250 : 500}
                    height={50}
                  />
                </SkeletonTheme>
                <SkeletonTheme baseColor="#000" highlightColor="#7d7b78">
                  <Skeleton
                    count={1}
                    width={windowWidth < 600 ? "100%" : 500}
                    height={50}
                  />
                </SkeletonTheme>
                <SkeletonTheme baseColor="#000" highlightColor="#7d7b78">
                  <Skeleton
                    count={1}
                    width={windowWidth < 600 ? "100%" : 500}
                    height={50}
                  />
                </SkeletonTheme>
                <SkeletonTheme baseColor="#000" highlightColor="#7d7b78">
                  <Skeleton
                    count={1}
                    width={windowWidth < 600 ? "100%" : 500}
                    height={50}
                  />
                </SkeletonTheme>
                <SkeletonTheme baseColor="#000" highlightColor="#7d7b78">
                  <Skeleton
                    count={1}
                    width={windowWidth < 600 ? "100%" : 500}
                    height={50}
                  />
                </SkeletonTheme>
              </>
            ) : (
              data?.FAQpage.map((item: any) => {
                return (
                  <li key={item.id} className="flex  flex-col  py-1rounded">
                    <span className="flex flex-col text-[80%]">
                      <h3 className="text-h6 uppercase relative text-primary-1 mb-1">
                        <CustomNextImage
                          src="/svgs/purple-circle.svg"
                          width={20}
                          height={20}
                          className="w-[0.6rem] h-[0.6rem] absolute top-1/2 left-0 -translate-x-[150%] -translate-y-[50%]
													rtl:right-0 rtl:left-auto rtl:translate-x-[150%]"
                        />
                        {item.h2}
                        {[1, 2, 3, 4, 5, 6].includes(item.id) ? (
                          ""
                        ) : (
                          <AlertDialogComponent action="faq" id={item.id}>
                            <AiFillDelete
                              size={22}
                              className="absolute right-0 top-0 font-semibold outline-none  
	duration-300 transition-all w-fit px-1 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize "
                            />
                          </AlertDialogComponent>
                        )}
                      </h3>
                      {item.answer_type === "opening_and_lists" ? (
                        <>
                          <p>{item.h2}</p>
                          <div className="flex flex-wrap gap-4 mt-2">
                            <div>
                              <p>
                                <strong>{item.h3}</strong>
                              </p>
                              <ul>
                                {item.faq_list.map((subListElem: any) => (
                                  <div
                                    key={subListElem.id}
                                    className="flex flex-col md:flex-row items-center "
                                  >
                                    <li key={subListElem.id}>
                                      {subListElem.li}
                                    </li>
                                    {user.data ? (
                                      <div className="flex gap-1">
                                        <AiFillEdit
                                          className="left-5 cursor-pointer m-auto 	 font-semibold outline-none  
	duration-300 transition-all w-fit px-1 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                                          color="white"
                                          size={25}
                                          onClick={() => {
                                            setIsOpen(true);
                                            setFaqId(item.id);
                                            setListId(subListElem.id);
                                          }}
                                        />
                                        {item.id === 3 &&
                                        [1, 2, 3].includes(subListElem.id) ? (
                                          " "
                                        ) : (
                                          <AlertDialogComponent
                                            action="faq-list"
                                            faqId={item.id}
                                            id={subListElem.id}
                                          >
                                            <AiFillDelete
                                              size={22}
                                              className="left-5 cursor-pointer m-auto 	 font-semibold outline-none  
                                            duration-300 transition-all w-fit px-1 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                                            />
                                          </AlertDialogComponent>
                                        )}
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                ))}
                                {user.data ? (
                                  <AiFillPlusCircle
                                    className="cursor-pointer m-auto  font-semibold outline-none  mt-5
	duration-300 transition-all w-fit px-2 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                                    color="white"
                                    size={25}
                                    onClick={() => {
                                      setIsOpenNewFaqList(true);
                                      setNewFaqList((value) => {
                                        return {
                                          ...value,
                                          id: item.id,
                                        };
                                      });
                                    }}
                                  />
                                ) : (
                                  ""
                                )}
                              </ul>
                            </div>
                          </div>
                        </>
                      ) : (
                        <p>{item.p}</p>
                      )}
                    </span>
                    {user.data ? (
                      <AiFillEdit
                        className="left-5 cursor-pointer m-auto mt-5	 font-semibold outline-none  left-5
	duration-300 transition-all w-fit px-8 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                        color="white"
                        size={25}
                        onClick={() => {
                          setIsOpen(true);
                          setFaqId(item.id);
                          setListId("");
                        }}
                      />
                    ) : (
                      ""
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </div>

        {user.data ? (
          <Button
            onClick={() => {
              setIsOpenNewFaq(true);
              setNewFaq((value: any) => {
                return {
                  ...value,
                  faq_list: [...newFaq.faq_list, ""],
                };
              });
            }}
            className="mb-5"
          >
            <AiFillPlusCircle />
          </Button>
        ) : (
          ""
        )}

        {user.data ? (
          <Button onClick={() => resetSection.mutate()}>Reset</Button>
        ) : (
          ""
        )}
      </section>
    </>
  );
};

export default FAQSPages;
