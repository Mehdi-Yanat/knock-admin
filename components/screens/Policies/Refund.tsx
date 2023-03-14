import { EditRefundPolicy } from "@components/shared/common/Dialog/editDialogFunctions";
import { useQuery } from "@tanstack/react-query";
import { getRefundPolicy } from "@utils/core/API";
import { useGetUserDataFromStore } from "@utils/core/hooks";
import { useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import Wrapper from "./components/Wrapper";

const RefundPolicyScreen = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useQuery(["refund-policy"], () => getRefundPolicy(), {
    onSuccess(data) {
      return data;
    },
    refetchInterval: 3000,
  });

  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    setFormValues(data);
  }, [data]);

  const { user } = useGetUserDataFromStore();

  return (
    <>
      <EditRefundPolicy
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        setFormValues={setFormValues}
        formValues={formValues}
      />

      <Wrapper
        header={{
          h1Children: "refund policy",
        }}
        head={{
          title: `Refund Policy | `,
          description: "Refund Policy",
        }}
      >
        {data ? (
          <>
            <h2>{data.h2}</h2>
            <p>
              <span>{data.p}</span>
            </p>
            {user.data ? (
              <AiFillEdit
                className=" cursor-pointer m-auto mt-5 mb-5 font-semibold outline-none  
	duration-300 transition-all w-fit px-8 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                color="white"
                size={25}
                onClick={() => {
                  setIsOpen(true);
                }}
              />
            ) : (
              ""
            )}
          </>
        ) : (
          ""
        )}
      </Wrapper>
    </>
  );
};

export default RefundPolicyScreen;
