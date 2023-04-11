import { EditTermsOfService } from "@components/shared/common/Dialog/editDialogFunctions";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getTermsOfService } from "@utils/core/API";
import {
  getGetAccessTokenFromCookie,
  useGetUserDataFromStore,
} from "@utils/core/hooks";
import { useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import Wrapper from "./components/Wrapper";
import { toast } from "react-toastify";

const TermsOfServiceScreen = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [termSectionId, setTermSectionId] = useState(null);
  const [textId, setTextId] = useState(null);

  const [formValues, setFormValues] = useState({});
  const { data } = useQuery(["terms"], () => getTermsOfService(), {
    onSuccess(data) {
      return data;
    },
    refetchInterval: 3000,
  });
  const { user } = useGetUserDataFromStore();

  useEffect(() => {
    if (termSectionId) {
      const filtred = data.filter(
        (el: { id: number }) => el.id === termSectionId
      )[0];
      setFormValues((value) => {
        return {
          h3: filtred.h3,
          termSectionId,
        };
      });
      if (textId) {
        const filtredText = filtred.p.filter(
          (el: { id: number }) => el.id === textId
        )[0];
        setFormValues((value) => {
          return {
            text: filtredText.text,
            textId,
            termSectionId,
          };
        });
      }
    }
  }, [termSectionId, textId]);

  const accessToken = getGetAccessTokenFromCookie();

  const resetSection = useMutation({
    mutationFn: (event) => {
      return fetch(
        `${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/reset-terms-of-service`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: accessToken,
          },
        }
      )
        .then((response) => response.json())
        .then((result) => {
          if ("success" in result && !result.success)
            throw new Error(result.message);

          return result;
        });
    },
    onSuccess: (result) =>
      setTimeout(() => toast(result.message, { type: "success" }), 0),
    onError: (result: any) =>
      setTimeout(() => toast(result.message, { type: "error" }), 0),
  });

  return (
    <>
      <EditTermsOfService
        formValues={formValues}
        setFormValues={setFormValues}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <Wrapper
        resetHandler={resetSection.mutate}
        header={{
          h1Children: "Terms Of Service",
        }}
        head={{
          title: "Terms Of Service",
          description: "Our Terms Of Service",
        }}
      >
        {data?.map((item: any) => (
          <>
            {item.id === 1 ? " " : <br />}
            <div className="flex gap-2">
              <strong>{item.h3} </strong>
              {user.data ? (
                <AiFillEdit
                  className=" cursor-pointer font-semibold outline-none  
	duration-300 transition-all w-fit px-2 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                  color="white"
                  size={25}
                  onClick={() => {
                    setTermSectionId(item.id);
                    setTextId(null);
                    setIsOpen(true);
                  }}
                />
              ) : (
                ""
              )}
            </div>
            {item.p.map((el: any) => (
              <>
                {el.id === 2 || el.id === 3 || el.id === 4 || el.id === 5 ? (
                  <br />
                ) : (
                  ""
                )}
                {el.text}
                {user.data ? (
                  <AiFillEdit
                    className=" cursor-pointer m-auto 	 font-semibold outline-none  
	duration-300 transition-all w-fit px-8 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                    color="white"
                    size={25}
                    onClick={() => {
                      setTermSectionId(item.id);
                      setTextId(el.id);
                      setIsOpen(true);
                    }}
                  />
                ) : (
                  ""
                )}
                <br />
              </>
            ))}
          </>
        ))}
      </Wrapper>
    </>
  );
};

export default TermsOfServiceScreen;
