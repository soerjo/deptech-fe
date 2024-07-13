"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AUTH_TOKEN, getAuthCookie } from "@/lib/cookies";
import { UserAuthForm } from "./_components/user-auth-form";

export default function SignIn() {
    const { push } = useRouter();
    const token = getAuthCookie(AUTH_TOKEN);

    useEffect(() => {
        if (token) push("/");
    }, [token, push]);

    return (
        <div className="container relative grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                <div className={`absolute inset-0 bg-zinc-800`} />
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-left">
                        <h1 className="text-2xl font-semibold tracking-tight mb-4">
                            Login
                        </h1>
                    </div>
                    <UserAuthForm />
                </div>
            </div>
        </div>
    );
}
