import { getCookie } from '@utils/common/storage/cookie/document';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react'
import { useTable, Column, useGlobalFilter, useSortBy, usePagination } from 'react-table';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import AlertDialogComponent from '@components/shared/common/Dialog/alertDialog';
import Button from '../Button';
import classes from '../../../../styles/table.module.scss'
import { useGetUserDataFromStore } from '@utils/core/hooks';
import axios from 'axios';

const Table = (props) => {
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });

    const { user: user } = useGetUserDataFromStore();


    useEffect(() => {
        const getAdminsList = async () => {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_KNOCK_URL_API}/admin/get-users`, {
                headers: {
                    "Authorization": JSON.parse(getCookie('user-access-token')).accessToken
                }
            })
            if (response.data.success) {
                props.setAdmins(response.data.admins)
            }
        }
        getAdminsList()
    }, [])


    useEffect(() => {
        function handleResize() {
            // Set window width/height to state
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        window.addEventListener("resize", handleResize);

        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);



    const data = useMemo(
        () => props.admins,
        [props.admins]
    )

    const columns = useMemo(
        () => [
            {
                Header: 'ID',
                accessor: 'id', // accessor is the "key" in the data
            },
            {
                Header: 'Last Name',
                accessor: 'lastName',
            },
            {
                Header: 'First Name',
                accessor: 'firstName',
            },
            {
                Header: 'Email',
                accessor: 'email',
            },
            {
                Header: 'Roles',
                accessor: 'roles',
            },
            {
                Header: 'Last Login',
                accessor: (data) => {
                    return <p >{moment(data?.lastLogin).format(windowSize.width < 1024 ? 'Do YYYY' : 'MMMM Do YYYY, h:mm:ss a')}</p>
                },
            },
            {
                Header: 'Created At',
                accessor: (data) => {
                    return <p >{moment(data?.createdAt).format(windowSize.width < 1024 ? 'Do YYYY' : 'MMMM Do YYYY')}</p>
                },
            },
            {
                Header: 'Controls',
                accessor: (data) => {

                    let adminEmail = ['support@pluginsthatknock.com' , 'mehdi.yanat3106@outlook.fr']
                    return <div className='flex justify-center gap-10' >
                        {adminEmail.includes(data.email)  || data.email === user.data.email  ? <p>No Actions</p> : <AlertDialogComponent setAdmins={props.setAdmins} adminId={data.id} >
                            <AiFillDelete size={20} className='cursor-pointer text-[red]' />
                        </AlertDialogComponent>}
                    </div>
                },
            },
        ],
        []
    )

    const tableInstance = useTable({ columns, data })


    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance


    return (
        <  >
            <div className='max-w-[1200px] py-6 flex justify-between' >
                <h3 className='text-4xl' >Admin List</h3>
                <Button onClick={() => props.setIsAddAdminOpen(true)} > Add admin </Button>
            </div>
            <props.AddAdminMutiation setAdmins={props.setAdmins} isOpen={props.isAddAdminOpen}
                setIsOpen={props.setIsAddAdminOpen} />
            <div className={classes.table + ' py-6 '}>
                <table className={' max-w-[1200px] w-full'} {...getTableProps()}>
                    <thead>
                        {// Loop over the header rows
                            headerGroups.map((headerGroup, index) => (
                                // Apply the header row props
                                <tr key={index} {...headerGroup.getHeaderGroupProps()}>
                                    {// Loop over the headers in each row
                                        headerGroup.headers.map((column, index) => (
                                            // Apply the header cell props
                                            <th className='border p-4' key={index} {...column.getHeaderProps()}>
                                                {// Render the header
                                                    column.render('Header')}
                                            </th>
                                        ))}
                                </tr>
                            ))}
                    </thead>
                    {/* Apply the table body props */}
                    <tbody {...getTableBodyProps()}>
                        {// Loop over the table rows
                            rows.map((row, index) => {
                                // Prepare the row for display
                                prepareRow(row)
                                return (
                                    // Apply the row props
                                    <tr key={index} {...row.getRowProps()}>
                                        {// Loop over the rows cells
                                            row.cells.map((cell, index) => {
                                                // Apply the cell props
                                                return (
                                                    <td className='border text-center p-4' key={index} {...cell.getCellProps()}>
                                                        {// Render the cell contents
                                                            cell.render('Cell')}
                                                    </td>
                                                )
                                            })}
                                    </tr>
                                )
                            })}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Table
