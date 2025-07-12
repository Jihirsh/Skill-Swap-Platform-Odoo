import { CircleUser, X, SendHorizontal, Pencil } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import useFetch from '../hook/Usefetch';
import { username_context } from '../../App';
import { useNavigate } from 'react-router-dom';


type skill_type = {
  user_name: string;
  skill_name: string,
};

export default function Profile() {
  const nav = useNavigate();
  const { user_id } = React.useContext(username_context);

  const { data } = useFetch({ url: `https://skill-api.penneithendral.workers.dev/getskills/${user_id}` });

  const [user_name, setName] = useState('');
  const [user_email, setEmail] = useState(localStorage.getItem('email') || '');
  const [user_bio, setBio] = useState(localStorage.getItem('bio') || '');
  const [user_experience, setExperience] = useState(localStorage.getItem('experience') || '');
  const [user_education, setEducation] = useState(localStorage.getItem('education') || '');

  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editBio, setEditBio] = useState(false);
  const [editExp, setEditExp] = useState(false);
  const [editEdu, setEditEdu] = useState(false);

  const [userSkill, setUserSkill] = useState('');
  const [skillList, setSkillList] = useState<string[]>([]);
  const [avatar, setAvatar] = useState<string | null>(localStorage.getItem('avatar'));

  useEffect(() => {
    if (data?.results?.length > 0) {
      setSkillList(data.results.map((skill: skill_type) => skill.skill_name));
      setName(data.results[0]?.user_name);
    }
  }, [data]);

  function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setAvatar(base64);
        localStorage.setItem('avatar', base64);
      };
      reader.readAsDataURL(file);
    }
  }

  function addSkill(skill: string) {
    const temp = skill
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    if (!skillList.includes(temp)) {
      setSkillList([...skillList, temp]);
      fetch('https://skill-api.penneithendral.workers.dev/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: temp, user_id }),
      });
    }
    setUserSkill('');
  }

  function deleteSkill(skill: string) {
    const confirmDelete = window.confirm(`Are you sure you want to remove "${skill}"?`);
    if (!confirmDelete) return;

    setSkillList(skillList.filter(s => s !== skill));
    fetch('https://skill-api.penneithendral.workers.dev/skills', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: skill, user_id }),
    });
  }

  const saveEmail = () => {
    localStorage.setItem('email', user_email);
    setEditEmail(false);
  };

  const saveBio = () => {
    localStorage.setItem('bio', user_bio);
    setEditBio(false);
  };

  const saveExperience = () => {
    localStorage.setItem('experience', user_experience);
    setEditExp(false);
  };

  const saveEducation = () => {
    localStorage.setItem('education', user_education);
    setEditEdu(false);
  };

  return (
    <div className="bg-gradient-to-b from-indigo-100 to-white min-h-screen py-8 px-4 flex justify-center">
      <div className="bg-white w-full max-w-3xl shadow-2xl rounded-3xl p-8 flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-indigo-800">Your Profile</h2>
          <button className="p-2 rounded-full hover:bg-gray-200 transition" onClick={() => nav(-1)}>
            <X className="text-gray-600" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-3">
          {avatar ? (
            <img
              src={avatar}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-indigo-400 object-cover shadow-md"
            />
          ) : (
            <CircleUser size={100} className="text-indigo-500" />
          )}
          <label className="text-sm text-indigo-600 underline cursor-pointer hover:text-indigo-800">
            <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            Upload / Change Photo
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800 px-3">
          <div>
            <label className="font-semibold text-sm text-gray-500">User ID</label>
            <div className="mt-1 text-base break-all">{user_id}</div>
          </div>

          <div>
            <label className="font-semibold text-sm text-gray-500">Username</label>
            <div className="flex items-center gap-2 mt-1">
              {editName ? (
                <>
                  <input
                    className="border rounded px-2 py-1 w-full"
                    value={user_name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <button onClick={() => setEditName(false)} className="text-indigo-600 text-sm font-medium">Save</button>
                </>
              ) : (
                <>
                  <span>{user_name}</span>
                  <Pencil size={16} className="cursor-pointer text-gray-400" onClick={() => setEditName(true)} />
                </>
              )}
            </div>
          </div>

          <div>
            <label className="font-semibold text-sm text-gray-500">Email</label>
            <div className="flex items-center gap-2 mt-1">
              {editEmail ? (
                <>
                  <input
                    type="email"
                    className="border rounded px-2 py-1 w-full"
                    value={user_email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button onClick={saveEmail} className="text-indigo-600 text-sm font-medium">Save</button>
                </>
              ) : (
                <>
                  <span>{user_email || <i className="text-gray-400">Not set</i>}</span>
                  <Pencil size={16} className="cursor-pointer text-gray-400" onClick={() => setEditEmail(true)} />
                </>
              )}
            </div>
          </div>

          <div>
            <label className="font-semibold text-sm text-gray-500">Bio</label>
            <div className="flex items-start gap-2 mt-1">
              {editBio ? (
                <>
                  <textarea
                    className="border rounded px-2 py-1 w-full"
                    value={user_bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                  <button onClick={saveBio} className="text-indigo-600 text-sm font-medium">Save</button>
                </>
              ) : (
                <>
                  <span>{user_bio || <i className="text-gray-400">You haven’t written a bio yet.</i>}</span>
                  <Pencil size={16} className="cursor-pointer text-gray-400" onClick={() => setEditBio(true)} />
                </>
              )}
            </div>
          </div>

          <div>
            <label className="font-semibold text-sm text-gray-500">Experience</label>
            <div className="flex items-start gap-2 mt-1">
              {editExp ? (
                <>
                  <textarea
                    className="border rounded px-2 py-1 w-full"
                    value={user_experience}
                    onChange={(e) => setExperience(e.target.value)}
                  />
                  <button onClick={saveExperience} className="text-indigo-600 text-sm font-medium">Save</button>
                </>
              ) : (
                <>
                  <span>{user_experience || <i className="text-gray-400">Add your work experience.</i>}</span>
                  <Pencil size={16} className="cursor-pointer text-gray-400" onClick={() => setEditExp(true)} />
                </>
              )}
            </div>
          </div>

          <div>
            <label className="font-semibold text-sm text-gray-500">Education</label>
            <div className="flex items-start gap-2 mt-1">
              {editEdu ? (
                <>
                  <textarea
                    className="border rounded px-2 py-1 w-full"
                    value={user_education}
                    onChange={(e) => setEducation(e.target.value)}
                  />
                  <button onClick={saveEducation} className="text-indigo-600 text-sm font-medium">Save</button>
                </>
              ) : (
                <>
                  <span>{user_education || <i className="text-gray-400">Mention your academic background.</i>}</span>
                  <Pencil size={16} className="cursor-pointer text-gray-400" onClick={() => setEditEdu(true)} />
                </>
              )}
            </div>
          </div>
        </div>

        <div className="px-3 flex flex-col gap-4">
          <h3 className="text-xl font-bold text-indigo-700">Your Skills</h3>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={userSkill}
              onChange={(e) => setUserSkill(e.target.value)}
              className="bg-gray-100 border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-indigo-500"
              placeholder="Add a skill"
            />
            <button
              onClick={() => addSkill(userSkill)}
              className="bg-indigo-500 text-white p-2 rounded-full hover:bg-indigo-600 transition"
            >
              <SendHorizontal size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 px-3">
          {skillList.length === 0 && (
            <p className="text-gray-500 italic">You haven’t added any skills yet.</p>
          )}
          {skillList.map((skill, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-indigo-100 text-indigo-800 font-medium px-4 py-2 rounded-full shadow-sm hover:bg-indigo-200 transition"
            >
              {skill}
              <button
                onClick={() => deleteSkill(skill)}
                className="text-red-500 text-xs hover:underline"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
