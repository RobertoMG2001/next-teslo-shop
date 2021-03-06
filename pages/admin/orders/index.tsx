import React from 'react';
import useSWR from 'swr';
import { ConfirmationNumberOutlined } from '@mui/icons-material';
import { Chip, Grid } from '@mui/material';
import {DataGrid, GridColDef, GridValueGetterParams} from '@mui/x-data-grid';
import { AdminLayout } from '../../../components/layouts';
import { IOrder, IUser } from '../../../interfaces';

const columns: GridColDef[] = [
    {field: 'id', headerName: 'Order ID', width: 250},
    {field: 'email', headerName: 'Email', width: 250},
    {field: 'name', headerName: 'Full Name', width: 250},
    {field: 'quantity', headerName: 'Products Quantity', width: 150, align: 'center'},
    {field: 'total', headerName: 'Total Amount', width: 150},
    {
        field: 'isPaid',
        headerName: 'Paid',
        renderCell: ({row}: GridValueGetterParams) => {
            return row.isPaid ? (
                <Chip variant='outlined' label='Paid' color='success' />
            ) : (
                <Chip variant='outlined' label='Pending' color='error' />
            )
        }
    },
    {field: 'createdAt', headerName: 'Order Date', width: 250},
    {
        field: 'check',
        headerName: 'Actions',
        renderCell: ({row}: GridValueGetterParams) => {
            return (
                <a href={`/admin/orders/${row.id}`} target='_blank' rel="noreferrer">Check Order</a>
            )
        }
    }
]

const OrdersPage = () => {
    const {data, error} = useSWR<IOrder[]>('/api/admin/orders');

    if (!data && !error) {
        return (<></>);
    }

    const rows = data!.map(order => ({
        id: order._id,
        email: (order.user as IUser).email,
        name: (order.user as IUser).name,
        quantity: order.numberOfItems,
        total: `$${order.total}`,
        isPaid: order.isPaid,
        createdAt: order.createdAt
    }));

    return (
        <AdminLayout
            title='Orders'
            subtitle='Manage orders'
            icon={<ConfirmationNumberOutlined />}
        >
            <Grid container className='fadeIn'>
                <Grid item xs={12} sx={{height: 650, width: '100%'}}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                    />
                </Grid>
            </Grid>
        </AdminLayout>
    );
};

export default OrdersPage;