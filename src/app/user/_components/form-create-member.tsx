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



export type CreateFormProps = React.ComponentProps<"form"> & { onOpenChange: React.Dispatch<React.SetStateAction<boolean>> }

export const CreateForm = ({ onOpenChange }: CreateFormProps) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const form = useForm<CreateUser>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            birthday: new Date(),
            gender: GenderEnum.MALE,
        },
    });
    const { formState: { isSubmitting } } = form;

    const [createData] = useCreateUserMutation();

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        try {

            await createData(values).unwrap();
            onOpenChange(val => !val);
        } catch (error) {
            const errorMessage = getErroMessage(error);
            toast.error(JSON.stringify(errorMessage));
            return [];
        }
    };

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
