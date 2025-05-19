import {ConfirmPage} from "@/app/confirm/_components/ConfirmPage";
import NotFound from "@/app/not-found";

type Props = { searchParams: { [key: string]: string | undefined } };
export default function Page({searchParams}: Props) {
    const id = searchParams.id;
    const email = searchParams.email;

    if (!id || !email) {
        return <NotFound/>
    }

    return <ConfirmPage/>
}

