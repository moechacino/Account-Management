import {cn} from "@/utils/cn";

export default function FunnellFill({className, height="16", width="16", fill="currentColor"}: { className?: string, height?:string, width?:string, fill? : string }){
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill={fill}
             className={cn("bi bi-funnel-fill", className)} viewBox="0 0 16 16">
            <path
                d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5z"/>
        </svg>
    )
}
