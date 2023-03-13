import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, type CSSProperties } from "react";
import Wrapper from "./components/Wrapper";
import { getShippingPolicy } from "@utils/core/API";
import { useGetUserDataFromStore } from "@utils/core/hooks";
import { AiFillEdit } from "react-icons/ai";
import { EditShippingPolicy } from "@components/shared/common/Dialog/editDialogFunctions";

const ShippingPolicyScreen = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [listId, setListId] = useState(null);
  const { data } = useQuery(["shipping-policy"], () => getShippingPolicy(), {
    onSuccess(data) {
      return data;
    },
    refetchInterval: 3000,
  });

  const [formValues, setFormValues] = useState({});

  const { user } = useGetUserDataFromStore();

  useEffect(() => {
    setFormValues(data);
    if (listId) {
      const filtredText = data.ul.filter(
        (el: { id: number }) => el.id === listId
      )[0];
      setFormValues((value) => {
        return {
          ...filtredText,
          sectionId: data.id,
        };
      });
    }
  }, [data, listId]);

  return (
    <>
      <EditShippingPolicy
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        setFormValues={setFormValues}
        formValues={formValues}
        listId={listId}
      />
      {data ? (
        <Wrapper
          head={{
            title: "",
          }}
          header={{
            h1Children: "",
          }}
          sectionProps={{
            style: {
              "--ul-li-style": "url(/svgs/gray-circle.svg)",
            } as CSSProperties,
          }}
        >
          <h2>{data.h2}</h2>
          <p>{data.p}</p>

          <h2>{data.h2s}</h2>
          <p>{data.p2}</p>
          {user.data ? (
            <AiFillEdit
              className=" cursor-pointer m-auto mt-5 mb-5 font-semibold outline-none  
	duration-300 transition-all w-fit px-8 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
              color="white"
              size={25}
              onClick={() => {
                setIsOpen(true);
                setListId(null);
              }}
            />
          ) : (
            ""
          )}
          <ul>
            {data.ul.map((el: { id: any; li: string }) => (
              <div
                className="grid items-center	"
                style={{ gridTemplateColumns: "5fr .5fr" }}
              >
                <li key={el.id}>{el.li}</li>
                {user.data ? (
                  <AiFillEdit
                    className=" cursor-pointer font-semibold outline-none  
	duration-300 transition-all w-fit px-2 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                    color="white"
                    size={25}
                    onClick={() => {
                      setIsOpen(true);
                      setListId(el.id);
                    }}
                  />
                ) : (
                  ""
                )}
              </div>
            ))}
          </ul>
        </Wrapper>
      ) : (
        ""
      )}
    </>
  );
};

export default ShippingPolicyScreen;
