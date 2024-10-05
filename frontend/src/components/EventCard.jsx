import React from "react";
import { useNavigate } from "react-router-dom";
import { HiCalendar, HiUserGroup, HiBadgeCheck } from "react-icons/hi"; // React Icons

// Base URL for the backend
const BASE_URL = "https://swiftrut-task-4.onrender.com"; // Ensure this matches your backend's URL

const EventCard = ({
  id,
  title,
  date,
  location,
  imageUrl,
  attendeesCount,
  isFree,
}) => {
  const navigate = useNavigate();
  const fullImageUrl = `${BASE_URL}${imageUrl}`;
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const handleViewDetails = () => {
    if (id) {
      navigate(`/event/${id}`);
    } else {
      console.error(
        "Event ID is undefined. Check if the ID is passed correctly."
      );
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer overflow-hidden"
      onClick={handleViewDetails}
    >
      {imageUrl && (
        <img
          src={fullImageUrl}
          alt={title}
          className="w-full h-48 object-cover rounded-t-lg hover:scale-105 transition-transform duration-300"
        />
      )}
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-2 truncate">
          {title}
        </h2>
        <p className="text-sm text-gray-700 mb-4">
          Hosted by:{" "}
          <span className="font-medium text-red-600">
            Chennai Tisax Automotive Cybersecurity Meetup Group
          </span>
        </p>

        <div className="flex items-center text-gray-600 text-sm mb-3">
          <HiCalendar className="mr-2 text-gray-700" />
          <p>
            {formattedDate} - {location}
          </p>
        </div>

        <div className="flex justify-between items-center text-gray-600 text-sm mb-4">
          <div className="flex items-center">
            <HiUserGroup className="mr-1 text-gray-700" />
            <p>{attendeesCount} going</p>
          </div>
          <div className="flex items-center">
            <HiBadgeCheck
              className={`mr-1 ${isFree ? "text-green-500" : "text-yellow-500"}`}
            />
            <p>{isFree ? "Free" : "Paid"}</p>
          </div>
        </div>

        <button className="relative border w-full hover:border-sky-600 duration-500 group cursor-pointer text-sky-50  overflow-hidden h-14 rounded-md bg-sky-800 p-2 flex justify-center items-center font-extrabold">
          <div className="absolute z-10 w-48 h-48 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-sky-900 delay-150 group-hover:delay-75"></div>
          <div className="absolute z-10 w-40 h-40 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-sky-800 delay-150 group-hover:delay-100"></div>
          <div className="absolute z-10 w-32 h-32 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-sky-700 delay-150 group-hover:delay-150"></div>
          <div className="absolute z-10 w-24 h-24 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-sky-600 delay-150 group-hover:delay-200"></div>
          <div className="absolute z-10 w-16 h-16 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-sky-500 delay-150 group-hover:delay-300"></div>
          <p className="z-10">Discover More</p>
        </button>


      </div>
    </div>
  );
};

export default EventCard;
