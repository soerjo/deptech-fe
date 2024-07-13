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
import { CreateUser } from "@/interfaces/userResponse";
import AsyncSelect from "@/components/react-select";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AUTH_PAYLOAD, getAuthCookie } from "@/lib/cookies";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { GenderEnum } from "@/enum/gender.enum";
import { CalendarComponent } from "@/components/ui/date-picker";
import { useCreateMutation } from "@/store/services/product";
import { useLazyGetAllQuery } from "@/store/services/category";
import debounce from "lodash.debounce";
import { CreateCategory } from "@/interfaces/category";
import { CreateProduct } from "@/interfaces/product";


const FormSchema = z.object({
    name: z.string().min(1, { message: "required" }).max(25),
    description: z.string().max(25).optional(),
    image_url: z.string().max(25).optional(),
    category: z.object({
        label: z.string(),
        value: z.string()
    })
});

export type CreateFormProps = React.ComponentProps<"form"> & { onOpenChange: React.Dispatch<React.SetStateAction<boolean>> }

export const CreateForm = ({ onOpenChange }: CreateFormProps) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const form = useForm<Omit<CreateProduct, 'category'> & { category: { label: string, value: string } }>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            description: "",
            image_url: "",
            category: { label: '', value: "" },
        },
    });
    const { formState: { isSubmitting } } = form;

    const [createData] = useCreateMutation();

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        try {

            await createData({
                name: values.name,
                category: values.category.value,
                description: values.description,
                image_url: values.image_url
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
            const resp = res.data.map(data => ({ label: data.code, value: data.code }))
            return callback(resp)
        } catch (error) {
            return []
        }
    };
    const loadOptions = debounce(_loadSuggestions, 300);

    return (
        <div
            className={`flex flex-col justify-center items-center gap-4 h-full ${isDesktop ? "" : "h-[70vh]"}`}
        >
            <div className="flex flex-col w-full h-1/6 gap-3 justify-center items-center">
                <h2 className="text-xl font-semibold tracking-tight md:text-xl">
                    Input New Product
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
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">{"category".replaceAll("_", " ")}</FormLabel>
                                            <FormControl>
                                                <AsyncSelect
                                                    id="category"
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


                                <FormField
                                    control={form.control}
                                    name={"description"}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">
                                                {"description".replaceAll("_", " ")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    id={"description"}
                                                    placeholder={"description"}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />


                                <FormField
                                    control={form.control}
                                    name={"image_url"}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">
                                                {"image_url".replaceAll("_", " ")}
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    id={"image_url"}
                                                    placeholder={"image_url"}
                                                    {...field}
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
