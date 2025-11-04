import { ReactNode } from "react";

const MaxWidthWrapper = ({
    children,
}: {
    children: ReactNode
}) => {
    return (
        <div className="mx-auto w-full md:max-w-screen-xl max-w-screen-lg px-2.5 md:px-2.0 h-full">
            {children}
        </div>
    )
}

export default MaxWidthWrapper