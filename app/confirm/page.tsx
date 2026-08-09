import {ConfirmPage} from "@/app/confirm/_components/ConfirmPage";
import type {Metadata} from "next";
import {notFound} from "next/navigation";

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
};

type Props = { searchParams: Promise<{ [key: string]: string | undefined }> };
export default async function Page({searchParams}: Props) {
    const {id, email} = await searchParams

    if (!id || !email) {
        notFound()
    }

    return <ConfirmPage/>
}

