export { cn } from "cn"
import {format, parseISO} from "date-fns";


export function formatPrice(amount, currency = "INR"){
    const value = Number(amount);
    if (!value) return "Free"           // It is including 0 also if you remember

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currency,
        maximumFractionDigits : 0
    }).format(value)
}

export function formatEventDate(dateInput){
    // data will come in form of Strings
    const date = typeof dateInput === "string" ? parseISO(dateInput) : dateInput

    return format(date, "E, LLL dd,yyyy")
}