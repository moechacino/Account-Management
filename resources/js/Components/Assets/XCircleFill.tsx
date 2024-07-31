import {cn} from "@/utils/cn";

export default function XCircleFill({className, height="16", width="16", fill="currentColor", opacity="1"}: { className?: string, height?:string, width?:string, fill? : string, opacity? : string }){
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill={fill}
             opacity={opacity} className={cn("bi bi-x-circle-fill", className)} viewBox="0 0 16 16">
            <path
                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
        </svg>
    )
}
