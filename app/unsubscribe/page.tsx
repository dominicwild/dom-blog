import NotFound from "@/app/not-found";
import {UnsubscribePage} from "@/app/unsubscribe/_components/UnsubscribePage";

type Props = { searchParams: { [key: string]: string | undefined } };
export default function Page({searchParams}: Props) {
    const id = searchParams.id;
    const email = searchParams.email;

    if (!id || !email) {
        return <NotFound/>
    }

    return <UnsubscribePage/>
}

