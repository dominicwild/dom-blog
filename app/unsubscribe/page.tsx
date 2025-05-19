import NotFound from "@/app/not-found";
import {UnsubscribePage} from "@/app/unsubscribe/_components/UnsubscribePage";

type Props = { searchParams: Promise<{ [key: string]: string | undefined }> };
export default async function Page({searchParams}: Props) {
    const {id, email} = await searchParams

    if (!id || !email) {
        return <NotFound/>
    }

    return <UnsubscribePage/>
}

