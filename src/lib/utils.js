export { cn } from "cn"
import {format, formatDistanceToNow, parseISO} from "date-fns";


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
    if (!dateInput){
        return
    }
    // data will come in form of Strings
    const date = typeof dateInput === "string" ? parseISO(dateInput) : dateInput

    return format(date, "E, LLL dd,yyyy")
}


// We have in Backend StartDate and EndDate in which Time is also included
export function formatEventTimeRange(startDate, endDate){
    if (!startDate || !endDate){                // Safe Check
        return
    }

    const start = parseISO(startDate)
    const startTime = format(start, "hh:mm a")

    const end = parseISO(endDate)
    const endTime = format(end, "hh:mm a")
    return `${startTime} - ${endTime}`
}

export function getDaysRemaining(startDate){
    if (!startDate){
        return
    }
    const eventDate = parseISO(startDate);
    
    const currentDate = new Date();    
    if (currentDate > eventDate) {
        return "Ended"
    } 

    return formatDistanceToNow(eventDate, {addSuffix:true})
}