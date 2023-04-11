import { EditPrivacyPolicy } from "@components/shared/common/Dialog/editDialogFunctions";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getPrivacyPolicy } from "@utils/core/API";
import {
  getGetAccessTokenFromCookie,
  useGetUserDataFromStore,
} from "@utils/core/hooks";
import { useEffect, useState, type CSSProperties } from "react";
import { AiFillEdit } from "react-icons/ai";
import Wrapper from "./components/Wrapper";
import { toast } from "react-toastify";
import Button from "@components/shared/core/Button";

const PrivatePoliciesScreen = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editSectionId, setEditSection] = useState("");
  const { data } = useQuery(["privacy-page"], () => getPrivacyPolicy(), {
    onSuccess(data) {
      return data;
    },
    refetchInterval: 3000,
  });

  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    if (editSectionId) {
      switch (editSectionId) {
        case "head":
          setFormValues({
            sectionId: editSectionId,
            head: data.head,
            head2: data.head2,
          });
          break;
        case "collecting":
          setFormValues({
            sectionId: editSectionId,
            ...data.collecting[0],
          });
          break;
        case "minors":
          setFormValues({
            sectionId: editSectionId,
            ...data.minors[0],
          });
          break;
        case "sharing":
          setFormValues({
            sectionId: editSectionId,
            ...data.sharing[0],
          });
          break;
        case "behavioural":
          setFormValues({
            sectionId: editSectionId,
            ...data.behavioural[0],
          });
          break;
        case "personal":
          setFormValues({
            sectionId: editSectionId,
            ...data.personal[0],
          });
          break;
        case "lawful":
          setFormValues({
            sectionId: editSectionId,
            ...data.lawfulBasis[0],
          });
          break;
        case "retention":
          setFormValues({
            sectionId: editSectionId,
            ...data.retention[0],
          });
          break;

        default:
          break;
      }
    }
  }, [editSectionId]);

  const { user } = useGetUserDataFromStore();

  const accessToken = getGetAccessTokenFromCookie();

  const resetSection = useMutation({
    mutationFn: (event) => {
      return fetch(
        `${process.env.NEXT_PUBLIC_KNOCK_URL_API}/ui/reset-privacy-policy`,
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
      <EditPrivacyPolicy
        formValues={formValues}
        setFormValues={setFormValues}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <Wrapper
        resetHandler={resetSection.mutate}
        sectionProps={{
          style: {
            "--ul-li-style": "url(/svgs/gray-circle.svg)",
          } as CSSProperties,
        }}
        header={{
          pChildren: (
            <>
              {data?.head}
              <br />
              {data?.head2}
              {user.data ? (
                <AiFillEdit
                  className="cursor-pointer mt-2 m-auto	 font-semibold outline-none  	duration-300 transition-all w-fit px-8 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                  color="white"
                  size={25}
                  onClick={() => {
                    setIsOpen(true);
                    setEditSection("head");
                  }}
                />
              ) : (
                ""
              )}
            </>
          ),
          h1Children: "Privacy policy",
        }}
        head={{
          title: "Privacy Policy",
          description:
            "This Privacy Policy describes how (the 'Site' or 'we') \n collects, uses, and discloses your Personal Information when you visit or make a purchase from the Site.",
        }}
      >
        {data ? (
          <>
            <h2>{data.collecting[0].h2}</h2>
            <p>{data.collecting[0].p}</p>
            <p>
              <u>{data.collecting[0].u}</u>
            </p>
            <ul>
              {data.collecting[0].li.map((el: any) => (
                <li key={el.id}>
                  <strong>{el.strong}</strong>
                  <span>&nbsp;</span>
                  {el.text}
                  {user.data ? (
                    <AiFillEdit
                      className="cursor-pointer mt-2 m-auto  	 font-semibold outline-none  	duration-300 transition-all w-fit px-2 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                      color="white"
                      size={25}
                      onClick={() => {
                        setIsOpen(true);
                        setFormValues({
                          sectionId: "collecting-li",
                          id: el.id,
                          strong: el.strong,
                          text: el.text,
                        });
                      }}
                    />
                  ) : (
                    ""
                  )}
                </li>
              ))}
            </ul>
            <p>
              <u>{data.collecting[0].u2}</u>
            </p>

            <ul>
              {data.collecting[0].li2.map((el: any) => (
                <li key={el.id}>
                  <strong>{el.strong}</strong>
                  <span>&nbsp;</span>
                  {el.text}
                  {user.data ? (
                    <AiFillEdit
                      className="cursor-pointer mt-2 m-auto 	 font-semibold outline-none  	duration-300 transition-all w-fit px-2 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                      color="white"
                      size={25}
                      onClick={() => {
                        setIsOpen(true);
                        setFormValues({
                          sectionId: "collecting-li2",
                          id: el.id,
                          strong: el.strong,
                          text: el.text,
                        });
                      }}
                    />
                  ) : (
                    ""
                  )}
                </li>
              ))}
            </ul>
            <p>&nbsp;</p>
            {user.data ? (
              <AiFillEdit
                className="cursor-pointer mt-2 m-auto	 font-semibold outline-none  	duration-300 transition-all w-fit px-8 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                color="white"
                size={25}
                onClick={() => {
                  setIsOpen(true);
                  setEditSection("collecting");
                }}
              />
            ) : (
              ""
            )}
            <h3>{data.minors[0].h3}</h3>
            <p>{data.minors[0].p}</p>
            {user.data ? (
              <AiFillEdit
                className="cursor-pointer mt-2 m-auto	 font-semibold outline-none  	duration-300 transition-all w-fit px-8 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                color="white"
                size={25}
                onClick={() => {
                  setIsOpen(true);
                  setEditSection("minors");
                }}
              />
            ) : (
              ""
            )}
            <h2>{data.sharing[0].h2}</h2>
            <p>{data.sharing[0].p}</p>
            <ul>
              {data.sharing[0].ul.map((el: any) => (
                <li>
                  {el.li}
                  <span>&nbsp;</span>
                  <a rel="noreferrer noopener" href={el.a} target="_blank">
                    {el.a}
                  </a>
                  .
                  {user.data ? (
                    <AiFillEdit
                      className="cursor-pointer mt-2 m-auto  	 font-semibold outline-none  	duration-300 transition-all w-fit px-2 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                      color="white"
                      size={25}
                      onClick={() => {
                        setIsOpen(true);
                        setFormValues({
                          sectionId: "sharing-ul",
                          id: el.id,
                          li: el.li,
                          a: el.a,
                        });
                      }}
                    />
                  ) : (
                    ""
                  )}
                </li>
              ))}
            </ul>
            <h3>{data.behavioural[0].h3}</h3>
            <p>{data.behavioural[0].p[0].text}</p>
            <ul>
              {data.behavioural[0].ul.map((el: any) => (
                <>
                  <li>
                    {el.li || ""}
                    <span>&nbsp;</span>
                    {el.a ? (
                      <a rel="noreferrer noopener" href={el.a} target="_blank">
                        {el.a}
                      </a>
                    ) : (
                      ""
                    )}
                  </li>
                  {user.data ? (
                    <AiFillEdit
                      className="cursor-pointer mt-2 m-auto  	 font-semibold outline-none  	duration-300 transition-all w-fit px-2 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                      color="white"
                      size={25}
                      onClick={() => {
                        setIsOpen(true);
                        setFormValues({
                          sectionId: "behavioural-ul",
                          id: el.id,
                          li: el.li,
                          a: el.a,
                        });
                      }}
                    />
                  ) : (
                    ""
                  )}
                </>
              ))}
            </ul>
            <p>
              {data.behavioural[0].p[1].text}
              <span>&nbsp;</span>
              <a
                rel="noreferrer noopener"
                href={data.behavioural[0].p[1].a}
                target="_blank"
              >
                {data.behavioural[0].p[1].a}{" "}
              </a>
              {user.data ? (
                <AiFillEdit
                  className="cursor-pointer mt-2 m-auto  	 font-semibold outline-none  	duration-300 transition-all w-fit px-2 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                  color="white"
                  size={25}
                  onClick={() => {
                    setIsOpen(true);
                    setFormValues({
                      sectionId: "behavioural-p",
                      id: data.behavioural[0].p[1].id,
                      text: data.behavioural[0].p[1].text,
                      a: data.behavioural[0].p[1].a,
                    });
                  }}
                />
              ) : (
                ""
              )}
            </p>
            <p>{data.behavioural[0].p2}</p>
            <ul>
              {data.behavioural[0].ul2.map((el: any) => (
                <>
                  <li>
                    <em>
                      {el.em} -<span>&nbsp;</span>
                    </em>
                    <a rel="noreferrer noopener" href={el.li} target="_blank">
                      {el.li}
                    </a>
                  </li>
                  {user.data ? (
                    <AiFillEdit
                      className="cursor-pointer mt-2 m-auto  	 font-semibold outline-none  	duration-300 transition-all w-fit px-2 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                      color="white"
                      size={25}
                      onClick={() => {
                        setIsOpen(true);
                        setFormValues({
                          sectionId: "behavioural-ul2",
                          id: el.id,
                          em: el.em,
                          li: el.li,
                        });
                      }}
                    />
                  ) : (
                    ""
                  )}
                </>
              ))}
            </ul>
            <p>
              {data.behavioural[0].p[2].text}
              <span>&nbsp;</span>
              <a
                rel="noreferrer noopener"
                href={data.behavioural[0].p[2].a}
                target="_blank"
              >
                {data.behavioural[0].p[2].a}{" "}
              </a>
              {user.data ? (
                <AiFillEdit
                  className="cursor-pointer mt-2 m-auto  	 font-semibold outline-none  	duration-300 transition-all w-fit px-2 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                  color="white"
                  size={25}
                  onClick={() => {
                    setIsOpen(true);
                    setFormValues({
                      sectionId: "behavioural-p",
                      id: data.behavioural[0].p[2].id,
                      text: data.behavioural[0].p[2].text,
                      a: data.behavioural[0].p[2].a,
                    });
                  }}
                />
              ) : (
                ""
              )}
            </p>
            <h2>{data.personal[0].h2}</h2>
            <p>{data.personal[0].p}</p>
            <p>&nbsp;</p>
            {user.data ? (
              <AiFillEdit
                className="cursor-pointer mt-2 m-auto	 font-semibold outline-none  	duration-300 transition-all w-fit px-8 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                color="white"
                size={25}
                onClick={() => {
                  setIsOpen(true);
                  setEditSection("personal");
                }}
              />
            ) : (
              ""
            )}
            <h3>{data.lawfulBasis[0].h3}</h3>
            <p>{data.lawfulBasis[0].p}</p>
            {user.data ? (
              <AiFillEdit
                className="cursor-pointer mt-2 m-auto	 font-semibold outline-none  	duration-300 transition-all w-fit px-8 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                color="white"
                size={25}
                onClick={() => {
                  setIsOpen(true);
                  setEditSection("lawful");
                  setFormValues({
                    sectionId: "lawful",
                    id: data.lawfulBasis[0].id,
                    h3: data.lawfulBasis[0].h3,
                    p: data.lawfulBasis[0].p,
                  });
                }}
              />
            ) : (
              ""
            )}
            <ul>
              {data.lawfulBasis[0].ul.map((el: any) => (
                <>
                  <li key={el.id}>{el.li}</li>
                  {user.data ? (
                    <AiFillEdit
                      className="cursor-pointer mt-2 m-auto  	 font-semibold outline-none  	duration-300 transition-all w-fit px-2 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                      color="white"
                      size={25}
                      onClick={() => {
                        setIsOpen(true);
                        setFormValues({
                          sectionId: "lawfulBasis-ul",
                          id: el.id,
                          li: el.li,
                        });
                      }}
                    />
                  ) : (
                    ""
                  )}
                </>
              ))}
            </ul>

            <h3>{data.retention[0].h3}</h3>
            <p>{data.retention[0].p}</p>
            {user.data ? (
              <AiFillEdit
                className="cursor-pointer mt-2 m-auto	 font-semibold outline-none  	duration-300 transition-all w-fit px-8 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                color="white"
                size={25}
                onClick={() => {
                  setIsOpen(true);
                  setEditSection("retention");
                }}
              />
            ) : (
              ""
            )}
            <h3>{data.automatic[0].h3}</h3>
            {data.automatic[0].p.map((el: any) => (
              <>
                <p key={el.id}>{el.text}</p>
                {user.data ? (
                  <AiFillEdit
                    className="cursor-pointer mt-2 m-auto  	 font-semibold outline-none  	duration-300 transition-all w-fit px-2 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                    color="white"
                    size={25}
                    onClick={() => {
                      setIsOpen(true);
                      setFormValues({
                        sectionId: "automatic-p",
                        id: el.id,
                        text: el.text,
                      });
                    }}
                  />
                ) : (
                  ""
                )}
              </>
            ))}
            <ul>
              {data.automatic[0].ul.map((el: any) => (
                <>
                  <li key={el.id}>{el.text}</li>
                  {user.data ? (
                    <AiFillEdit
                      className="cursor-pointer mt-2 m-auto  	 font-semibold outline-none  	duration-300 transition-all w-fit px-2 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                      color="white"
                      size={25}
                      onClick={() => {
                        setIsOpen(true);
                        setFormValues({
                          sectionId: "automatic-ul",
                          id: el.id,
                          text: el.text,
                        });
                      }}
                    />
                  ) : (
                    ""
                  )}
                </>
              ))}
            </ul>
            <h2>{data.yourRights[0].h2}</h2>
            <h3>{data.yourRights[0].h3}</h3>
            {data.yourRights[0].p.map((el: any) => (
              <>
                <p>
                  {el.text}
                  <span>&nbsp;</span>
                  {el.em ? <em>[{el.em}].</em> : ""}
                  {el.a ? (
                    <a rel="noreferrer noopener" href={el.a} target="_blank">
                      {el.a}
                    </a>
                  ) : (
                    ""
                  )}
                </p>
                {user.data ? (
                  <AiFillEdit
                    className="cursor-pointer mt-2 m-auto  	 font-semibold outline-none  	duration-300 transition-all w-fit px-2 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                    color="white"
                    size={25}
                    onClick={() => {
                      setIsOpen(true);
                      setFormValues({
                        sectionId: "yourrights-p",
                        id: el.id,
                        text: el.text,
                        em: el.em,
                        a: el.a,
                      });
                    }}
                  />
                ) : (
                  ""
                )}
              </>
            ))}
            <p>
              <br />
            </p>
            <h3>{data.ccpa[0].h3}</h3>
            {data.ccpa[0].p.map((el: any) => (
              <>
                <p key={el.id}>{el.text}</p>
                {user.data ? (
                  <AiFillEdit
                    className="cursor-pointer mt-2 m-auto	 font-semibold outline-none  	duration-300 transition-all w-fit px-8 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                    color="white"
                    size={25}
                    onClick={() => {
                      setIsOpen(true);
                      setFormValues({
                        sectionId: "ccpa-p",
                        id: el.id,
                        text: el.text,
                      });
                    }}
                  />
                ) : (
                  ""
                )}
              </>
            ))}
            <h2>{data.cookies[0].h2}</h2>
            {data.cookies[0].p.map((el: any) => (
              <>
                <p key={el.id}>{el.text}</p>
                {user.data ? (
                  <AiFillEdit
                    className="cursor-pointer mt-2 m-auto	 font-semibold outline-none  	duration-300 transition-all w-fit px-8 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                    color="white"
                    size={25}
                    onClick={() => {
                      setIsOpen(true);
                      setFormValues({
                        sectionId: "cookies-p",
                        id: el.id,
                        text: el.text,
                      });
                    }}
                  />
                ) : (
                  ""
                )}
              </>
            ))}
            <h3>{data.necessary[0].h3}</h3>
            <table>
              <thead>
                <tr>
                  <th>
                    <strong>{data.necessary[0].table[0].strong}</strong>
                  </th>
                  <th>
                    <strong>{data.necessary[0].table[0].strong2}</strong>
                  </th>
                  {user.data ? (
                    <th>
                      <AiFillEdit
                        className="cursor-pointer mt-2 m-auto	 font-semibold outline-none  	duration-300 transition-all w-fit px-2 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                        color="white"
                        size={25}
                        onClick={() => {
                          setIsOpen(true);
                          setFormValues({
                            sectionId: "necessary-th",
                            id: data.necessary[0].table[0].id,
                            strong: data.necessary[0].table[0].strong,
                            strong2: data.necessary[0].table[0].strong2,
                          });
                        }}
                      />
                    </th>
                  ) : (
                    ""
                  )}
                </tr>
              </thead>

              <tbody>
                {data.necessary[0].table
                  .filter((el: { id: number }) => el.id !== 1)
                  .map((el: any) => (
                    <tr>
                      <td>
                        <em>{el.em}</em>
                      </td>
                      <td>{el.td}</td>
                      {user.data ? (
                        <td>
                          <AiFillEdit
                            className="cursor-pointer mt-2 m-auto	 font-semibold outline-none  	duration-300 transition-all w-fit px-2 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                            color="white"
                            size={25}
                            onClick={() => {
                              setIsOpen(true);
                              setFormValues({
                                sectionId: "necessary-tr",
                                id: el.id,
                                em: el.em,
                                td: el.td,
                              });
                            }}
                          />
                        </td>
                      ) : (
                        ""
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
            <h3>{data.analytics[0].h3}</h3>
            <table>
              <tbody>
                <tr>
                  <th>
                    <strong>{data.analytics[0].table[0].strong}</strong>
                  </th>
                  <th>
                    <strong>{data.analytics[0].table[0].strong2}</strong>
                  </th>
                  {user.data ? (
                    <th>
                      <AiFillEdit
                        className="cursor-pointer mt-2 m-auto	 font-semibold outline-none  	duration-300 transition-all w-fit px-2 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                        color="white"
                        size={25}
                        onClick={() => {
                          setIsOpen(true);
                          setFormValues({
                            sectionId: "analytics-th",
                            id: data.analytics[0].table[0].id,
                            strong: data.analytics[0].table[0].strong,
                            strong2: data.analytics[0].table[0].strong2,
                          });
                        }}
                      />
                    </th>
                  ) : (
                    ""
                  )}
                </tr>
                {data.analytics[0].table
                  .filter((el: { id: number }) => el.id !== 1)
                  .map((el: any) => (
                    <tr>
                      <td>
                        <em>{el.em}</em>
                      </td>
                      <td>{el.td}</td>
                      {user.data ? (
                        <td>
                          <AiFillEdit
                            className="cursor-pointer mt-2 m-auto	 font-semibold outline-none  	duration-300 transition-all w-fit px-2 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                            color="white"
                            size={25}
                            onClick={() => {
                              setIsOpen(true);
                              setFormValues({
                                sectionId: "analytics-tr",
                                id: el.id,
                                em: el.em,
                                td: el.td,
                              });
                            }}
                          />
                        </td>
                      ) : (
                        ""
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
            <p>
              <em>[{data.analytics[0].em}]</em>
            </p>
            {data.analytics[0].p.map((el: any) => (
              <p>
                {el.p}
                <span>&nbsp;</span>
                {el.a ? (
                  <a rel="noreferrer noopener" href={el.a} target="_blank">
                    www.allaboutcookies.org
                  </a>
                ) : (
                  ""
                )}
                {user.data ? (
                  <AiFillEdit
                    className="cursor-pointer mt-2 m-auto	 font-semibold outline-none  	duration-300 transition-all w-fit px-2 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                    color="white"
                    size={25}
                    onClick={() => {
                      setIsOpen(true);
                      setFormValues({
                        sectionId: "analytics-p",
                        id: el.id,
                        text: el.p,
                        a: el.a,
                      });
                    }}
                  />
                ) : (
                  ""
                )}
              </p>
            ))}
            <h3>{data.doNotTrack[0].h3}</h3>
            <p>{data.doNotTrack[0].p}</p>
            {user.data ? (
              <AiFillEdit
                className="cursor-pointer mt-2 m-auto	 font-semibold outline-none  	duration-300 transition-all w-fit px-8 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                color="white"
                size={25}
                onClick={() => {
                  setIsOpen(true);
                  setFormValues({
                    sectionId: "do-not-track",
                    id: data.doNotTrack[0].id,
                    h3: data.doNotTrack[0].h3,
                    p: data.doNotTrack[0].p,
                  });
                }}
              />
            ) : (
              ""
            )}
            <h2>{data.changes[0].h2}</h2>
            <p>{data.changes[0].p}</p>
            {user.data ? (
              <AiFillEdit
                className="cursor-pointer mt-2 m-auto	 font-semibold outline-none  	duration-300 transition-all w-fit px-8 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                color="white"
                size={25}
                onClick={() => {
                  setIsOpen(true);
                  setFormValues({
                    sectionId: "changes",
                    id: data.changes[0].id,
                    h2: data.changes[0].h2,
                    p: data.changes[0].p,
                  });
                }}
              />
            ) : (
              ""
            )}
            <h2>{data.contact[0].h2}</h2>
            {data.contact[0].p.map((el: any) => (
              <>
                <p key={el.id}>{el.text}</p>
                {user.data ? (
                  <AiFillEdit
                    className="cursor-pointer mt-2 m-auto	 font-semibold outline-none  	duration-300 transition-all w-fit px-2 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                    color="white"
                    size={25}
                    onClick={() => {
                      setIsOpen(true);
                      setFormValues({
                        sectionId: "contact-p",
                        id: el.id,
                        text: el.text,
                      });
                    }}
                  />
                ) : (
                  ""
                )}
              </>
            ))}
            <em>{data.contact[0].em}</em>
            {user.data ? (
              <AiFillEdit
                className="cursor-pointer mt-2 m-auto	 font-semibold outline-none  	duration-300 transition-all w-fit px-2 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                color="white"
                size={25}
                onClick={() => {
                  setIsOpen(true);
                  setFormValues({
                    sectionId: "contact-em",
                    id: data.contact[0].id,
                    em: data.contact[0].em,
                  });
                }}
              />
            ) : (
              ""
            )}
            <span></span>
            {data.contact[0].p2.map((el: any) => (
              <>
                <p>
                  {el.text}
                  <span>&nbsp;</span>
                  <em>[{el.em}</em>
                  <span>&nbsp;</span>
                  <a rel="noreferrer noopener" href={el.a} target="_blank">
                    {el.a}
                  </a>
                  <em>]</em>
                </p>
                {user.data ? (
                  <AiFillEdit
                    className="cursor-pointer mt-2 m-auto	 font-semibold outline-none  	duration-300 transition-all w-fit px-2 py-[0.25rem] rounded-3xl text-white bg-secondary-1 hover:bg-purple-800 focus:ring focus:ring-bg-secondary-1 capitalize"
                    color="white"
                    size={25}
                    onClick={() => {
                      setIsOpen(true);
                      setFormValues({
                        sectionId: "contact-p2",
                        id: el.id,
                        text: el.text,
                        em: el.em,
                        a: el.a,
                      });
                    }}
                  />
                ) : (
                  ""
                )}
              </>
            ))}
          </>
        ) : (
          ""
        )}
      </Wrapper>
    </>
  );
};

export default PrivatePoliciesScreen;
