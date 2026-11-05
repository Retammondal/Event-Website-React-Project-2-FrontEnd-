import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import React, { useEffect, useState } from 'react'
import { ArrowRight, Calendar, ChevronLeft, ChevronRight, MapPin, Sparkles } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { formatEventDate, formatPrice } from '@/lib/utils'


    // ==================================================================================================
    // 💡 Concept: The useEmblaCarousel Hook (emblaRef & emblaApi)
    // ==================================================================================================
    // emblaRef -> A React Ref that gives Embla access to the main wrapper Div where all slide Divs 
    //             are placed side-by-side. (Requires 'overflow-hidden' on that div to work!).
    // emblaApi -> An object containing methods (like scrollPrev, scrollNext). Because it is linked 
    //             to emblaRef, the API knows exactly which DOM element it is controlling.

    // ==================================================================================================
    // 💡 Concept: Adding Autoplay (Separate Plugin)
    // ==================================================================================================
    // To make it autoplay, install the package: npm install embla-carousel-autoplay
    // Pass it inside the 2nd argument of useEmblaCarousel (The Plugins Array). Each plugin takes 
    // its own specific property object, like { delay: 2000 }.

    // ==================================================================================================
    // FEATURE            | stopOnInteraction                                   | stopOnMouseEnter
    // ==================================================================================================
    // Trigger Action     | Clicking navigation buttons, swiping on mobile, or  | Simply moving the mouse cursor over 
    //                    | dragging on desktop.                                | the carousel area.
    // --------------------------------------------------------------------------------------------------
    // Default Value      | true (Autoplay turns off permanently).              | false (Autoplay keeps running).
    // --------------------------------------------------------------------------------------------------
    // Behavior when true | PERMANENTLY STOPS autoplay until you programmatically | TEMPORARILY PAUSES autoplay; it 
    //                    | restart it via code.                                | resumes automatically on mouse leave.
    // --------------------------------------------------------------------------------------------------


    // ===========================================================================================
    // 💡 Concept: Explicit Plugin Method Calls on Buttons
    // ===========================================================================================
    // The emblaRef handles interactions INSIDE the slider (swiping/hovering the images).
    // However, our custom buttons live OUTSIDE the emblaRef viewport. Therefore, hovering or 
    // clicking them won't automatically trigger the plugin's built-in behaviors.
    // Solution: We must explicitly tell the Autoplay plugin to stop() or reset() using emblaApi!

    // But here by rootNode we already passed whole component to be work as emblaRef ViewPort so need to give extra



export default function FeaturedCarousel({ events }) {
    const [selectedIndex, setSelectedIndex] = useState(0)           // Giving for buttom down
    
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
        Autoplay({
            delay: 2000, 
            stopOnInteraction: false, 
            stopOnMouseEnter: true,
            
            // rootNode: 'emblaRoot' is the div containing emblaRef. By setting it to parentElement, 
            // we ensure that hovering over the ENTIRE component (including arrows) triggers the 
            // stopOnMouseEnter behavior, not just hovering over the slides themselves!
            rootNode: (emblaRoot) => emblaRoot.parentElement 
        })
    ])

    // Setting Index on each loop changes
    useEffect(()=>{
        if (!emblaApi) return;
        emblaApi.on("select", ()=> setSelectedIndex(emblaApi.selectedScrollSnap()))           // It's an Event Listener
    },[emblaApi])


    const goToPrev = () => {
        emblaApi?.scrollPrev()
        emblaApi.plugins().autoplay.reset();        // Whenever clicked -> manually resets autoplay timer
    }
    const goToNext = () => {
        emblaApi?.scrollNext()
        emblaApi.plugins().autoplay.reset();
    }

    const scrollTo = (i) =>{
        // console.log(i);      // will give the index
        emblaApi.scrollTo(i)    // will take it to the index
    }
    return (
        <div className="relative group">
            {/* 💡 This ref={emblaRef} is running the show. It tells Embla "This is the viewport!" */}
            <div className="overflow-hidden rounded-3xl" ref={emblaRef}> 
                <div className="flex">
                    {events.map((event) => {
                        const eventID = event._id || event.id;
                        return (
                            <div
                                key={eventID}
                                className="flex-[0_0_100%] min-w-0 relative aspect-video md:aspect-21/9 lg:aspect-24/9 max-h-125"
                            >
                                {/* Background Image with warm rich gradient overlay */}
                                <div className="absolute inset-0 bg-[#161513]">
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full h-full object-cover opacity-60 mix-blend-luminosity filter brightness-95"
                                    />
                                    {/* Subtle editorial warm gradient */}
                                    <div className="absolute inset-0 bg-linear-to-t from-[#141312] via-[#141312]/60 to-transparent" />
                                    <div className="absolute inset-0 bg-linear-to-r from-[#141312] via-[#141312]/80 to-transparent" />
                                </div>

                                {/* Content Overlay */}
                                <div className="relative h-full flex flex-col justify-end p-6 sm:p-10 lg:p-12 text-white max-w-3xl z-10">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E65100] text-white shadow-sm">
                                                <Sparkles className="w-3.5 h-3.5" /> Featured Spotlight
                                            </span>
                                            {event.category?.name && (
                                                // Here badge is from ui/ not from lucide 
                                                <Badge
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-stone-200 border-white/20 bg-white/10 backdrop-blur-sm"
                                                >
                                                    {event.category.name}
                                                </Badge>
                                            )}
                                            <Badge variant="forest" size="sm">
                                                {event.format === "online"
                                                    ? "Online"
                                                    : event.format === "hybrid"
                                                        ? "Hybrid"
                                                        : "In-Person"}
                                            </Badge>
                                        </div>

                                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                                            <Link
                                                to={`/events/${event.slug || eventID}`}
                                                className="hover:underline underline-offset-4 decoration-[#E65100]"
                                            >
                                                {event.title}
                                            </Link>
                                        </h2>

                                        <p className="text-sm sm:text-base text-stone-300 line-clamp-2 max-w-2xl font-normal leading-relaxed">
                                            {event.description}
                                        </p>

                                        <div className="flex items-center gap-5 pt-2 text-xs sm:text-sm text-stone-300 font-medium flex-wrap">
                                            <span className="flex items-center gap-1.5 text-orange-300 font-semibold">
                                                <Calendar className="w-4 h-4" />
                                                {formatEventDate(event.startDate)}
                                                {/* {event.startDate} */}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-stone-300">
                                                <MapPin className="w-4 h-4 text-stone-400" />
                                                {event.venue}, {event.city}
                                            </span>
                                            <span className="flex items-center gap-1.5 font-bold text-white bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
                                                {formatPrice(event.price, event.currency)}
                                                {/* {event.price} */}
                                            </span>
                                        </div>

                                        <div className="pt-3 flex items-center gap-3">
                                            <Link to={`/events/${event.slug || eventID}`}>
                                                <Button
                                                    variant="primary"
                                                    size="md"
                                                    className="gap-2 shadow-lg"
                                                >
                                                    <span>Explore Experience</span>
                                                    <ArrowRight className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            {
                                                <Button
                                                    variant="secondary"
                                                    size="md"
                                                    className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                                                >
                                                    Quick Register
                                                </Button>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>


            <button
                // onMouseEnter={() => emblaApi.plugins().autoplay.stop()}
                onClick={goToPrev}
                aria-label="Previous slide"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-stone-800 shadow-md flex items-center justify-center transition-all duration-300 ease-in-out opacity-30 group-hover:opacity-100 z-20 cursor-pointer backdrop-blur-sm"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                // onMouseEnter={() => emblaApi.plugins().autoplay.stop()}
                onClick={goToNext}
                aria-label="Next slide"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-stone-800 shadow-md flex items-center justify-center transition-all duration-300 ease-in-out opacity-30 group-hover:opacity-100 z-20 cursor-pointer backdrop-blur-sm"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            <div className='absolute bottom-4 right-6 flex items-center gap-2 z-20'>
                {/* Only the same no. of button == no. of events */}
                {/* Logic : if index == current index of event button will be little spreaded */}
                {
                    events.map((_,index)=> {
                        return(
                            <button 
                                key={index} 
                                onClick={()=>scrollTo(index)}
                                className={`transition-all rounded-full ${
                                    index === selectedIndex 
                                        ? "w-6 h-2 bg-[#E65100]"
                                        : "w-2 h-2 bg-white/50 hover:bg-white/80"
                                    }`} />)
                })
                }
            </div>
        </div>
    )
}