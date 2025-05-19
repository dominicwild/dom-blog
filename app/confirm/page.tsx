import {ConfirmPage} from "@/app/confirm/_components/ConfirmPage";
import NotFound from "@/app/not-found";

type Props = { searchParams: Promise<{ [key: string]: string | undefined }> };
export default async function Page({searchParams}: Props) {
    const {id, email} = await searchParams

    if (!id || !email) {
        return <NotFound/>
    }

    return <ConfirmPage/>
}

