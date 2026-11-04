import FeaturedCarousal from '@/components/FeaturedCarousal'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { ChevronRight, Compass, Flame, Sparkles } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'

function HomePage() {

  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([]);
  useEffect(()=>{
    async function getFeaturedEvents() {
      setIsLoading(true)
      try{
        let {data :{data}} = await axios.get("https://eventsphere-server-mfdb.onrender.com/api/events/featured")
        console.log(data);
        setEvents(data)
      }
      catch(error){

      }finally{
        setIsLoading(false)
      }
    }
    getFeaturedEvents();
  }, [])
  // * With UseEffect we are loading the Fetch API to the 'events' and directly passing it as a prop into Emla Carousal && it automatically taking it

  return (
    <div className="space-y-16 pb-20">

      {/* Home Main Section  */}
      <section className="relative pt-12 pb-6 sm:pt-16 sm:pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 pb-10 border-b border-[#EBE8DF]">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100/70 text-[#C2410C] border border-orange-200">
              <Sparkles className="w-3.5 h-3.5" /> India's Curated Community
              Conclaves
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111] leading-[1.08]">
              Extraordinary gatherings for curious minds.
            </h1>
            <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
              Discover verified developer summits, acoustic indie evenings,
              founder pitch conclaves, and art retreats across Bengaluru,
              Mumbai, and Delhi NCR.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <Link to="/explore">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto shadow-elevated gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>Explore 40+ Gatherings</span>
              </Button>
            </Link>
            <Link to="/create-event">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                Host an Event
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Carousal Section  */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#E65100]" />
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">
              Curated Spotlight
            </h2>
          </div>
          <Link
            to="/explore"
            className="text-xs font-semibold text-[#E65100] hover:underline flex items-center gap-1"
          >
            Browse all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className='aspect-21/9 rounded-3xl bg-[#EBE8DF]/50 animate-pulse' />   
        ) : (
          <FeaturedCarousal events = {events} />
        )}
      </section>

    </div>
  )
}

export default HomePage