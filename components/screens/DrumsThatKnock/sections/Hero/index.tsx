import CustomNextImage from "@components/shared/common/CustomNextImage";
import { EditDTKmainSection } from "@components/shared/common/Dialog/editDialogFunctions";
import Button from "@components/shared/core/Button";
import KnockTrademark from "@components/shared/core/KnockTrademark";
import { Fragment, useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";

const HeroSection = ({ data }: { data: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [paragraphId, setParagraphId] = useState(null);

  const [formValues, setFormValues] = useState({
    br: "",
    h2: "",
    tradeMark: "",
    p: "",
    sectionId: "main-section",
  });

  useEffect(() => {
    if (paragraphId) {
      const paragraph = data
        ? data.p.filter((el: any) => el.id === paragraphId)[0]
        : "";

      setFormValues((value) => {
        return {
          ...value,
          p: paragraph.text,
          tradeMark: paragraph.tradeMark,
        };
      });
    }
  }, [paragraphId, data]);

  useEffect(() => {
    if (data)
      setFormValues((value) => {
        return {
          ...value,
          br: data.br,
          h2: data.h2,
          tradeMark: data.tradeMark,
        };
      });
  }, []);

  return (
    <section className="bg-primary-1 section-p-v1 leading-[1] sm:leading-[1.7]">
      <EditDTKmainSection
        paragraphId={paragraphId}
        setFormValues={setFormValues}
        formValues={formValues}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      />

      <div className="relative py-4 my-6 flex items-center justify-center text-center text-primary-1 min-h-fit max-h-[30rem]">
        <CustomNextImage
          src="/images/Group 179.png"
          width={800}
          height={800}
          priority
          className="pointer-events-none select-none absolute top-0 right-0 left-0 bottom-0 w-full h-full object-contain"
          style={{ transform: "translate(5%, -3%) scale(2.8, 2.6)" }}
        />
        <div className="relative flex flex-col items-center justify-center text-center gap-4 text-primary-2 py-10 sm:p-0">
          <h1 className="font-semibold text-h2 uppercase text-primary-1">
            {data && data.br ? data.br : ""}
            <div className="flex flex-wrap items-center justify-center text-center">
              {data && data.h2 ? <>{data.h2}&nbsp;</> : ""}
              <KnockTrademark tradeMark={data ? data.tradeMark : ""} />
            </div>
          </h1>
          <Button
            onClick={() => {
              setIsOpen(true);
              setParagraphId(null);
            }}
          >
            <AiFillEdit />
          </Button>
          {data
            ? data.p.map((el: any) =>
                el.tradeMark ? (
                  <Fragment key={el.id}>
                    <p className="text-[1rem] sm:text-2xl flex flex-wrap items-center justify-center text-center">
                      {el.text} &nbsp;
                      <KnockTrademark tradeMark={el.tradeMark} />.
                    </p>
                    <Button
                      onClick={() => {
                        setIsOpen(true);
                        setParagraphId(el.id);
                      }}
                    >
                      <AiFillEdit />
                    </Button>
                  </Fragment>
                ) : (
                  <Fragment key={el.id}>
                    <p className="text-[1rem] sm:text-2xl max-w-[600px]">
                      {el.text}
                    </p>
                    <Button
                      onClick={() => {
                        setIsOpen(true);
                        setParagraphId(el.id);
                      }}
                    >
                      <AiFillEdit />
                    </Button>
                  </Fragment>
                )
              )
            : ""}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
