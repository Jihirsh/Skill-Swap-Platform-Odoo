import React from "react";
import { CircleUser, Mail, Eye } from "lucide-react";
import { Link } from "react-router-dom";

type Props = {
  name: string;
  skill: string;
  message: string;
  skill_id: string;
  requester_id: string;
};

export default function FriendCard({ name, skill, message, requester_id }: Props) {
  return (
    <div className="bg-gradient-to-br from-white to-slate-50 border border-gray-300 shadow-md hover:shadow-indigo-300 rounded-xl w-72 p-5 flex flex-col gap-4 transition-all duration-300 hover:scale-[1.02]">
      
      {/* Profile Icon */}
      <div className="flex justify-center">
        <CircleUser size={56} className="text-indigo-600 drop-shadow" />
      </div>

      {/* Info */}
      <div className="text-center space-y-2">
        <h2 className="font-bold text-xl text-gray-800">{name}</h2>
        <p className="text-sm text-gray-500">
          <span className="font-medium text-gray-700">Skill:</span>{" "}
          <span className="text-indigo-700 font-semibold">{skill}</span>
        </p>
        <p className="text-sm text-gray-500">
          <span className="font-medium text-gray-700">Message:</span>
          <br />
          <span className="italic text-gray-600">"{message || "No message provided"}"</span>
        </p>
        {/* Optional timestamp */}
        <p className="text-xs text-gray-400">Requested recently</p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-around mt-3">
        <button
          className="flex items-center gap-1 text-sm text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-full transition"
          onClick={() => alert(`Message to ${name}`)} // Replace with your message logic
        >
          <Mail size={16} />
          Message
        </button>

        <Link
          to={`/profile/${requester_id}`} // Assuming dynamic route
          className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 border border-indigo-600 px-3 py-1.5 rounded-full transition"
        >
          <Eye size={16} />
          View
        </Link>
      </div>
    </div>
  );
}
