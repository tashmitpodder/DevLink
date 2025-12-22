import { useEffect, useState } from "react";
import { useAuth } from "../../store/auth";
import { apiRequest } from "../../utils/api";

/* ---------- Image Upload Helper (Cloudinary) ---------- */
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "devlink"); // ⚠️ change if needed

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dywgao1yc/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  return data.secure_url;
};

export default function Profile() {
  const { user, token } = useAuth();

  const [profile, setProfile] = useState({
    bio: "",
    skills: "",
    github: "",
    linkedin: "",
    location: "",
    avatar: "",
    banner: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  /* ---------- Fetch Profile ---------- */
  useEffect(() => {
    const fetchProfile = async () => {
      const data = await apiRequest("/api/profile", "GET", null, token);
      setProfile({
        bio: data.bio || "",
        skills: data.skills?.join(", ") || "",
        github: data.github || "",
        linkedin: data.linkedin || "",
        location: data.location || "",
        avatar: data.avatar || "",
        banner: data.banner || "",
      });
    };
    fetchProfile();
  }, [token]);

  /* ---------- Handlers ---------- */
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    let avatarUrl = profile.avatar;
    let bannerUrl = profile.banner;

    if (avatarFile) avatarUrl = await uploadImage(avatarFile);
    if (bannerFile) bannerUrl = await uploadImage(bannerFile);

    const updates = {
      ...profile,
      avatar: avatarUrl,
      banner: bannerUrl,
      skills: profile.skills.split(",").map((s) => s.trim()),
    };

    await apiRequest("/profile", "PUT", updates, token);
    setIsEditing(false);
    alert("Profile updated ✅");
  };

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d1117] py-10">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* ===== PROFILE HEADER ===== */}
        <div className="card overflow-hidden">

          {/* Banner */}
          <div className="h-36 relative bg-gray-300 dark:bg-[#1f2937]">
            {profile.banner && (
              <img
                src={profile.banner}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            )}

            {isEditing && (
              <input
                type="file"
                className="absolute top-2 right-2 text-xs"
                onChange={(e) => setBannerFile(e.target.files[0])}
              />
            )}

            {/* Avatar */}
            <div className="absolute -bottom-12 left-6">
              <div className="relative">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full border-4 border-white dark:border-[#161b22] object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 border-white dark:border-[#161b22] bg-gray-200 flex items-center justify-center text-2xl font-bold">
                    {user?.name?.[0]}
                  </div>
                )}

                {isEditing && (
                  <input
                    type="file"
                    className="absolute bottom-0 right-0 text-xs"
                    onChange={(e) => setAvatarFile(e.target.files[0])}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="pt-16 px-6 pb-6">
            <h2 className="text-xl font-semibold">
              {user?.name}
            </h2>

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {profile.bio || "Add a short bio"}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              📍 {profile.location || "Location not set"}
            </p>

            <div className="flex gap-4 mt-3 text-sm">
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  GitHub
                </a>
              )}
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  LinkedIn
                </a>
              )}
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 px-4 py-2 border rounded-lg text-sm"
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* ===== EDIT SECTION ===== */}
        {isEditing && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">
              Edit Profile
            </h3>

            {["bio", "skills", "github", "linkedin", "location"].map((field) => (
              <div key={field} className="mb-4">
                <label className="block text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {field}
                </label>
                <input
                  name={field}
                  value={profile[field]}
                  onChange={handleChange}
                  className="w-full border dark:border-[#30363d] bg-transparent p-2 rounded-lg mt-1"
                />
              </div>
            ))}

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 bg-blue-600 text-white p-3 rounded-lg"
              >
                Save
              </button>

              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 border p-3 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
