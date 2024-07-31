import {cn} from "@/utils/cn";

export default function PlusSquare({className, height="16", width="16", fill="currentColor"}: { className?: string, height?:string, width?:string, fill? : string }){
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill={fill}
             className={cn("bi bi-plus-square-fill", className)} viewBox="0 0 16 16">
            <path
                d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0"/>
        </svg>
    )
}
