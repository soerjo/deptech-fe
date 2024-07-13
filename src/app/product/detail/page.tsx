'use client'

import CustomSearchInput from '@/components/search';
import { Button } from '@/components/custom/button';
import { DownloadIcon, PlusIcon } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { MyDrawer } from '@/components/my-drawer';
import MyBreadcrum from '@/components/my-breadcrum';
import { DataTable } from './_components/table';
import { CreateForm } from './_components/form-create';
import { CreateFormCategory } from './_components/form-create-category';

export default function Dashboard() {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex flex-col '>
                <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
                    Product
                </h1>
                <MyBreadcrum currentPath='list' />

            </div>

            <div className='flex md:flex-row flex-col-reverse gap-4 w-full justify-center items-center'>
                <CustomSearchInput />
                <div className='flex flex-row gap-4 w-full justify-end'>
                    <MyDrawer DrawerForm={CreateForm}>
                        <Button variant="outline" size="sm" className="flex gap-2 h-9">
                            <PlusIcon className="size-4" aria-hidden="true" />
                            {"New Product"}
                        </Button>
                    </MyDrawer>
                    <MyDrawer DrawerForm={CreateFormCategory}>
                        <Button variant="outline" size="sm" className="flex gap-2 h-9">
                            <PlusIcon className="size-4" aria-hidden="true" />
                            {"New Category"}
                        </Button>
                    </MyDrawer>

                </div>
            </div>

            <DataTable />

        </div>
    )
}