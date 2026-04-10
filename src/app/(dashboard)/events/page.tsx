import { CalendarDays, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const events = [
  {
    title: "Annual Blood Donation Drive",
    date: "October 15, 2026",
    time: "09:00 AM - 04:00 PM",
    location: "Main Lobby, East Wing",
    status: "Upcoming",
    description: "Join us to save lives. Walk-ins are welcome, but pre-registration is highly recommended to avoid long waiting times."
  },
  {
    title: "Free Cardiac Health Checkup",
    date: "November 02, 2026",
    time: "10:00 AM - 02:00 PM",
    location: "Cardiology Center (Floor 2)",
    status: "Registration Open",
    description: "Complimentary ECG and basic cardiac consultations for senior citizens above the age of 60."
  },
  {
    title: "Medical Staff Training Seminar",
    date: "September 28, 2026",
    time: "02:00 PM - 06:00 PM",
    location: "Conference Hall A",
    status: "Internal",
    description: "Mandatory advanced life support training and protocol refreshers for all ER responders."
  }
];

export default function EventsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Hospital Events</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Discover upcoming drives, seminars, and health camps.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col group hover:shadow-md transition-all">
            <div className="p-1 border-b border-slate-100 dark:border-slate-800">
              <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                <CalendarDays className="h-10 w-10 text-slate-300 dark:text-slate-600 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                  {event.status}
                </span>
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-2">{event.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 flex-1">{event.description}</p>
              
              <div className="space-y-2 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                  <CalendarDays className="w-3.5 h-3.5 mr-2" /> {event.date}
                </div>
                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                  <Clock className="w-3.5 h-3.5 mr-2" /> {event.time}
                </div>
                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 mr-2" /> {event.location}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
