import type { IButtonProps, _ILinkProps } from "@components/shared/core/Button";
import type { ICustomNextImageProps } from "@components/shared/common/CustomNextImage";
import { Dispatch, HTMLAttributes, SetStateAction, useState } from "react";

import CustomNextImage from "@components/shared/common/CustomNextImage";
import Button from "@components/shared/core/Button";
import type { IProduct } from "types";
import { useAddProductsToCheckoutAndCart } from "@utils/core/hooks";
import { cva, cx, VariantProps } from "class-variance-authority";
import { AiFillEdit } from "react-icons/ai";
import { EditHomePageSecondSection } from "@components/shared/common/Dialog/editDialogFunctions";
import Image from "next/image";

const handleBackgroundImgVariants = cva(
  "pointer-events-none select-none object-contain mx-auto w-full h-full",
  {
    variants: {
      translateY: { small: "translate-y-[12.5%]" },
      translateX: { small: "translate-x-[10%]" },
      scale: { lg: "scale-[2.25]", md: "scale-[1.75]" },
    },
    defaultVariants: { translateY: "small", scale: "lg" },
  }
);
const handleWrapperVariants = cva("h-full flex max-w-[1280px] items-center", {
  variants: {
    flexDir: {
      "col-lg:row": "flex-col lg:flex-row",
      "col-reverse-lg:row": "flex-col-reverse lg:flex-row",
      "col-lg:row-reverse": "flex-col lg:flex-row-reverse",
      "col-reverse-lg:row-reverse": "flex-col-reverse lg:flex-row",
    },
  },
  defaultVariants: { flexDir: "col-lg:row" },
});

interface IProps {
  textContainer: {
    h2: HTMLAttributes<HTMLHeadingElement>;
    p: HTMLAttributes<HTMLParagraphElement>;
    button: IButtonProps | _ILinkProps;
  };
  imageContainer: {
    mainImg: ICustomNextImageProps;
    backgroundImg?:
      | (Partial<ICustomNextImageProps> & {
          variants?: VariantProps<typeof handleBackgroundImgVariants>;
        })
      | false;
    index?: HTMLAttributes<HTMLDivElement>;
  };
  wrapper?: HTMLAttributes<HTMLDivElement> & {
    variants?: VariantProps<typeof handleWrapperVariants>;
  };
  product?: IProduct;
  sectionEditor?: {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
  };
  user?: any;
}

const ProductShowcase = ({
  product,
  textContainer: { h2 = {}, p = {}, button = {} },
  imageContainer: { mainImg, backgroundImg = {}, index: imageContainerIndex },
  wrapper = {},
  sectionEditor,
  user,
}: IProps) => {
  const addProductsToCheckoutAndCart = useAddProductsToCheckoutAndCart();

  const { className: backgroundImgClassName = "", ...backgroundImgProps } =
    backgroundImg || {};

  const openProductShowCaseEditor = () => {
    sectionEditor?.setIsOpen(true);
  };



  return (
    <div className="flex flex-col items-center">
      <div
        {...wrapper}
        className={handleWrapperVariants({
          ...(wrapper.variants || {}),
          className: wrapper.className,
        })}
      >
        <div
          className="w-full h-full flex flex-col items-center justify-center text-center gap-2 md:px-4 pb-4
							lg:gap-4 lg:w-fit lg:max-w-[60%]  lg:text-align-initial lg:items-start lg:py-4"
        >
          <h2
            className="text-h3 font-semibold text-primary-1  flex flex-wrap text-center justify-center
						lg:text-align-initial lg:justify-start"
            {...h2}
          />
          <p className="md:max-w-[450px]" {...p} />

          <Button
            className="capitalize mt-3"
            onClick={() =>
              product &&
              addProductsToCheckoutAndCart.mutate({
                products: [{ ...product, quantity: 1 }],
              })
            }
            {...button}
          />
        </div>
        <div
          {...imageContainerIndex}
          className={cx(
            "w-full relative flex items-center",
            "lg:w-[40%]",
            imageContainerIndex?.className
          )}
        >
          {backgroundImg && (
            <div className="absolute w-full h-full">
              <CustomNextImage
                src="/images/Rectangle 47.png"
                width={600}
                height={600}
                className={`${backgroundImgClassName} pointer-events-none select-none object-contain mx-auto w-full h-full scale-[2.25] translate-y-[12.5%]`}
                {...backgroundImgProps}
              />
            </div>
          )}
          {mainImg.src.startsWith("blob") ? (
            <Image
              src={mainImg.src}
              alt="Preview mode"
              width={600}
              height={600}
              priority
              unoptimized
              className={cx(
                mainImg.className,
                "relative mx-auto w-full object-contain max-w-[80%] sm:max-w-[60%] lg:max-w-full"
              )}
            />
          ) : (
            <CustomNextImage
              {...mainImg}
              src={mainImg.src}
              width={600}
              height={600}
              className={cx(
                mainImg.className,
                "relative mx-auto w-full object-contain max-w-[80%] sm:max-w-[60%] lg:max-w-full"
              )}
            />
          )}
        </div>
      </div>
      {user ? (
        <AiFillEdit
          className="left-5 cursor-pointer mt-10	 font-semibold outline-none  left-5
	duration-300 transition-all w-fit px-8 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
          color="white"
          size={25}
          onClick={openProductShowCaseEditor}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default ProductShowcase;
