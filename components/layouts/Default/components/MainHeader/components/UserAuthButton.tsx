import type {
  IGenericErrorResponse,
  ILoginSuccess,
  IRegisterSuccess,
} from "types";
import type { Dispatch, FormEvent, SetStateAction } from "react";

import { useState } from "react";
import Dialog from "@components/shared/common/Dialog";
import { useMutation } from "@tanstack/react-query";
import Button from "@components/shared/core/Button";
import { getCookie, setCookie } from "@utils/common/storage/cookie/document";
import { useGetUserData } from "@utils/core/hooks";
import { BsFillPersonFill } from "react-icons/bs";
import FormField from "@components/shared/core/FieldForm";
import { toast } from "react-toastify";
import { getApiUrl } from "lib/getApiUrl";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

enum EWindowType {
  LOGIN = "login",
}

const UserAuthButton = ({ isOpen, setIsOpen }: IProps) => {
  const [type, setType] = useState<EWindowType>(EWindowType.LOGIN);

  return (
    <>
      <button
        type="button"
        title="login/register"
        className="flex items-center justify-center"
        onClick={() => setIsOpen(true)}
      >
        <BsFillPersonFill className="text-xl" />
      </button>
      {type === EWindowType.LOGIN ? (
        <LoginType
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setType={setType}
          type={type}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default UserAuthButton;

const LoginType = ({
  isOpen,
  setIsOpen,
}: IProps & {
  setType: Dispatch<SetStateAction<EWindowType>>;
  type: EWindowType;
}) => {
  const [formValues, setFormValues] = useState({
    background: "",
    text: "",
    textColor: "",
  });

  const loginMutation = useMutation<
    ILoginSuccess,
    IGenericErrorResponse,
    FormEvent
  >({
    mutationFn: (event) => {
      event.preventDefault();

      return fetch(`${getApiUrl()}/auth/login`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formValues),
      })
        .then((response) => response.json())
        .then((result) => {
          if ("success" in result && !result.success)
            throw new Error(result.message);

          return result;
        });
    },
    onSuccess: (result) => {
      console.log(result);
      let date = new Date();
      date.setTime(date.getTime() + 2000 * 24 * 60 * 60 * 1000);
      const { user, token } = result;

      console.log(date);

      setCookie(
        "user-access-token",
        JSON.stringify({
          accessToken: token,
          expiresAt: date,
        }),
        {
          expires: new Date(date),
        }
      );

      setIsOpen(false);
    },
  });

  useGetUserData({
    enabled: loginMutation.isSuccess && !!loginMutation.data?.token,
    accessToken: loginMutation.data?.token,
  });

  return (
    <Dialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      header={{
        title: loginMutation.isSuccess ? "Logged successfully" : "Log in",
        description: loginMutation.isSuccess ? (
          <>Getting your user data...</>
        ) : (
          ""
        ),
      }}
    >
      {!loginMutation.isSuccess && (
        <form
          className="mx-auto my-4 sm:w-11/12"
          onSubmit={loginMutation.mutate}
        >
          <fieldset
            className="mt-2 space-y-4"
            disabled={loginMutation.isLoading}
          >
            <FormField
              values={formValues}
              setValues={setFormValues}
              name="email"
              type="email"
              placeholder="*email"
              autoComplete="email"
              minLength={3}
            />
            <FormField
              values={formValues}
              setValues={setFormValues}
              name="password"
              type="password"
              placeholder="*password"
              autoComplete="password"
              minLength={3}
            />

            <div className="flex justify-end mt-4">
              <Button
                type="submit"
                classesIntent={{ w: "full" }}
                className="mt-4"
                disabled={loginMutation.isLoading}
              >
                Submit
              </Button>
            </div>
          </fieldset>
          {loginMutation.isError && (
            <div className="text-bg-secondary-2">
              <p>{loginMutation.error.message}</p>
            </div>
          )}
        </form>
      )}
    </Dialog>
  );
};
