import Button from "@components/shared/core/Button";
import {
  getGetAccessTokenFromCookie,
  useGetUserCheckoutDetailsAndIdAndKey,
  useGetUserDataFromStore,
  useLogoutUser,
} from "@utils/core/hooks";

import type { IGenericErrorResponse, IUser } from "types";

import { Dispatch, FormEvent, SetStateAction, useMemo, useState } from "react";

import Table from "../../shared/core/table/table";

import Dialog from "@components/shared/common/Dialog";
import FormField from "@components/shared/core/FieldForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getApiUrl } from "lib/getApiUrl";

const TitleValue = ({
  title,
  value,
  isSmall,
}: {
  title: string;
  value: string | number;
  isSmall?: boolean;
}) => (
  <p>
    {isSmall ? (
      <small>
        <strong className="capitalize">{title}</strong>&nbsp;
        {value}
      </small>
    ) : (
      <>
        <strong className="capitalize">{title}</strong>&nbsp;
        {value}
      </>
    )}
  </p>
);

const UpdateUserBasicDetails = ({
  isOpen,
  setIsOpen,
  setAdmins
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setAdmins: Dispatch<SetStateAction<never[]>>
}) => {
  const queryClient = useQueryClient();
  const { user: user } = useGetUserDataFromStore();
  const accessTokenFrom = getGetAccessTokenFromCookie();

  const initFromValues = () => ({
    email: user.data ? user.data.email : "",
    firstName: user.data ? user.data.firstName : "",
    lastName: user.data ? user.data.lastName : "",
  });

  const [formValues, setFormValues] = useState(initFromValues());

  const isChanged = useMemo(() => {
    if (
      !user.data ||
      (user.data &&
        user.data.email.trim() === formValues.email?.trim() &&
        user.data.firstName === formValues?.firstName &&
        user.data.lastName === formValues?.lastName)
    )
      return false;

    return true;
  }, [formValues.email, formValues.firstName, formValues.lastName, user.data]);

  const updateMutation = useMutation<{}, IGenericErrorResponse, FormEvent>({
    mutationFn: (event) => {
      event.preventDefault();

      if (!accessTokenFrom) throw new Error("No access token available");
      if (!isChanged) throw new Error("No changes detected");
      if (!user.data) throw new Error("No user data available");

      return fetch(`${getApiUrl()}/admin/${user.data.id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: accessTokenFrom,
        },
        body: JSON.stringify({
          email:
            user.data.email !== formValues.email
              ? formValues.email
              : user.data.email,
          firstName:
            user.data?.firstName !== formValues.firstName
              ? formValues.firstName
              : user.data.firstName,
          lastName:
            user.data?.lastName !== formValues.lastName
              ? formValues.lastName
              : user.data.lastName,
        }),
      })
        .then((response) => response.json())
        .then((result) => {
          if ("success" in result && !result.success)
            throw new Error(result.message);
			setAdmins(result.admins)
          return result;
        });
    },
    onSuccess: async (result) => {
      queryClient.setQueryData<IUser>(["check-token"], (prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          ...formValues,
        };
      });
      setIsOpen(false);
    },
  });

  return (
    <Dialog
      header={{ title: "Update Your Basic Details" }}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <form
        className="sm:w-11/12 mx-auto my-4 flex flex-col"
        onSubmit={updateMutation.mutate}
      >
        <fieldset
          className="mt-2 space-y-4"
          disabled={updateMutation.isLoading}
        >
          <FormField
            values={formValues}
            setValues={setFormValues}
            name="firstName"
            placeholder="*first name"
            autoComplete="first-name"
            minLength={3}
          />
          <FormField
            values={formValues}
            setValues={setFormValues}
            name="lastName"
            placeholder="*last name"
            autoComplete="last-name"
            minLength={3}
          />
          <FormField
            values={formValues}
            setValues={setFormValues}
            name="email"
            type="email"
            placeholder="*email"
            autoComplete="email"
            minLength={3}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              classesIntent={{ w: "full" }}
              disabled={updateMutation.isLoading || !isChanged}
            >
              Submit
            </Button>
          </div>
        </fieldset>
        {updateMutation.isError && (
          <div className="text-bg-secondary-2">
            <p>{updateMutation.error.message}</p>
          </div>
        )}
      </form>
    </Dialog>
  );
};

const AddAdminMutiation = ({
  isOpen,
  setIsOpen,
  setAdmins,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setAdmins: Dispatch<SetStateAction<[]>>;
}) => {
  const initFromValues = () => ({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });

  const [formValues, setFormValues] = useState(initFromValues());

  const accessTokenFrom = getGetAccessTokenFromCookie();

  const AddMutation = useMutation<{}, IGenericErrorResponse, FormEvent>({
    mutationFn: (event) => {
      event.preventDefault();

      return fetch(`${getApiUrl()}/admin`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: accessTokenFrom,
        },
        body: JSON.stringify({
          email: formValues.email,
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          password: formValues.password,
        }),
      })
        .then((response) => response.json())
        .then((result) => {
          if ("success" in result && !result.success)
            throw new Error(result.message);

          setAdmins(result.admins);
          return result.admins;
        });
    },
    onSuccess: async (result) => {
      setIsOpen(false);
    },
  });

  return (
    <Dialog
      header={{ title: "Add new admin" }}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <form
        className="sm:w-11/12 mx-auto my-4 flex flex-col"
        onSubmit={AddMutation.mutate}
      >
        <fieldset className="mt-2 space-y-4" disabled={AddMutation.isLoading}>
          <FormField
            values={formValues}
            setValues={setFormValues}
            name="firstName"
            placeholder="*first name"
            autoComplete="first-name"
            minLength={3}
          />
          <FormField
            values={formValues}
            setValues={setFormValues}
            name="lastName"
            placeholder="*last name"
            autoComplete="last-name"
            minLength={3}
          />
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
          <div className="flex justify-end">
            <Button type="submit" classesIntent={{ w: "full" }}>
              Submit
            </Button>
          </div>
        </fieldset>
        {AddMutation.isError && (
          <div className="text-bg-secondary-2">
            <p>{AddMutation.error.message}</p>
          </div>
        )}
      </form>
    </Dialog>
  );
};

const CustomerProfileScreen = () => {
  const { user } = useGetUserDataFromStore();

  const [isUpdateUserBasicDetailsOpen, setIsUpdateUserBasicDetailsOpen] =
    useState(false);
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [admins, setAdmins] = useState([]);

  const userCheckoutDetailsAndIdAndKey = useGetUserCheckoutDetailsAndIdAndKey();

  const logoutUser = useLogoutUser({
    userCheckoutDetailsAndIdAndKey,
  });

  let pageTitle = `Loading... |`;

  if (!user.isSuccess) {
    pageTitle = !user.isSuccess
      ? `Please login first to view your data, or reload the page and make sure you have a good internet connection |`
      : `Your data doesn't exist | `;

    return (
      <>
        <section className="bg-primary-1 section-p-v1 h-[75vh] max-h-[45rem] min-h-fit">
          <div className="max-w-screen-md mx-auto">
            <p>
              {!user.isSuccess
                ? "Please login first to view your data, or reload the page and make sure you have a good internet connection"
                : "Your data doesn't exist "}
            </p>
          </div>
        </section>
      </>
    );
  }

  pageTitle = `${user.data.firstName} ${user.data.lastName} | Customer Profile |`;
  return (
    <>
      <section className="bg-primary-1 section-p-v1">
        <div className="max-w-screen-md mx-auto flex flex-col gap-16">
          <header className="flex flex-col items-center">
            <h1 className="text-h1 uppercase">Account</h1>
            <p>
              Logged in as{" "}
              <span className="text-bg-secondary-1">{user.data?.email}</span> (
              <Button
                onClick={() => logoutUser.mutate()}
                disabled={logoutUser.isLoading}
                classesIntent={{ rounded: "none", p: "none", theme: "none" }}
                className="text-bg-secondary-1 hover:text-violet-600 focus:text-violet-600"
              >
                logout
              </Button>
              )
            </p>
          </header>
          <div className="flex flex-col gap-1">
            <p className="capitalize text-primary-1">
              {user.data?.firstName} {user.data?.lastName}
            </p>
            <p>{user.data?.email}</p>
            <TitleValue
              title="Account Created:"
              value={new Date(user?.data?.createdAt || "").toLocaleString()}
              isSmall
            />

            {user.data.email !== "knock@admin.com" ? (
              <Button
                onClick={() => setIsUpdateUserBasicDetailsOpen(true)}
                classesIntent={{ rounded: "none", p: "none", theme: "none" }}
                className="text-bg-secondary-1 hover:text-violet-600 focus:text-violet-600"
              >
                Edit
              </Button>
            ) : (
              ""
            )}
            <UpdateUserBasicDetails
			  setAdmins={setAdmins}
              isOpen={isUpdateUserBasicDetailsOpen}
              setIsOpen={setIsUpdateUserBasicDetailsOpen}
            />
          </div>
        </div>
      </section>
      <section>
        <Table
          admins={admins}
          setAdmins={setAdmins}
          setIsAddAdminOpen={setIsAddAdminOpen}
          isAddAdminOpen={isAddAdminOpen}
          AddAdminMutiation={AddAdminMutiation}
        />
      </section>
    </>
  );
};

export default CustomerProfileScreen;
