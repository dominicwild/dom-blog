import React, {ReactElement, ReactNode} from "react";
import Link, {LinkProps} from "next/link";

export const UnderlineLink = (props: { children: ReactNode, className: string } & LinkProps) => {
    const {children, className, ...otherProps} = props;
    return (
        <div
            className={`${className} relative inline-block after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full`}>
            <Link {...otherProps}>
                {children}
            </Link>
        </div>
    )
}