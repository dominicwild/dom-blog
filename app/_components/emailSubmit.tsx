"use client"
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React, {useState} from "react";
import {submitEmail} from "@/server/dynamo";


export function EmailSubmit() {
    const [email, setEmail] = useState("")
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState("")
    const onClick = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return;

        setSubmitting(true);
        try {
            await submitEmail(email);
            setSubmitted(true);
        } catch (e) {
            setError((e as unknown as Error).message)
        } finally {
            setSubmitting(false);
        }
    };

    let errorElement = <></>

    if (error) {
        errorElement = <div className={"text-red-600 mt-2"}>
            {error}
        </div>
    }

    let submittedElement = <></>

    if (submitted) {
        submittedElement = <div className="text-center mt-2 text-green-400">
            submitted
        </div>
    }

    return (
        <>
            <form className={"mt-2 flex justify-between"} onSubmit={onClick}>
                <Input
                    type={"email"}
                    name={"email"}
                    placeholder={"Insert your email"}
                    className={""}
                    onChange={e => setEmail(e.target.value)}
                    value={email}
                />
                <Button className={"ml-4 cursor-pointer"} variant={"secondary"} type={"submit"}>
                    Submit
                </Button>
            </form>
            {errorElement}
            {submittedElement}
        </>
    );
}