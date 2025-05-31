const UserProfile = () => {
  const [profile, setProfile] = useState({
    name: 'Sarsar Longanilla',
    email: 'sarsaryuki@gmail.com',
    phone: '09518090350',
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow rounded-xl p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-700">Update Profile</h2>

      <input name="name" value={profile.name} onChange={handleChange} className="w-full border p-2 rounded-lg" />
      <input name="email" value={profile.email} onChange={handleChange} className="w-full border p-2 rounded-lg" />
      <input name="phone" value={profile.phone} onChange={handleChange} className="w-full border p-2 rounded-lg" />

      <button className="bg-yellow-600 hover:bg-yellow-700 text-white w-full py-2 px-4 rounded-lg">
        Save Changes
      </button>
    </div>
  );
};
