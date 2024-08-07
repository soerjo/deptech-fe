'use client'

import CustomSearchInput from '@/components/search';
import { Button } from '@/components/custom/button';
import { DownloadIcon, PlusIcon } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { MyDrawer } from '@/components/my-drawer';
import MyBreadcrum from '@/components/my-breadcrum';
import { DataTable } from './_components/table';
import { CreateForm } from './_components/form-create-member';

export default function Dashboard() {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex flex-col '>
                <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
                    User
                </h1>
                <MyBreadcrum currentPath='list' />
            </div>

            <div className="flex items-center gap-2 justify-end">
                <MyDrawer DrawerForm={CreateForm}>
                    <Button variant="outline" size="sm" className="flex gap-2">
                        <PlusIcon className="size-4" aria-hidden="true" />
                        {isDesktop && "New User"}
                    </Button>
                </MyDrawer>


                <Button variant="outline" size="sm" className="flex gap-2">
                    <DownloadIcon className="size-4" aria-hidden="true" />
                    {isDesktop && "Export"}
                </Button>
            </div>
            <div className='flex md:flex-row flex-col gap-4 md:w-1/3'>
                <CustomSearchInput />
            </div>

            <DataTable />

        </div>
    )
}