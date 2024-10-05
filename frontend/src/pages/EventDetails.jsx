import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiOutlineClock,
} from "react-icons/hi"; // Icons for date, location, time
import api from "../api/api"; // Ensure api is configured correctly

const EventDetails = () => {
  const { id } = useParams(); // Extract the event ID from the URL
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [rsvpStatus, setRsvpStatus] = useState(null); // Track RSVP status
  const [userHasRSVPd, setUserHasRSVPd] = useState(false); // Track if the user has already RSVPed

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data);
        setUserHasRSVPd(response.data.attendees.includes("your_user_id")); // Check if the user has already RSVPed
        setLoading(false);
      } catch (err) {
        console.error(err.response?.data || err.message);
        setError("Error fetching event details");
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  // RSVP to the event
  const handleRSVP = async () => {
    try {
      const response = await api.post(`/events/${id}/rsvp`);
      setEvent(response.data.event); // Update the event with the new RSVP
      setUserHasRSVPd(true); // Mark that the user has RSVPed
      setRsvpStatus("Event Enrolled Successfully...!"); // Show success message
    } catch (error) {
      console.error("RSVP failed:", error.response?.data || error.message);
      setRsvpStatus(
        error.response?.data?.message || "Error RSVPing to the event."
      );
    }
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
  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!event) {
    return <p>No event details found.</p>;
  }

  const formattedDate = new Date(event.date).toLocaleDateString();
  const formattedTime = new Date(event.date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Event Image */}
        {event.imageUrl && (
          <div className="lg:w-1/2">
            <img
              src={`https://swiftrut-task-4.onrender.com${event.imageUrl}`}
              alt={event.title}
              className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-lg transition-transform transform hover:scale-105"
            />
          </div>
        )}

        {/* Event Info */}
        <div className="lg:w-1/2">
          <div className="mb-6">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{event.title}</h2>
            <div className="flex items-center gap-4 text-gray-500">
              <HiOutlineCalendar className="w-6 h-6 text-gray-700" />
              <span>{formattedDate}</span>
              <HiOutlineClock className="w-6 h-6 text-gray-700" />
              <span>{formattedTime}</span>
            </div>
          </div>

          {/* Location */}
          <div className="mb-6">
            <div className="flex items-center text-gray-500 gap-4">
              <HiOutlineLocationMarker className="w-6 h-6 text-gray-700" />
              <span>{event.location}</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              About this event
            </h3>
            <p className="text-gray-600">{event.description}</p>
          </div>

          {/* RSVP Button */}
          <div>
            {!userHasRSVPd && event.attendees.length < event.maxAttendees ? (
              // <button
              //   className="border border-gray-400 text-[#00e600] font-bold px-6 py-3 rounded-md hover:bg-[#00e600] hover:text-white transition duration-200 w-full lg:w-auto"
              //   onClick={handleRSVP}
              // >
              //   Book this event
              // </button>
              <button
              className="bg-[#0099ff] px-5 py-2 text-white relative overflow-hidden z-30 group hover:bg-sky-800 transition-all duration-500 rounded tracking-wider font-semibold"
              onClick={handleRSVP}
            >
              Book this event now <i className="fa-solid fa-arrow-up-right-from-square"></i>
              <svg
                class="absolute inset-0 left-0 top-0 fill-sky-300 -z-30 opacity-0 group-hover:opacity-100 group-hover:duration-300 group-hover:transition-all group-active:fill-sky-950"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 204.000000 113.000000"
                xmlns="http://www.w3.org/2000/svg"
                version="1.0"
              >
                <g
                  stroke="none"
                  transform="translate(0.000000,113.000000) scale(0.100000,-0.100000)"
                >
                  <path
                    d="M850 1069 c-23 -48 -27 -66 -19 -85 5 -14 9 -40 9 -57 0 -18 4 -38 9
                -46 9 -14 19 36 19 99 1 44 7 71 17 78 9 6 35 56 35 67 0 3 -9 5 -20 5 -15 0 -28 -16 -50 -61z"
                  ></path>
                  <path
                    d="M1662 1099 c-24 -17 -40 -34 -38 -37 3 -3 14 2 24 11 10 10 22 17 25 17 4 0 16 9 27 20 30 30 9 24 -38 -11z"
                  ></path>
                  <path
                    d="M101 1104 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z"
                  ></path>
                  <path
                    d="M1090 1070 c0 -6 7 -10 15 -10 8 0 15 2 15 4 0 2 -7 6 -15 10 -8 3 -15 1 -15 -4z"
                  ></path>
                  <path
                    d="M1 1023 c1 -53 6 -49 11 10 2 20 0 37 -4 37 -4 0 -8 -21 -7 -47z"
                  ></path>
                  <path
                    d="M1121 1024 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z"
                  ></path>
                  <path
                    d="M101 984 c0 -11 3 -14 6 -6 3 7 2 16 -1 19 -3 4 -6 -2 -5 -13z"
                  ></path>
                  <path
                    d="M1140 958 c0 -9 5 -20 10 -23 13 -8 13 5 0 25 -8 13 -10 13 -10 -2z"
                  ></path>
                  <path
                    d="M1286 955 c4 -8 8 -15 10 -15 2 0 4 7 4 15 0 8 -4 15 -10 15 -5 0 -7 -7 -4 -15z"
                  ></path>
                  <path
                    d="M1647 930 c-13 -15 -14 -20 -3 -20 7 0 16 9 19 20 3 11 4 20 3 20 -1 0 -9 -9 -19 -20z"
                  ></path>
                  <path
                    d="M1171 925 c1 -19 18 -51 18 -35 0 8 -4 22 -9 30 -5 8 -9 11 -9 5z"
                  ></path>
                  <path
                    d="M8 875 c6 -11 22 -33 36 -49 27 -30 33 -60 16 -71 -6 -4 -19 -24 -30 -45 l-20 -39 43 -32 c23 -18 43 -34 45 -34 1 -1 4 -60 7 -131 4 -121 6 -130 30 -153 19 -20 25 -22 25 -9 0 8 -7 21 -15 28 -14 12 -15 23 -14 177 1 8 -13
                  116 -66 129 -29 7 -35 44 -10 64 8 7 15 19 15 27 0 7 6 16 14 19 27 10 -11 78 -68 124 -18 14 -18 14 -8 -5z"
                  ></path>
                  <path
                    d="M862 830 c-12 -27 -26 -52 -31 -54 -5 -3 -2 -26 7 -51 14 -44 14 -46 -13 -85 -22 -32 -27 -47 -22 -77 11 -63 29 -65 21 -2 -6 52 -5 58 21 82 26 24 27 27 17 69 -9 34 -8 47 3 65 16 25 36 103 26 103 -3 0 -16 -22 -29 -50z"
                  ></path>
                  <path
                    d="M1200 872 c0 -16 67 -89 74 -81 3 3 -12 25 -34 49 -22 24 -40 38 -40 32z"
                  ></path>
                  <path
                    d="M1567 826 c-4 -10 -1 -13 8 -9 8 3 12 9 9 14 -7 12 -11 11 -17 -5z"
                  ></path>
                  <path
                    d="M1536 773 c-6 -14 -5 -15 5 -6 7 7 10 15 7 18 -3 3 -9 -2 -12 -12z"
                  ></path>
                  <path
                    d="M1270 770 c0 -5 7 -10 15 -10 8 0 15 -7 15 -15 0 -8 4 -15 9 -15 5 0 11 -10 14 -22 4 -12 9 -19 12 -16 14 13 -9 60 -36 74 -17 8 -29 10 -29 4z"
                  ></path>
                  <path
                    d="M1344 672 c-19 -12 -29 -109 -24 -236 5 -142 18 -135 17 9 -2 156 2 188 26 216 17 19 4 27 -19 11z"
                  ></path>
                  <path
                    d="M1398 673 c6 -2 18 -2 25 0 6 3 1 5 -13 5 -14 0 -19 -2 -12 -5z"
                  ></path>
                  <path
                    d="M1463 673 c9 -2 25 -2 35 0 9 3 1 5 -18 5 -19 0 -27 -2 -17 -5z"
                  ></path>
                  <path
                    d="M848 433 c2 -36 5 -63 7 -61 1 2 6 28 9 59 5 42 4 58 -6 61 -10 4 -12 -9 -10 -59z"
                  ></path>
                  <path
                    d="M1698 403 c6 -2 18 -2 25 0 6 3 1 5 -13 5 -14 0 -19 -2 -12 -5z"
                  ></path>
                  <path
                    d="M872 345 c0 -16 2 -22 5 -12 2 9 2 23 0 30 -3 6 -5 -1 -5 -18z"
                  ></path>
                  <path
                    d="M1810 345 c0 -10 40 -45 53 -45 6 0 8 1 6 3 -2 1 -16 13 -31 26 -16 14 -28 21 -28 16z"
                  ></path>
                </g>
              </svg>
            </button>

            ) : (
              <p className="text-gray-500">
                {userHasRSVPd
                  ? "You have already booked this event."
                  : "This event is fully booked."}
              </p>
            )}

            {/* Show RSVP status message */}
            {rsvpStatus && <p className="text-green-500 mt-4">{rsvpStatus}</p>}
          </div>
        </div>
      </div>

      {/* Event Meta Info */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Event Details
        </h3>
        <div className="flex items-center gap-4 text-gray-600">
          <HiOutlineClock className="w-6 h-6 text-gray-700" />
          <p>
            {formattedTime} | {event.maxAttendees} total seats
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
