import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userContext, username_context } from '../../App';
import useFetch from '../hook/Usefetch';
import {
  ArrowLeftRight,
  LogIn,
  LogOut,
  Menu,
  Home,
  Users,
  UserRound,
  Mail,
  Bell,
  Search
} from 'lucide-react';

type skill_type = {
  skill_id: string;
  name: string;
  description: string;
};

export default function Nav() {
  const [downdrop, setdowndrop] = useState(false);
  const { user_id } = useContext(username_context);
  const { selectedSkill, setSelectedSkill, setSearchPerson } = useContext(userContext);
  const navigator = useNavigate();
  const [skilllist, setskill] = useState<skill_type[]>([]);
  const { data } = useFetch({ url: 'https://skill-api.penneithendral.workers.dev/getskills' });

  useEffect(() => {
    setskill(data?.results);
  }, [data]);

  const profilePic = `https://api.dicebear.com/6.x/thumbs/svg?seed=${user_id}`;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Logo + Menu */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
  <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-xl">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
      />
    </svg>
  </div>
  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">SkillConnect</h1>
</div>

          <div className="md:hidden">
            <button onClick={() => setdowndrop(!downdrop)}>
              <Menu />
            </button>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search people..."
              className="w-full border border-gray-300 rounded-full pl-10 pr-3 py-1 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setSearchPerson(e.target.value)}
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <select
            className="border border-gray-300 rounded-full px-3 py-1 text-sm text-gray-700 focus:outline-none"
            value={selectedSkill}
            onChange={event => setSelectedSkill(event.target.value)}
          >
            <option value="">All Skills</option>
            {skilllist?.map(skill => (
              <option key={skill.skill_id} value={skill.name}>
                {skill.name}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop Nav Items */}
        <ul className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-700">
          <li><Link className="hover:text-indigo-600 flex items-center gap-1" to="/"><Home size={16} />Home</Link></li>
          <li><Link className="hover:text-indigo-600 flex items-center gap-1" to="/req"><Mail size={16} />Requests</Link></li>
          <li><Link className="hover:text-indigo-600 flex items-center gap-1" to="/friendlist"><Users size={16} />Friends</Link></li>
          <li><Link className="hover:text-indigo-600 flex items-center gap-1" to="/profile"><UserRound size={16} />Profile</Link></li>
          <li>
            <button className="relative text-gray-600 hover:text-indigo-600">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">2</span>
            </button>
          </li>
          <li>
            {user_id.length === 0 ? (
              <button onClick={() => navigator('/auth')} className="hover:text-indigo-600">
                <LogIn size={20} />
              </button>
            ) : (
              <button onClick={() => { localStorage.removeItem('user_id'); navigator('/auth'); }} className="hover:text-indigo-600">
                <LogOut size={20} />
              </button>
            )}
          </li>
          <li>
            <img
              src={profilePic}
              alt="Avatar"
              className="w-8 h-8 rounded-full border-2 border-indigo-500"
            />
          </li>
        </ul>

        {/* Mobile Dropdown */}
        {downdrop && (
          <div className="md:hidden w-full mt-2 bg-white shadow rounded-lg p-2 space-y-2 text-sm text-gray-700">
            <Link to="/" className="block px-2 py-1 hover:bg-gray-100 flex items-center gap-1"><Home size={16} />Home</Link>
            <Link to="/req" className="block px-2 py-1 hover:bg-gray-100 flex items-center gap-1"><Mail size={16} />Requests</Link>
            <Link to="/friendlist" className="block px-2 py-1 hover:bg-gray-100 flex items-center gap-1"><Users size={16} />Friends</Link>
            <Link to="/profile" className="block px-2 py-1 hover:bg-gray-100 flex items-center gap-1"><UserRound size={16} />Profile</Link>
            {user_id.length === 0 ? (
              <button onClick={() => navigator('/auth')} className="w-full text-left px-2 py-1 hover:bg-gray-100">
                <LogIn size={18} className="inline mr-2" /> Login
              </button>
            ) : (
              <button onClick={() => { localStorage.removeItem('user_id'); navigator('/auth'); }} className="w-full text-left px-2 py-1 hover:bg-gray-100">
                <LogOut size={18} className="inline mr-2" /> Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
