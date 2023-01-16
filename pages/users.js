import React, { useMemo, useState } from 'react';
import MaterialReactTable from 'material-react-table';
import { IconButton, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from "axios";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import {getSession, useSession} from 'next-auth/react'

// const getToken = async() => {
//   const session = await getSession()
//   return session?.user?.token
// }
// const token = await getToken()

const Users = () => {
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const getUser = useSession()
  const user = getUser?.data?.user
  // const {data: {user}} = useSession()

  console.log(user, 'tokennnnnn')

  const { data, isError, isFetching, isLoading, refetch } = useQuery(
    [
      'table-data',
      columnFilters,
      globalFilter,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
    ],
    // async () => {
    //   // const url = new URL(
    //   //   'localhost:3001/api/admin/console/users',
    //   //   process.env.NODE_ENV === 'production'
    //   //     ? 'https://www.material-react-table.com'
    //   //     : 'http://localhost:30001',
    //   // );
    //   const url = new URL('localhost:3001/api/admin/console/users');
    //   url.searchParams.set(
    //     'start',
    //     `${pagination.pageIndex * pagination.pageSize}`,
    //   );
    //   url.searchParams.set('size', `${pagination.pageSize}`);
    //   url.searchParams.set('filters', JSON.stringify(columnFilters ?? []));
    //   url.searchParams.set('globalFilter', globalFilter ?? '');
    //   url.searchParams.set('sorting', JSON.stringify(sorting ?? []));

    //   const response = await fetch(url.href);
    //   const json = await response.json();
    //   return json;

    // },
    async () => {
      const { data } = await axios.get(
        `http://localhost:3001/api/admin/console/users`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );

      return data;
    },
    {
      onError: (err) => {
       console.log(err, 'err fetching users')
      },
    },
    { keepPreviousData: true },
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: 'fullname',
        header: 'Full Name',
      },
      {
        accessorKey: 'gender',
        header: 'Gender',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'status',
        header: 'Status',
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
      },
    ],
    [],
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={data?.data ?? []} //data is undefined on first render
      initialState={{ showColumnFilters: true }}
      manualFiltering
      manualPagination
      manualSorting
      muiToolbarAlertBannerProps={
        isError
          ? {
              color: 'error',
              children: 'Error loading data',
            }
          : undefined
      }
      onColumnFiltersChange={setColumnFilters}
      onGlobalFilterChange={setGlobalFilter}
      onPaginationChange={setPagination}
      onSortingChange={setSorting}
      renderTopToolbarCustomActions={() => (
        <Tooltip arrow title="Refresh Data">
          <IconButton onClick={() => refetch()}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      )}
      rowCount={data?.meta?.totalRowCount ?? 0}
      state={{
        columnFilters,
        globalFilter,
        isLoading,
        pagination,
        showAlertBanner: isError,
        showProgressBars: isFetching,
        sorting,
      }}
    />
  );
};

Users.auth = true
export default Users;


// function Users() {
//   return (
//     <h1>Users coming soon...</h1>
//   )
// }