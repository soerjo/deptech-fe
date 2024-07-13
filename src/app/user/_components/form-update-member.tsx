import React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/custom/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getErroMessage } from "@/lib/rtk-error-validation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "react-toastify";
import { useLazyGetUserByIdQuery, useUpdateUserMutation } from "@/store/services/user";
import { GenderEnum } from "@/enum/gender.enum";
import { UpdateUser } from "@/interfaces/userResponse";
import { CalendarComponent } from "@/components/ui/date-picker";

const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const FormSchema = z.object({
    first_name: z.string().min(1, { message: "required" }).max(25),
    last_name: z.string().min(1, { message: "required" }).max(25),
    email: z.string().email().min(1, { message: "required" }).max(25),
    birthday: z.coerce.date(),
    gender: z.enum([GenderEnum.MALE, GenderEnum.FEMALE])
});

export type UpdateFormInputProps = React.ComponentProps<"form"> & {
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>, idUser: number
};

export const UpdateFormInput = ({ onOpenChange, idUser }: UpdateFormInputProps) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const [updateData] = useUpdateUserMutation();
    const [detailData] = useLazyGetUserByIdQuery()

    const form = useForm<UpdateUser>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            birthday: new Date(),
            gender: GenderEnum.MALE
        },
    });
    const { formState: { isDirty, isSubmitting }, reset } = form;
    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        try {
            await updateData({ id: idUser, ...values }).unwrap();
            onOpenChange(val => !val);
        } catch (error) {
            const errorMessage = getErroMessage(error);
            toast.error(JSON.stringify(errorMessage));
        }
    };

    const fetchDetailUser = async () => {
        const response = await detailData({ id: idUser }).unwrap()
        const detailUser = response.data
        reset({
            first_name: detailUser.first_name,
            last_name: detailUser.last_name,
            email: detailUser.email,
            birthday: new Date(detailUser.birthday),
            gender: detailUser.gender
        })
    }

    React.useEffect(() => {
        fetchDetailUser()
    }, [])

    return (
        <div
            className={`flex flex-col justify-center items-center gap-4 h-full ${isDesktop ? "" : "h-[70vh]"
                }`}
        >
            <div className="flex flex-col w-full h-1/6 gap-3 justify-center items-center">
                <h2 className="text-xl font-semibold tracking-tight md:text-xl">
                    Detail/Update User
                </h2>
            </div>
            <div
                className={`w-full h-5/6 flex flex-col gap-4  ${isDesktop ? "px-0" : "px-2"
                    }`}
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full">
                        <ScrollArea>
                            <div className="flex flex-col gap-4">
                                <FormField
                                    control={form.control}
                                    name={"first_name"}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">
                                                {"first_name".replaceAll("_", " ")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    id={"first_name"}
                                                    placeholder={"first_name"}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={"last_name"}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">
                                                {"last_name".replaceAll("_", " ")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    id={"last_name"}
                                                    placeholder={"last_name"}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />


                                <FormField
                                    control={form.control}
                                    name={"email"}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">
                                                {"email".replaceAll("_", " ")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    id={"email"}
                                                    placeholder={"email"}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={"birthday"}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className="capitalize">{"birthday".replaceAll("_", " ")}</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')} variant="outline">
                                                            {field.value ? format(field.value, 'dd/MM/yyyy') : <span>Pick a date</span>}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent align="start" className="w-auto p-2">
                                                    <CalendarComponent initialFocus mode="single" selected={field.value ?? undefined} translate="en" onSelect={field.onChange} />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="gender"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="gender">{"birthday".replaceAll("_", " ")}</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a verified email to display" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value={GenderEnum.MALE}>laki-laki</SelectItem>
                                                    <SelectItem value={GenderEnum.FEMALE}>perempuan</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </ScrollArea>

                        {isDirty && (
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className={`flex left-2 right-2 bottom-4 fixed gap-2 ${isDesktop && "absolute"
                                    }`}
                                loading={isSubmitting}
                            >
                                Save changes
                            </Button>
                        )}
                    </form>
                </Form>
            </div>
        </div>
    );
};
