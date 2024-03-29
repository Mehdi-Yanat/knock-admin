import React, { useEffect, useRef, useState } from "react";
import Dialog from "../Dialog";
import Link from "next/link";
import { useSharedCustomerState } from "@context/Customer";
import CustomNextImage from "../CustomNextImage";
import { getIdFromGid, priceCurrencyFormatter } from "@utils/core/shopify";
import {
  AiFillCopy,
  AiFillDelete,
  AiFillEdit,
  AiFillPlusCircle,
  AiFillSetting,
  AiOutlineDrag,
} from "react-icons/ai";
import {
  EditUpSellingSettings,
  EditandAddUpSelling,
} from "../Dialog/editDialogFunctions";
import AlertDialogComponent from "../Dialog/alertDialog";
import { getGetAccessTokenFromCookie } from "@utils/core/hooks";

const UpSellingPopup = (props: any) => {
  const [
    {
      isVisible: { headerCart: isCartVisible },
      cart: { productsData },
    },
    customerDispatch,
  ] = useSharedCustomerState();

  const [interestedProduct, setInterestedProduct] = useState<any>([]);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenEditSettings, setIsOpenEditSettings] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const [formValues, setFormValues] = useState({
    hasDiscount: false,
    handle: "",
    discount_code: "",
    discount_percentage: null,
    comparePriceAt: "",
    price: "",
    isEditing: false,
  });

  const [formValuesSettings, setFormValuesSettings] = useState({
    disable: true,
    buttonText: "",
  });

  useEffect(() => {
    if (props.upsellingSettings) {
      setFormValuesSettings(props.upsellingSettings);
    }
  }, [props.upsellingSettings.id]);

  useEffect(() => {
    if (formValues.handle && formValues.isEditing) {
      const filter = props.upselling.filter(
        (el: { handle: string }) => el.handle === formValues.handle
      )[0];

      setFormValues(() => {
        return {
          ...filter,
          isEditing: true,
        };
      });
    }
  }, [formValues.handle, formValues.isEditing]);

  useEffect(() => {
    if (props.upselling && props.upselling.length) {
      const filterUpSellingsProduct = props.upselling.map((upsell: any) => {
        const filter = props.products.find(
          (el: any) => el.handle === upsell.handle
        );
        return {
          ...filter,
          ...upsell,
        };
      });

      setInterestedProduct(filterUpSellingsProduct);
    } else {
      setInterestedProduct([]);
    }
  }, [props.upselling, props.upselling?.length]);

  const knockPlugin = props.products.find(
    (el: { handle: string }) => el.handle === "knock-plugin"
  );

  const accessToken = getGetAccessTokenFromCookie();

  const dragItem = useRef<any>();
  const dragOverItem = useRef<any>();

  //const handle drag sorting
  const handleSort = () => {
    //duplicate items
    let _interestedProduct = [...interestedProduct];

    //remove and save the dragged item content
    const draggedItemContent = _interestedProduct.splice(
      dragItem.current,
      1
    )[0];

    //switch the position
    _interestedProduct.splice(dragOverItem.current, 0, draggedItemContent);

    //reset the position ref
    dragItem.current = null;
    dragOverItem.current = null;

    console.log(_interestedProduct);

    const reorderedItems = _interestedProduct.map((item, index) => ({
      id: item.id,
      position: index + 1, // Assign the new order positions
    }));

    fetch(
      `${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/edit-upselling-product/order`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken,
        },
        body: JSON.stringify({ reorderedItems }),
      }
    ).then((res) => {
      console.log(res);
    });

    //update the actual array
    setInterestedProduct(_interestedProduct);
  };

  return (
    <Dialog
      isOpen={props.isOpen}
      setIsOpen={props.setIsOpen}
      header={{
        title: "You May Be Also Interested in",
      }}
    >
      <EditandAddUpSelling
        formValues={formValues}
        setFormValues={setFormValues}
        isOpen={isOpenEdit}
        setIsOpen={setIsOpenEdit}
        products={props.products}
      />
      <EditUpSellingSettings
        formValues={formValuesSettings}
        setFormValues={setFormValuesSettings}
        isOpen={isOpenEditSettings}
        setIsOpen={setIsOpenEditSettings}
      />

      {!interestedProduct?.length
        ? "Add upselling product"
        : interestedProduct.map((product: any, index: any) => (
            <div
              onDragEnter={(e) => (dragOverItem.current = index)}
              onDragEnd={handleSort}
              onDragStart={(e) => (dragItem.current = index)}
              onDragOver={(e) => e.preventDefault()}
              draggable
              key={product.id}
            >
              {!product.title.endsWith("(PIB)") ? (
                <article
                  key={product.id}
                  className="flex mt-3  border-b-[0.0625rem] border-b-primary-1 pb-4"
                >
                  <div className="w-28 min-w-[4rem] aspect-square bg-primary-1 max-w-[30%]">
                    {product.images[0]?.src && (
                      <CustomNextImage
                        src={product.images[0]?.src}
                        alt={product.images[0]?.alt || ""}
                        width={112}
                        height={112}
                        className="object-contain w-full h-full aspect-square"
                      />
                    )}
                  </div>
                  <div className="flex flex-col flex-grow gap-2 px-4 py-2">
                    <header className="flex  flex-col gap-1 sm:flex-row sm:gap-2 sm:justify-between">
                      <h4>
                        <Link
                          href={
                            product.handle === "knock-plugin"
                              ? "/knock"
                              : product.handle === "knock-clipper"
                              ? "/knock-clipper"
                              : `/products/${getIdFromGid(product.id)}`
                          }
                          className="inline-block whitespace-nowrap max-w-[10rem] text-ellipsis overflow-hidden"
                        >
                          {product.title}
                        </Link>
                        {product.hasDiscount ? (
                          <div className="flex items-center gap-1">
                            <p
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  product.discount_code
                                ),
                                  setIsCopied(product.handle);
                              }}
                            >
                              {product.discount_code}
                            </p>
                            <AiFillCopy
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  product.discount_code
                                ),
                                  setIsCopied(product.handle);
                              }}
                            />
                            {isCopied === product.handle ? <p>Copied</p> : ""}
                          </div>
                        ) : (
                          ""
                        )}
                      </h4>
                      <p title="price per product">
                        {
                          <>
                            <del>
                              {priceCurrencyFormatter(
                                product.variants[0].compareAtPrice
                                  ? product.variants[0].compareAtPrice.amount
                                  : product.variants[0].price.amount,
                                product.variants[0].compareAtPrice
                                  ? product.variants[0].compareAtPrice
                                      .currencyCode
                                  : product.variants[0].price.currencyCode
                              )}
                            </del>
                            &nbsp;
                            <span className="text-bg-secondary-2">
                              {product.variants[0].compareAtPrice
                                ? priceCurrencyFormatter(
                                    (
                                      product.variants[0].compareAtPrice
                                        .amount -
                                      (product.variants[0].compareAtPrice
                                        .amount *
                                        product.discount_percentage) /
                                        100
                                    )
                                      .toString()
                                      .split(".")[0],
                                    product.variants[0].compareAtPrice
                                      .currencyCode
                                  )
                                : priceCurrencyFormatter(
                                    (
                                      product.variants[0].price.amount -
                                      (product.variants[0].price.amount *
                                        product.discount_percentage) /
                                        100
                                    )
                                      .toString()
                                      .split(".")[0],
                                    product.variants[0].price.currencyCode
                                  )}
                            </span>
                          </>
                        }
                      </p>
                    </header>
                    <div className="flex flex-col sm:flex-row  items-end justify-between gap-1 h-full">
                      <p className="text-xs">
                        {product.hasDiscount
                          ? `Use the above code to get ${product.discount_percentage?.toFixed(
                              0
                            )} % off your purchase `
                          : `Product is ${
                              product.discount_percentage?.toFixed(0) || 0
                            } % off your purchase`}
                      </p>

                      <div className="flex gap-2 ">
                        <AiFillEdit
                          className="cursor-pointer font-semibold outline-none  	duration-300 transition-all w-fit px-6 rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                          color="white"
                          size={20}
                          onClick={() => {
                            setIsOpenEdit(true),
                              setFormValues((values) => {
                                const selectedProduct = props.products.find(
                                  (el: any) => el.handle === product.handle
                                );

                                console.log(selectedProduct);

                                return {
                                  ...values,
                                  handle: product.handle,
                                  comparePriceAt:
                                    selectedProduct.variants[0].compareAtPrice
                                      ?.amount,
                                  price:
                                    selectedProduct.variants[0].price.amount,
                                  isEditing: true,
                                };
                              });
                          }}
                        />

                        <AlertDialogComponent
                          action={"upselling"}
                          handleProduct={product.handle}
                        >
                          <AiFillDelete
                            className="cursor-pointer font-semibold outline-none  	duration-300 transition-all w-fit px-6 rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                            color="white"
                            size={20}
                          />
                        </AlertDialogComponent>

                        <AiOutlineDrag
                          className="hidden md:block cursor-pointer font-semibold outline-none  	duration-300 transition-all w-fit px-6 rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                          color="white"
                          size={20}
                        />
                      </div>
                    </div>
                  </div>
                </article>
              ) : (
                ""
              )}
            </div>
          ))}
      <div className="flex items-center justify-center gap-2 mt-4">
        <AiFillPlusCircle
          className="cursor-pointer  font-semibold outline-none  	duration-300 transition-all w-fit px-6 rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
          color="white"
          onClick={() => {
            setIsOpenEdit(true),
              setFormValues((values) => {
                return {
                  hasDiscount: false,
                  handle: "knock-plugin",
                  discount_code: "",
                  disable: true,
                  discount_percentage: null,
                  buttonText: "",
                  isEditing: false,
                  comparePriceAt:
                    knockPlugin.variants[0].compareAtPrice?.amount,
                  price: knockPlugin.variants[0].price?.amount,
                };
              });
          }}
        />
        <AiFillSetting
          className="cursor-pointer  font-semibold outline-none  	duration-300 transition-all w-fit px-6 rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
          color="white"
          onClick={() => {
            setIsOpenEditSettings(true);
          }}
        />
      </div>
    </Dialog>
  );
};

export default UpSellingPopup;
