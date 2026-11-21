import { handleFavorite } from '@/components/events/EventCard';
import EventReviewSection from '@/components/events/EventReviewSection';
import api from '@/lib/axios';
import { formatEventDate, formatEventTimeRange, formatPrice, getDaysRemaining } from '@/lib/utils';
import axios from 'axios';
import { ArrowLeft, ArrowLeftSquare, Bookmark, Calendar, Check, Clock, MapPin, Share2, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router';
import { toast } from 'sonner';

const Modes = {
    "in-person": "In-Person Gathering",
    "online": "Online Conclave",
    "hybrid": "Hybrid Format",
};

// ! How to use Toast Notification?
// * Solution : External Package = Sonner
// Use Toast in APp Component and we can use it from anywhere

export default function EventDetailsPage() {
    const { slug } = useParams();
    // console.log(slug);                   --> WIll give the :slug if had in the Route

    const [isLoading, setIsLoading] = useState(false);
    const [event, setEvent] = useState({});                 // events is taking all the Fetch data of that Event
    const [reviews, setReviews] = useState([])

    const dispatch = useDispatch();
    const isFavorite = useSelector((state) => state.favorites.items.some(                // if got give True; otherwise give False
        (e) => (e.id || e._id) === (event.id || event._id)
    ))

    useEffect(() => {
        async function fetchEvent() {
            setIsLoading(true)
            // For the Home Page Carousal Loading
            try {
                let {data} = await api.get(`/api/events/${slug}`)
                console.log(data);
                setEvent(data)

                // For the Reviews 
                let {data : reviews} = await api.get(`/api/events/${data.id || data._id}/reviews`)
                setReviews(reviews)
            }
            catch (error) {

            }
            setIsLoading(false)
        }
        fetchEvent();
    }, [])

    function handleShare() {
        // ! How to handle Share Button?
        // ! How to access the Clipboard? --> navigator.clipboard
        // How to add text copied to clipboard --> navigator.clipboard.writeText(...)
        // ! How to access Current Url Link? --> window.location.href
        navigator.clipboard.writeText(window.location.href)
        toast.success("URL Copied")
    }

    // Shimmer Effect
    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-16 space-y-8 animate-pulse">
                <div className="h-8 w-40 bg-stone-200 rounded-lg" />
                <div className="aspect-21/9 bg-stone-200 rounded-3xl" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="h-10 bg-stone-200 rounded-lg w-3/4" />
                        <div className="h-4 bg-stone-200 rounded w-full" />
                        <div className="h-4 bg-stone-200 rounded w-5/6" />
                    </div>
                    <div className="h-64 bg-stone-200 rounded-3xl" />
                </div>
            </div>
        )
    }
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
            {/* Back button */}
            <div className="flex items-center justify-between">
                <Link
                    to="/explore"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
                >
                    <ArrowLeft className='w-4 h-4' />
                    <span>Back to Explore</span>
                </Link>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleShare}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#DDD9CE] bg-white hover:bg-stone-50 text-xs font-medium text-stone-700 transition-all cursor-pointer"
                    >
                        <Share2 className='w-4 h-4' />
                        <span>Share</span>
                    </button>

                    <button
                        type="button"
                        onClick={(e) => handleFavorite(e, event, dispatch, isFavorite)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${isFavorite
                                ? "bg-orange-50 border-orange-200 text-[#E65100]"
                                : "bg-white border-[#DDD9CE] hover:bg-stone-50 text-stone-700"
                            }`}
                    >
                        <Bookmark
                            className={`w-3.5 h-3.5 ${isFavorite ? "fill-[#E65100]" : ""}`}
                        />
                        <span>{isFavorite ? "Saved" : "Save"}</span>
                    </button>
                </div>
            </div>

            {/* Hero Banner Image */}
            <div className="relative rounded-3xl overflow-hidden aspect-16/8 max-h-[460px] shadow-subtle border border-[#EBE8DF]">
                <img
                    src={event?.image}
                    alt={event?.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap bg-black/60 backdrop-blur-md text-white border border-white/20 text-xs px-2.5 py-1 rounded-full font-medium">
                            {event?.category?.name}
                        </span>
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap bg-[#EBF3ED] text-[#245436] border border-[#CFE2D4] text-xs px-2.5 py-1 rounded-full font-medium">
                            {/* Custom Renaming based on coming data from backend 
                                M-1 --> Nested Ternary Operator
                                M-2 --> Create an Object and compare and give values object[event.format] = value */}
                            {/* {
                                event?.format === "online"
                                    ? "Online Compiler"
                                    : event?.format === "in-person"
                                        ? "In-Person Gathering"
                                        : "Hybrid Format"
                            } */}
                            {Modes[event?.format]}
                        </span>
                        {
                            event.featured &&
                            <span className="inline-flex items-center gap-1.5 whitespace-nowrap bg-[#FFF3E0] text-[#B73E00] border border-[#FFE0B2] text-xs px-2.5 py-1 rounded-full font-medium">
                                <Sparkles className='w-4 h-4' /> Featured Pick
                            </span>
                        }
                    </div>

                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                        {event?.title}
                    </h1>

                    <div className="flex items-center gap-4 text-xs sm:text-sm text-stone-200 pt-1 flex-wrap font-medium">
                        <span className="flex items-center gap-1 text-orange-300 font-semibold">
                            <Calendar className='w-4 h-4' /> {formatEventDate(event.startDate)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            <Clock className='w-4 h-4' /> {formatEventTimeRange(event?.startDate, event?.endDate)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            <MapPin className='w-4 h-4' /> {event?.venue}, {event?.city}
                        </span>
                    </div>
                </div>
            </div>

            {/* Two Column Layout: Details on Left, Booking Ticket Card on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                {/* Left Column: Dossier */}
                <div className="lg:col-span-2 space-y-10">
                    {/* About Event */}
                    <section className="bg-white rounded-3xl border border-[#EBE8DF] p-6 sm:p-8 shadow-subtle space-y-4">
                        <h2 className="text-xl font-bold text-stone-900">About the Gathering</h2>
                        <div className="text-sm text-stone-700 leading-relaxed space-y-4 whitespace-pre-line font-normal">
                            {event?.description}
                        </div>

                        {/* Tags */}
                        <div className="pt-4 border-t border-[#F2EFE8] flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-semibold text-stone-500">Focus Areas:</span>
                            {
                                event?.tags?.map((t, i) => (
                                    <span key={i} className="text-xs font-medium text-stone-600 bg-stone-100 px-2.5 py-1 rounded-lg">#{t}</span>
                                ))
                            }
                        </div>
                    </section>

                    {/* Venue & Location details */}
                    <section className="bg-white rounded-3xl border border-[#EBE8DF] p-6 sm:p-8 shadow-subtle space-y-4">
                        <h3 className="text-lg font-bold text-stone-900">Venue & Access</h3>
                        <div className="bg-[#FAF9F5] rounded-2xl p-4 border border-[#EAE7DC] flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#C2410C] flex items-center justify-center shrink-0 text-lg">
                                📍
                            </div>
                            <div>
                                <p className="font-bold text-sm text-stone-900">{event?.venue}</p>
                                <p className="text-xs text-stone-600 mt-0.5">{event?.city}</p>
                            </div>
                        </div>
                    </section>

                    {/* Organizer Dossier */}
                    <section className="bg-white rounded-3xl border border-[#EBE8DF] p-6 sm:p-8 shadow-subtle space-y-4">
                        <h3 className="text-lg font-bold text-stone-900">Curated & Hosted by</h3>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <img
                                src={event?.organizer?.avatar}
                                alt={event?.organizer?.name}
                                className="w-14 h-14 rounded-2xl object-cover border border-[#DDD9CE]"
                            />
                            <div className="space-y-1 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            to="/profile"
                                            className="font-bold text-base text-stone-900 hover:text-[#E65100] transition-colors"
                                        >
                                            {event?.organizer?.name}
                                        </Link>
                                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                                            Organizer
                                        </span>
                                    </div>

                                    <Link to="/profile">
                                        <button type="button" className="inline-flex items-center justify-center font-medium border border-[#CCC8BA] bg-transparent hover:bg-[#F2F1EC] text-[#222] rounded-lg text-xs h-8 px-3">
                                            View Profile
                                        </button>
                                    </Link>
                                </div>
                                <p className="text-xs font-medium text-[#C2410C]">
                                    {event?.organizer?.organization}
                                </p>
                                <p className="text-xs text-stone-600 leading-relaxed pt-1">
                                    {event?.organizer?.bio}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Reviews section */}
                    <EventReviewSection reviews={reviews} averageRating={event.averageRating} numReviews={event.numReviews} />
                </div>

                {/* Right Column: Sticky Booking Ticket Card */}
                <div className="sticky top-24 space-y-4">
                    <div className="bg-white rounded-3xl border border-[#EBE8DF] p-6 sm:p-7 shadow-elevated space-y-6">
                        <div className="flex items-baseline justify-between pb-4 border-b border-[#F2EFE8]">
                            <div>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
                                    Admission Pass
                                </span>
                                <div className="text-3xl font-extrabold text-stone-900 mt-0.5">
                                    {formatPrice(event.price)}
                                </div>
                            </div>

                            <div className="text-right">
                                <span className="text-xs font-semibold px-2.5 py-1 bg-stone-100 text-stone-700 rounded-lg">
                                    {getDaysRemaining(event?.startDate)}
                                </span>
                            </div>
                        </div>

                        {/* Capacity status */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-stone-600">
                                <span className="flex items-center gap-1.5 font-medium">
                                    <Users className='w-4 h-4' /> Capacity
                                </span>
                                <span className="font-bold text-stone-900">
                                    {event?.registeredCount} of {event?.capacity} seats filled
                                </span>
                            </div>
                            <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#E65100] rounded-full transition-all"
                                    style={{ width: `${Math.round((event?.registeredCount * 100 / event?.capacity))}%` }}
                                />
                            </div>
                            <p className="text-[11px] text-stone-400 text-right">
                                {event?.capacity - event?.registeredCount} seats remaining
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2.5 pt-2">
                            <button
                                type="button"
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium bg-[#E65100] text-white hover:bg-[#D84315] w-full py-3.5 text-base shadow-elevated"
                            >
                                Reserve Passes
                            </button>

                            <button
                                type="button"
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium h-10 px-4 py-2 border border-[#CCC8BA] bg-transparent hover:bg-[#F2F1EC] text-[#222] w-full"
                            >
                                <span>📅</span> Add to My Schedule
                            </button>
                        </div>

                        {/* Trust points */}
                        <div className="pt-4 border-t border-[#F2EFE8] space-y-2 text-[11px] text-stone-500">
                            <div className="flex items-center gap-2">
                                <span className="text-emerald-600"><ShieldCheck className='w-4 h-4' /></span>
                                <span>Verified organizer & authentic attendee review policy</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-stone-400"><Check className='w-4 h-4' /></span>
                                <span>Digital ticket QR sent to your email instantly</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}