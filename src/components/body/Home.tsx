import React, { useEffect } from 'react';
import { userContext, username_context } from '../../App';
import Chart from './Chart';
import useFetch from '../hook/Usefetch';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader';

export default function Home() {
  const nav = useNavigate();
  const { user_id } = React.useContext(username_context);
  const { Persons, filterPerson, setPersons } = React.useContext(userContext);
  const { data, loading, error } = useFetch({ url: `https://skill-api.penneithendral.workers.dev/user_skills/${user_id}` });

  useEffect(() => {
    setPersons(data?.results);
  }, [data]);

  if (error) {
    nav('/auth');
    return null;
  }

  return (
    <div className="min-h-screen px-4 py-6 bg-white">
      <h2 className="text-center text-3xl font-semibold text-indigo-700 mb-8">
        Discover People by Skills
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filterPerson?.map((person) => (
            <Chart
              key={person.user_id}
              name={person.username}
              rating={person.rating}
              skills={person.skill_name}
              skill_id={person.skill_id}
              receiver_id={person.user_id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
