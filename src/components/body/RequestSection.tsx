import React, { useState } from 'react';
import { Requsetrecived } from '../../schema structure/Schema';
import { username_context } from '../../App';
import useFetch from '../hook/Usefetch';
import Loader from '../Loader/Loader';
import { CircleUser } from 'lucide-react';

export default function RequestSection() {
  const { user_id } = React.useContext(username_context);
  const { data, loading } = useFetch({ url: `https://skill-api.penneithendral.workers.dev/requests/${user_id}` });

  const [acceptedIds, setAcceptedIds] = useState<string[]>([]);
  const [tab, setTab] = useState<'pending' | 'accepted'>('pending');

  const handleResponse = (id: string, accepted: boolean) => {
    if (accepted) setAcceptedIds((prev) => [...prev, id]);
  };

  const requests = data?.results || [];
  const pending = requests.filter((r: Requsetrecived) => !acceptedIds.includes(r.skill_id));
  const accepted = requests.filter((r: Requsetrecived) => acceptedIds.includes(r.skill_id));

  const renderCard = (r: Requsetrecived, isAccepted: boolean) => (
    <div key={r.skill_id} className="bg-white border border-gray-300 shadow-md rounded-xl w-80 p-5 flex flex-col gap-3 hover:shadow-indigo-300 transition-all">
      <div className="flex justify-center">
        <CircleUser size={48} className="text-indigo-600" />
      </div>
      <div className="text-center space-y-1">
        <h2 className="font-bold text-lg text-gray-800">{r.requester_name}</h2>
        <p className="text-sm text-gray-600">Skill: <span className="text-indigo-600">{r.requester_skills}</span></p>
        <p className="text-sm italic text-gray-500">"{r.message || 'No message provided'}"</p>
      </div>
      {!isAccepted && (
        <div className="flex justify-around mt-2">
          <button
            className="bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600"
            onClick={() => handleResponse(r.skill_id, true)}
          >
            Accept
          </button>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600"
            onClick={() => handleResponse(r.skill_id, false)}
          >
            Reject
          </button>
        </div>
      )}
      {isAccepted && (
        <div className="text-center text-green-600 font-semibold">Accepted ✅</div>
      )}
    </div>
  );

  return (
    <div className="w-full p-5">
      <h2 className="text-2xl font-bold text-white text-center mb-5">Requests</h2>

      <div className="flex justify-center gap-4 mb-5">
        <button
          className={`px-4 py-2 rounded-full ${tab === 'pending' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setTab('pending')}
        >
          Pending
        </button>
        <button
          className={`px-4 py-2 rounded-full ${tab === 'accepted' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setTab('accepted')}
        >
          Accepted
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center h-screen items-center"><Loader /></div>
      ) : (
        <div className="flex flex-wrap gap-6 justify-center">
          {(tab === 'pending' ? pending : accepted).map((r: Requsetrecived) =>
            renderCard(r, tab === 'accepted')
          )}
        </div>
      )}
    </div>
  );
}
