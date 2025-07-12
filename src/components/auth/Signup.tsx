import React, { useState, useContext } from 'react';
import { Signin } from '../../schema structure/Schema';
import Errorpop from '../Errorpop/Errorpop';
import { username_context } from '../../App';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const { setuser_id } = useContext(username_context);

  const [signindata, setSigndata] = useState<Signin>({
    username: '',
    email: '',
    password: '',
  });

  const [err, setError] = useState(false);
  const [errormsg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const api = async () => {
    const { username, email, password } = signindata;

    if (!username || !email || !password) {
      setMsg('All fields are required.');
      setError(true);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('https://skill-api.penneithendral.workers.dev/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signindata),
      });

      const data = await res.json();

      if (data?.error) {
        setError(true);
        setMsg(data.error);
      } else if (data?.message) {
        setuser_id(data.random_id);
        localStorage.setItem('user_id', JSON.stringify(data.random_id));
        navigate('/');
      }
    } catch (error: any) {
      setError(true);
      setMsg(error.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleErrorClose = (err: boolean) => setError(err);

  return (
    <>
      {err && <Errorpop err={errormsg} open={err} changencomponent={handleErrorClose} />}

      <div className="w-full bg-white p-0">
        <h2 className="text-2xl font-semibold text-indigo-600 text-center mb-6">
          Create an Account
        </h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={signindata.username}
              onChange={e => setSigndata({ ...signindata, username: e.target.value })}
              placeholder="Your username"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={signindata.email}
              onChange={e => setSigndata({ ...signindata, email: e.target.value })}
              placeholder="example@domain.com"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={signindata.password}
                onChange={e => setSigndata({ ...signindata, password: e.target.value })}
                placeholder="Enter a secure password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            onClick={api}
            disabled={loading}
            className={`w-full py-2 rounded-md text-white transition ${
              loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </div>
      </div>
    </>
  );
}
