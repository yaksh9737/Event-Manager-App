import React, { useState, useEffect } from "react";
import EventCard from "../components/EventCard";
import api from "../api/api"; // Axios instance
import { format } from "date-fns";

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [locations, setLocations] = useState([]); // State for unique locations
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Fetch all events from the API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/events/all");
        const fetchedEvents = response.data;
        setEvents(fetchedEvents); // Set the fetched events in state
        setFilteredEvents(fetchedEvents); // Initially, no filters applied

        // Extract unique locations from the events
        const uniqueLocations = [
          ...new Set(fetchedEvents.map((event) => event.location)),
        ];
        setLocations(uniqueLocations); // Set the unique locations for the dropdown
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false); // Stop the loading indicator
      }
    };

    fetchEvents();
  }, []);

  // Trigger the filter logic when selectedTitle changes (live search)
  useEffect(() => {
    handleFilterByTitle();
  }, [selectedTitle]); // Runs the filter whenever the title changes

  // Function to handle filtering by title
  const handleFilterByTitle = () => {
    let filtered = events;

    // Filter by title
    if (selectedTitle) {
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(selectedTitle.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  };

  // Function to handle filtering by location and date
  const handleFilterByLocationAndDate = () => {
    let filtered = events;

    // Filter by location
    if (selectedLocation) {
      filtered = filtered.filter((event) =>
        event.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter(
        (event) => format(new Date(event.date), "yyyy-MM-dd") === selectedDate
      );
    }

    setFilteredEvents(filtered);
  };

  // Function to clear filters and reset the event list
  const clearFilters = () => {
    setSelectedTitle(""); // Clear the title filter
    setSelectedLocation(""); // Clear the location filter
    setSelectedDate(""); // Clear the date filter
    setFilteredEvents(events); // Reset to all events
  };


  
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100/70">
        <svg
          className="w-16 h-16 animate-spin text-gray-900/50"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
        >
          <path
            d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <path
            d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-900"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Explore Events</h1>

      {/* Filter UI */}
      <div className="flex flex-wrap justify-between items-center mb-8 p-6 border rounded-lg shadow-lg bg-white">
        {/* Event Title Filter */}
        <div className="flex flex-col mb-4 sm:mb-0 w-full sm:w-1/4">
          <label htmlFor="title" className="mb-2 text-sm font-medium text-gray-700">
            Event Title
          </label>
          <input
            type="text"
            id="title"
            value={selectedTitle}
            onChange={(e) => setSelectedTitle(e.target.value)}
            placeholder="Search by event title"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-black"
          />
        </div>

        {/* Location Filter (Dynamic Dropdown) */}
        <div className="flex flex-col mb-4 sm:mb-0 w-full sm:w-1/4">
          <label htmlFor="location" className="mb-2 text-sm font-medium text-gray-700">
            Location
          </label>
          <select
            id="location"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-black"
          >
            <option value="">Select Location</option>
            {locations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div className="flex flex-col mb-4 sm:mb-0 w-full sm:w-1/4">
          <label htmlFor="date" className="mb-2 text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-black"
          />
        </div>

        {/* Search Button */}
        <div className="flex items-center mb-4 sm:mb-0 w-full sm:w-auto">
          <button
            onClick={handleFilterByLocationAndDate}
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition duration-200"
          >
            Search
          </button>
          <button
            onClick={clearFilters}
            className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200 ml-4"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-10">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard
              key={event._id}
              id={event._id}
              title={event.title}
              date={event.date}
              location={event.location}
              imageUrl={event.imageUrl}
            />
          ))
        ) : (
          <p>No events available</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
