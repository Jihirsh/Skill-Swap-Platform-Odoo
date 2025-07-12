import React, { useState, useContext } from 'react';
import { username_context } from '../../App';
import { CircleUser, Check, XCircle, Clock } from 'lucide-react';

type Requst = {
  name: string;
  skill: string;
  message: string;
  skill_id: string;
  requester_id: string;
  time?: string; // optional: format '2025-07-12T14:00:00Z'
};

type response = {
  requester_id: string;
  status: boolean;
  receiver_id: string;
  skill_id: string;
};

export default function ReqChart({ name, skill, message, skill_id, requester_id, time }: Requst) {
  const { user_id } = useContext(username_context);
  const [isAccepted, setIsAccepted] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [isResponded, setIsResponded] = useState(false);

  function responseHandler(accepted: boolean) {
    const payload: response = {
      requester_id,
      receiver_id: user_id,
      skill_id,
      status: accepted,
    };

    fetch('https://skill-api.penneithendral.workers.dev/res', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(() => {
        if (!accepted) {
          setFadeOut(true);
          setTimeout(() => setIsResponded(true), 500); // remove after animation
        } else {
          setIsAccepted(true);
          setIsResponded(true);
        }
      })
      .catch(err => console.error(err));
  }

  if (isResponded && !isAccepted) return null;

  const requestTime = time ? new Date(time).toLocaleString() : null;

  return (
    <div
      className={`bg-white border border-gray-300 shadow-md hover:shadow-indigo-300 rounded-xl w-[95%] max-w-xl p-5 flex gap-5 items-center transition-all duration-500 ease-in-out ${
        fadeOut ? 'opacity-0 translate-x-5 scale-95' : 'opacity-100'
      } max-sm:flex-col max-sm:text-center`}
    >
      {/* Avatar */}
      <div className="flex justify-center items-center">
        <CircleUser size={70} className="text-indigo-600" />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 w-full">
        <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Skill:</span> {skill}
        </p>
        {message && (
          <p className="text-sm text-gray-500 italic bg-indigo-50 rounded-md px-3 py-1 w-fit max-w-full">
            “{message}”
          </p>
        )}
        {requestTime && (
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
            <Clock size={14} /> {requestTime}
          </p>
        )}

        {isAccepted ? (
          <span className="bg-green-100 text-green-700 font-semibold text-sm px-4 py-1 rounded-full w-fit mt-2">
            ✅ Accepted
          </span>
        ) : (
          <div className="flex gap-3 mt-3 justify-center max-sm:justify-between">
            <button
              onClick={() => responseHandler(true)}
              className="flex items-center gap-1 px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm transition"
            >
              <Check size={16} /> Accept
            </button>
            <button
              onClick={() => responseHandler(false)}
              className="flex items-center gap-1 px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm transition"
            >
              <XCircle size={16} /> Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
