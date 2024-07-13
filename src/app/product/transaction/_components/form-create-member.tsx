import { useMediaQuery } from "@/hooks/use-media-query";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import React from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getErroMessage } from "@/lib/rtk-error-validation";
import { useCreateUserMutation, } from "@/store/services/user";
import { CreateUser } from "@/interfaces/userResponse";
import AsyncSelect from "@/components/react-select";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AUTH_PAYLOAD, getAuthCookie } from "@/lib/cookies";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { GenderEnum } from "@/enum/gender.enum";
import { CalendarComponent } from "@/components/ui/date-picker";
import { CreateTransaction } from "@/interfaces/transaction";
import { TransactionEnum } from "@/enum/transaction.enum";
import { useCreateMutation } from "@/store/services/transaction";
import { useLazyGetAllQuery } from "@/store/services/product";
import debounce from "lodash.debounce";

const FormSchema = z.object({
    name: z.string().min(1, { message: "required" }).max(125),
    transaction_type: z.enum([TransactionEnum.IN, TransactionEnum.OUT]),
    quantity: z.number().min(1),
    product: z.object({
        label: z.string(),
        value: z.number()
    })
});

export type CreateFormProps = React.ComponentProps<"form"> & { onOpenChange: React.Dispatch<React.SetStateAction<boolean>> }

export const CreateForm = ({ onOpenChange }: CreateFormProps) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const form = useForm<Omit<CreateTransaction, 'productId'> & { product: { label: string, value: number } }>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            transaction_type: TransactionEnum.IN,
            quantity: 0,
            product: {
                label: "",
                value: 0
            }
        },
    });
    const { formState: { isSubmitting, errors }, } = form;

    const [createData] = useCreateMutation();

    const onSubmit = async ({ product, ...values }: z.infer<typeof FormSchema>) => {
        try {


            await createData({
                ...values,
                productId: product.value
            }).unwrap();
            onOpenChange(val => !val);
        } catch (error) {
            const errorMessage = getErroMessage(error);
            toast.error(JSON.stringify(errorMessage));
            return [];
        }
    };

    const [lazy] = useLazyGetAllQuery();
    const _loadSuggestions = async (query: string, callback: (...arg: any) => any) => {
        try {
            const res = await lazy({ take: 100, page: 1, search: query }).unwrap();
            const resp = res.data.map(data => ({ label: data.name, value: data.id }))
            return callback(resp)
        } catch (error) {
            return []
        }
    };
    const loadOptions = debounce(_loadSuggestions, 300);
    console.log({ errors })
    return (
        <div
            className={`flex flex-col justify-center items-center gap-4 h-full ${isDesktop ? "" : "h-[70vh]"}`}
        >
            <div className="flex flex-col w-full h-1/6 gap-3 justify-center items-center">
                <h2 className="text-xl font-semibold tracking-tight md:text-xl">
                    Input New User
                </h2>
            </div>
            <div className={`w-full h-5/6 flex flex-col gap-4  ${isDesktop ? "px-0" : "px-2"}`} >

                <Form
                    {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex h-full"
                    >
                        <ScrollArea>
                            <div className="flex flex-col gap-4">

                                <FormField
                                    control={form.control}
                                    name="transaction_type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="transaction_type">{"Transaction Type".replaceAll("_", " ")}</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a verified email to display" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value={TransactionEnum.IN}>Masuk</SelectItem>
                                                    <SelectItem value={TransactionEnum.OUT}>Keluar</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={"name"}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">
                                                {"name".replaceAll("_", " ")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    id={"name"}
                                                    placeholder={"name"}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={"quantity"}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">
                                                {"quantity".replaceAll("_", " ")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    id={"quantity"}
                                                    placeholder={"quantity"}
                                                    {...field}
                                                    onChange={(event) => field.onChange(Number(event.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="product"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">{"product".replaceAll("_", " ")}</FormLabel>
                                            <FormControl>
                                                <AsyncSelect
                                                    id="product"
                                                    cacheOptions
                                                    defaultOptions
                                                    loadOptions={loadOptions}
                                                    onChange={(e: any) => field.onChange(e)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>


                        </ScrollArea>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex left-2 right-2 bottom-4 fixed gap-2 ${isDesktop && "absolute"}`}
                        >
                            Save changes
                        </Button>
                    </form>
                </Form>
            </div>

        </div>
    );
};
