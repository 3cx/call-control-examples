import { Error } from "cc-component-lib";
import { createPortal } from "react-dom"

export const ErrorPortal: React.FC<{message?: string}> = ({message}) => {
    return createPortal(
        <Error message={message || "Unknown Error"} />,
        document.getElementById('error-portal')! 
    )
}