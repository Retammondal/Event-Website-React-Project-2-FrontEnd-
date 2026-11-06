import { formatEventDate, formatPrice } from "@/lib/utils";
import { formatDate } from "date-fns";
import { Bookmark, Calendar, Star } from "lucide-react";
import { Link } from "react-router";

export default function EventCard({e}) {
  return (
    <Link
      to={`/events/${e.slug}`}
      className="group bg-white rounded-2xl border border-[#EAE7DC] overflow-hidden flex flex-col justify-between shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.08)] hover:border-[#D5D0C2] hover:-translate-y-0.5 transition-all duration-300"
    >
      <div>
        {/* Cover Image & Overlays */}
        <div className="relative aspect-16/10 overflow-hidden bg-stone-100">
          <img
            src={e?.image}
            alt={e.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Badges on Image */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-black/70 text-white backdrop-blur-md shadow-sm">
              {e.name}
            </span>

            {/* Bookmark button */}
            <button
              type="button"
              className="pointer-events-auto w-6 h-6 p-0.5 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-black/5 flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all text-stone-700 hover:text-stone-900 cursor-pointer text-xs"
            >
              <Star/>
            </button>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 space-y-2">
          {/* Date & Location */}
          <div className="flex items-center gap-2 text-xs font-semibold text-[#C2410C]">
            <Calendar className="w-4 h-4"/>
            <span>{formatEventDate(e.startDate)}</span>
            <span className="text-stone-300 font-normal">•</span>
            <span className="text-stone-500 font-normal truncate">{e.city}</span>
          </div>

          {/* Event Title */}
          <h3 className="font-bold text-base text-[#111] leading-snug line-clamp-2 group-hover:text-[#E65100] transition-colors">
            {e.title}
          </h3>
        </div>
      </div>

      {/* Clean Bottom Meta: Format & Price */}
      <div className="px-4 pb-4 pt-3 border-t border-[#F2EFE8] flex items-center justify-between text-xs mt-1">
        <span className="capitalize text-stone-500 font-medium">
          {e.format}
        </span>
        <span className="text-sm font-bold text-stone-900">
          {formatPrice(e.price,e.currency)}
        </span>
      </div>
    </Link>
  );
}