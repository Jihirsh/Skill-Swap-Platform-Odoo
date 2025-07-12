import React, { useState, useContext } from 'react';
import { PersonDetailsProps, sendRequest } from '../../schema structure/Schema';
import { username_context } from '../../App';
import { CircleUser } from 'lucide-react';

export default function PersonDetails({ name, rating, skills, skill_id, receiver_id }: PersonDetailsProps) {
  const { user_id } = useContext(username_context);
  const [msgstatus, setMsgStatus] = useState(true);
  const [msg, setMsg] = useState('');
  const [disabled, setDisabled] = useState(true);

  const senddata: sendRequest = {
    user_id,
    receiver_id,
    skills,
    skill_id,
    message: msg,
  };

  function sendRequestfun() {
    if (senddata.message.trim() === '') {
      alert('Message cannot be empty');
      return;
    }

    setDisabled(false);
    fetch('https://skill-api.penneithendral.workers.dev/requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(senddata)
    });
  }

  return (
    <div className="bg-gray-100 border border-gray-300 rounded-2xl w-72 p-5 flex flex-col gap-4 shadow-2xl hover:shadow-indigo-300 transition-all duration-300">
      <div className="flex justify-center">
        <CircleUser size={50} className="text-indigo-600" />
      </div>

      <div className="text-center space-y-2">
        <p className="font-semibold text-lg text-gray-900">{name}</p>
        <p className="text-sm text-gray-700">⭐ Rating: {rating || 'Newbie'}</p>
        <p className="text-sm text-gray-800">
          🛠 <span className="text-indigo-700 font-medium">{skills}</span>
        </p>
      </div>

      <div>
        {msgstatus ? (
          <button
            onClick={() => setMsgStatus(false)}
            className="w-full text-sm text-indigo-600 hover:text-white border border-indigo-500 hover:bg-indigo-600 rounded-full py-1 transition"
          >
            Send Message
          </button>
        ) : (
          disabled ? (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Type a message"
                onChange={(e) => setMsg(e.target.value)}
                className="border border-gray-300 px-3 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <div className="flex gap-2 justify-between">
                <button
                  onClick={sendRequestfun}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-full px-3 py-1 text-sm"
                >
                  Send
                </button>
                <button
                  onClick={() => setMsgStatus(true)}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white rounded-full px-3 py-1 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center text-sm text-green-600 font-medium">Request Sent ✅</p>
          )
        )}
      </div>
    </div>
  );
}
