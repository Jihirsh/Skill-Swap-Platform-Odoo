import React, { useState, useContext } from "react";
import { username_context } from "../../App";
import { CircleUser, Star } from "lucide-react";

type Requst = {
  name: string;
  skill: string;
  message: string;
  skill_id: string;
  requester_id: string;
};

type send = {
  skill_id: string;
  requester_id: string;
  receiver_id: string;
  rating: number;
};

export default function ReqChart({ name, skill, message, skill_id, requester_id }: Requst) {
  const [rating, setRating] = useState(0);
  const [remove, setRemove] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const { user_id } = useContext(username_context);

  function apicall() {
    if (rating > 5 || rating < 0 || !rating) {
      alert('Rating should be between 0 and 5');
      return;
    }

    const senddata: send = {
      requester_id: user_id,
      skill_id,
      receiver_id: requester_id,
      rating,
    };

    setRemove(true);
    fetch('https://skill-api.penneithendral.workers.dev/requests/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(senddata),
    }).then(res => res.json()).then(data => console.log(data));
  }

  if (remove) return null;

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 border border-gray-300 shadow-md hover:shadow-indigo-300 rounded-xl w-72 p-5 flex flex-col gap-4 transition-all duration-300 hover:scale-[1.02]">

      {/* Profile */}
      <div className="flex justify-center">
        <CircleUser size={56} className="text-indigo-600 drop-shadow" />
      </div>

      {/* Text Content */}
      <div className="text-center space-y-1">
        <h2 className="font-bold text-xl text-gray-800">{name}</h2>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Skill:</span>{" "}
          <span className="text-indigo-700 font-semibold">{skill}</span>
        </p>
        {message && (
          <p className="text-sm text-gray-500 italic mt-1">"{message}"</p>
        )}
      </div>

      {/* Rating Action */}
      <div className="flex justify-center mt-2">
        {showInput ? (
          <div className="flex flex-col gap-2 items-center w-full">
            <input
              type="number"
              placeholder="0 - 5"
              min={0}
              max={5}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border border-gray-300 rounded-full px-3 py-1 text-sm w-24 focus:outline-none focus:ring-1 focus:ring-indigo-400"
            />
            <button
              onClick={() => {
                apicall();
                setShowInput(false);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-full text-sm transition"
            >
              Submit
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowInput(true)}
            className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-full text-sm transition"
          >
            <Star size={16} />
            Give Rating
          </button>
        )}
      </div>
    </div>
  );
}
