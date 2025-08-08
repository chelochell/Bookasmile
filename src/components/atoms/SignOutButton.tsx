'use client'

import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
    const router = useRouter();

    const signOut = async () => {
        await authClient.signOut();
        router.push("/login");
    }

    return (
        <Button onClick={signOut}>Sign Out</Button>
    )
}