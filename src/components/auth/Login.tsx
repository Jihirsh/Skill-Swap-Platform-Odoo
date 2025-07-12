import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { username_context } from '../../App';
import Errorpop from '../Errorpop/Errorpop';
import { Eye, EyeOff } from 'lucide-react';

type Login = {
  emailOrUsername: string;
  password: string;
};

export default function Login() {
  const [login, setLogin] = useState<Login>({ emailOrUsername: '', password: '' });
  const [err, setError] = useState(false);
  const [errorMsg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { setuser_id } = useContext(username_context);
  const navigate = useNavigate();

  const apiLogin = async () => {
    if (!login.emailOrUsername || !login.password) {
      setMsg('All fields are required.');
      setError(true);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('https://skill-api.penneithendral.workers.dev/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(login),
      });

      const data = await res.json();

      if (data.isCorrectPassword) {
        setuser_id(data.username);
        localStorage.setItem('user_id', data.username);
        navigate('/');
      } else {
        setMsg('Incorrect username or password');
        setError(true);
      }
    } catch (err) {
      setMsg('Server error. Please try again later.');
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {err && <Errorpop err={errorMsg} open={err} changencomponent={() => setError(false)} />}

      <div className="w-full bg-white p-0">
        <h2 className="text-2xl font-semibold text-indigo-600 text-center mb-6">
          Login to <span className="text-gray-900">SkillSwap</span>
        </h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username or Email
            </label>
            <input
              type="text"
              value={login.emailOrUsername}
              placeholder="Enter your username or email"
              onChange={e => setLogin({ ...login, emailOrUsername: e.target.value })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={login.password}
                placeholder="Enter your password"
                onChange={e => setLogin({ ...login, password: e.target.value })}
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
            onClick={apiLogin}
            disabled={loading}
            className={`w-full py-2 rounded-md text-white transition ${
              loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </div>
    </>
  );
}
