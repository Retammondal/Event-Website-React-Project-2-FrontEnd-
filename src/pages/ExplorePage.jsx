import Skeleton from '@/components/common/skeleton';
import EventCard from '@/components/events/EventCard';
import api from '@/lib/axios';
import { useInView } from 'react-intersection-observer';

import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import EventFilterBar from '@/components/events/EventFilterBar';
import { useDispatch, useSelector } from 'react-redux';
import { setEntry, setFormat } from '@/store/slices/filterSlice';

export default function ExplorePage() {

    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);                           // First Time Loading
    const [isLoadingMore, setIsLoadingMore] = useState(false);                  // Upcoming loadings in fetch
    const [pagination, setPagination] = useState({ page: 1, total: 0, hasMore: false })

    const filters = useSelector((state)=> state.filters)
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch();
    const activeRequestId = useRef(0);
    // ? Why dont we take useState, it updates quick where useState updates state after function run complete

    // Use object destructuring, so you don't need to remember the exact order
    const { ref: observerRef, inView } = useInView({
        // * inView triggers when it's come to viewport and when it's left
        threshold: 0.5                                         // * threshold = 0.5 means 50% dikhegi toh inView trigger hogi
    });


    async function fetchEvents(page = 1, append = false) {
        const thisRequestId = ++activeRequestId.current;
        if (page === 1) {
            setIsLoading(true)
        } else {
            setIsLoadingMore(true)
        }
        const params = new URLSearchParams();
        if (filters.format){
            params.set("format", filters.format);
        }

        if (filters.isPaid !== ""){
            params.set("isPaid", String(filters.isPaid))
        }
        params.set('page', page);
        console.log(params.toString());                     // format=hybrid&page=1
        try {
            const { data: events, pagination } = await api.get(
                // `/api/events?page=${page}&format=${filters.format}`
                `/api/events?${params.toString()}`
            )

            if (thisRequestId !== activeRequestId.current){
                return;
            }
            // ? Why this step...when the first useEffect runs thisRequest = current = 1 ... run this function
            // ? next useEffect activerequest is 1 and this becomes 2...cancels this function
            if (append) {
                setEvents((prev) => [...prev, ...events])            // append means jo pahle se he rahne do..new wale niche add karon
            } else {
                setEvents(events);
            }
            setPagination(pagination)
        } catch (error) {

        }
        setIsLoading(false)
        setIsLoadingMore(false)
    }

    useEffect(()=>{
        const urlFormat = searchParams.get("format");
        const urlIsPaid = searchParams.get("isPaid")

        if (urlFormat){
            dispatch(setFormat(urlFormat))
        } else{
            dispatch(setFormat(""))
        }

        if (urlIsPaid){
            dispatch(setEntry(urlIsPaid === "true" ? true : false))
        } else{
            dispatch(setEntry(""))
        }
    }, [searchParams])

    useEffect(() => {
        fetchEvents();
    }, [filters.format, filters.isPaid])

    useEffect(() => {
        if (inView && pagination.hasMore && !isLoading && !isLoadingMore) {
            let timer = setTimeout(() => {
                fetchEvents(pagination.page + 1, true)
            }, 200);
            return () => clearTimeout(timer);                   // clearing the timer...
        }
    }, [inView])

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111] tracking-tight">
                    Explore Curated Gatherings
                </h1>
                <p className="text-sm text-stone-600">
                    Discover summits, masterclasses, acoustic shows, and retreats across India
                </p>
            </div>

            {/* Filter and Search Bar */}
            <EventFilterBar/>

            {/* Results Header with Active Filter Tags */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-500 pt-2 border-b border-[#EBE8DF] pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                    <span>
                        Showing <strong className="text-stone-800">{events.length}</strong> events of {pagination.total}
                    </span>

                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-[#C2410C] border border-orange-200">
                        <span>📍</span>
                        <span>City: Bengaluru</span>
                        <button
                            type="button"
                            className="hover:text-rose-700 ml-0.5 cursor-pointer"
                            aria-label="Remove city filter"
                        >
                            ✕
                        </button>
                    </span>

                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-800 border border-stone-200">
                        <span className="text-[#E65100]">🏷️</span>
                        <span>Category: Technology & AI</span>
                        <button
                            type="button"
                            className="hover:text-rose-700 ml-0.5 cursor-pointer"
                            aria-label="Remove category filter"
                        >
                            ✕
                        </button>
                    </span>
                </div>
            </div>

            {/* Events Grid */}
            <div className="space-y-10">
                {
                    isLoading
                        ? (
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                                {[...Array(8)].map((_, i) => (
                                    <Skeleton key={i} />
                                ))}
                            </div>)
                        : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {
                                    events.map((e) => <EventCard key={e.id || e._id} event={e} />)
                                }
                            </div>
                        )
                }


                {/* Empty Div --> For API Call (Sentinal Element) */}
                <div ref={observerRef} className="py-6 flex justify-center ">
                    {isLoadingMore && (
                        <div className="flex items-center gap-2 text-xs text-stone-500">
                            <span className="w-4 h-4 border-2 border-[#E65100] border-t-transparent rounded-full animate-spin" />
                            <span>Unfolding more community gatherings...</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}