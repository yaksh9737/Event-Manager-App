import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

const EditEvent = () => {
  const { id } = useParams(); // Get the event ID from the URL
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    maxAttendees: "",
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setEventData(response.data);
      } catch (error) {
        console.error(error.response?.data || error.message);
        setError("Error fetching event details");
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", eventData.title);
    formData.append("description", eventData.description);
    formData.append("date", eventData.date);
    formData.append("location", eventData.location);
    formData.append("maxAttendees", eventData.maxAttendees);
    if (image) {
      formData.append("image", image);
    }

    try {
      await api.put(`/events/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Event updated successfully");
      navigate("/my-events");
    } catch (error) {
      console.error(error.response?.data || error.message);
      setError("Error updating event");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="w-full max-w-md px-8 py-6 mx-auto bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-[#dc363c] mb-6">Edit Event</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="title">
              Event Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={eventData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
              placeholder="Enter event title"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="description">
              Event Description
            </label>
            <textarea
              id="description"
              name="description"
              value={eventData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
              placeholder="Enter event description"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="date">
              Event Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={eventData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="location">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={eventData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
              placeholder="Enter location"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="maxAttendees">
              Max Attendees
            </label>
            <input
              type="number"
              id="maxAttendees"
              name="maxAttendees"
              value={eventData.maxAttendees}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
              placeholder="Enter max attendees"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="image">
              Event Image
            </label>
            <input
              type="file"
              id="image"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
              accept="image/*"
            />
          </div>
          <button
          type="submit"
          className="bg-[#0099ff] w-full py-2 text-white relative overflow-hidden z-30 group hover:bg-sky-800 transition-all duration-500 rounded tracking-wider font-semibold"
        >
          Update Event <i className="fa-solid fa-arrow-up-right-from-square"></i>
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
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
