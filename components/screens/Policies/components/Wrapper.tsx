import type { ReactNode } from "react";

import classes from "@styles/content.module.css";
import Button from "@components/shared/core/Button";
import { useGetUserDataFromStore } from "@utils/core/hooks";

interface IProps {
  header: {
    h1Children: ReactNode;
    pChildren?: ReactNode;
  };
  head: {
    title: ReactNode;
    description?: ReactNode;
  };
  children: ReactNode;
  sectionProps?: Record<string, any>;
  resetHandler?: any;
}

const Wrapper = ({
  head,
  header,
  children,
  sectionProps = {},
  resetHandler,
}: IProps) => {
  const pageDescription =
    typeof head.description === "string" ? head.description : undefined;

  const { user } = useGetUserDataFromStore();

  return (
    <>
      <section className="bg-primary-1 section-p-v1" {...sectionProps}>
        <div className="md:max-w-[800px] mx-auto">
          <header className="flex flex-col gap-4 text-text-primary-1">
            <h1 className="text-h2 font-semibold capitalize">
              {header.h1Children}
            </h1>
            {header.pChildren && <p>{header.pChildren}</p>}
          </header>
          <div
            className={`${classes.contentContainer} ${classes.contentContainerElements}`}
          >
            {children}
          </div>
        </div>
        {user.data ? (
          <div className="md:max-w-[800px] mx-auto flex justify-center">
            <Button onClick={() => resetHandler()}>Reset</Button>
          </div>
        ) : (
          ""
        )}
      </section>
    </>
  );
};

export default Wrapper;
