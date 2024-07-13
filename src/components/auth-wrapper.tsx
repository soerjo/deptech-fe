"use client";

import { useDispatch } from "react-redux";
import { AUTH_PAYLOAD, AUTH_TOKEN, getAuthCookie } from "@/lib/cookies";
import { useEffect, useState } from "react";
import { logout, setInitialState } from "@/store/slice/auth";
import { usePathname, useRouter } from "next/navigation";
import LodingPage from "./loading";

type Props = { children?: React.ReactNode };

const skipValidationPathName = ["/auth/login"];

export const AuthWrapper = ({ children }: Props) => {
    const [isTokenExist, setIsTokenExist] = useState<string | undefined>();
    const dispatch = useDispatch();
    const { push } = useRouter();
    const pathname = usePathname();

    const token = getAuthCookie(AUTH_TOKEN);
    const payload = getAuthCookie(AUTH_PAYLOAD);

    useEffect(() => {
        if (!token) {
            dispatch(logout());
            push("/auth/login");
        } else if (payload) {
            setIsTokenExist("on_development")
            dispatch(setInitialState());
        }
    }, [token, push, dispatch]);

    useEffect(() => { }, []);

    if (skipValidationPathName.includes(pathname)) return children;

    return <> {isTokenExist ? children : <LodingPage />} </>;
};
