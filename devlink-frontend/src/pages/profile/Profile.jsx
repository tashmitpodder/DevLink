import { useEffect, useState } from "react";
import { useAuth } from "../../store/auth";
import { apiRequest } from "../../utils/api";

const uploadImage = async (file) => {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", "devlink");
  const res = await fetch("https://api.cloudinary.com/v1_1/dywgao1yc/image/upload", { method: "POST", body: fd });
  return (await res.json()).secure_url;
};

function SkillChip({ label }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
      bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300
      border border-gray-200 dark:border-white/10">
      {label}
    </span>
  );
}

export default function Profile() {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState({ bio: "", skills: "", github: "", linkedin: "", location: "", avatar: "", banner: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await apiRequest("/profile", "GET", null, token);
      setProfile({
        bio: data.bio || "", skills: data.skills?.join(", ") || "",
        github: data.github || "", linkedin: data.linkedin || "",
        location: data.location || "", avatar: data.avatar || "", banner: data.banner || "",
      });
    };
    if (token) fetchProfile();
  }, [token]);

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    let avatarUrl = profile.avatar;
    let bannerUrl = profile.banner;
    if (avatarFile) avatarUrl = await uploadImage(avatarFile);
    if (bannerFile) bannerUrl = await uploadImage(bannerFile);
    const updates = { ...profile, avatar: avatarUrl, banner: bannerUrl, skills: profile.skills.split(",").map((s) => s.trim()).filter(Boolean) };
    await apiRequest("/profile", "PUT", updates, token);
    setProfile({ ...profile, avatar: avatarUrl, banner: bannerUrl });
    setAvatarFile(null); setBannerFile(null);
    setSaving(false); setIsEditing(false);
    setSaveMsg("Profile saved!");
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const initials = (user?.name || "U").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const skillList = profile.skills.split(",").map((s) => s.trim()).filter(Boolean);

  const EDIT_FIELDS = [
    { name: "bio", label: "Bio", type: "area", placeholder: "Tell the world about you…" },
    { name: "skills", label: "Skills", type: "text", placeholder: "React, Node, Python…" },
    { name: "location", label: "Location", type: "text", placeholder: "City, Country" },
    { name: "github", label: "GitHub URL", type: "text", placeholder: "https://github.com/you" },
    { name: "linkedin", label: "LinkedIn URL", type: "text", placeholder: "https://linkedin.com/in/you" },
  ];

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gray-50 dark:bg-surface py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">

        {/* Save toast */}
        {saveMsg && (
          <div className="fixed top-20 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium
            bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-lg animate-fade-in">
            ✓ {saveMsg}
          </div>
        )}

        {/* Profile card */}
        <div className="card overflow-hidden">
          {/* Banner — dark monochrome */}
          <div className="h-36 relative bg-zinc-900 dark:bg-black">
            {profile.banner && (
              <img src={profile.banner} alt="Banner" className="w-full h-full object-cover absolute inset-0" />
            )}
            <div className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
                backgroundSize: "30px 30px",
              }}
            />
            {isEditing && (
              <label className="absolute top-3 right-3 cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium
                bg-black/50 text-white border border-white/20 hover:bg-black/70 transition">
                Change Banner
                <input type="file" className="hidden" accept="image/*" onChange={(e) => setBannerFile(e.target.files[0])} />
              </label>
            )}
          </div>

          {/* Avatar + info */}
          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-10 mb-4">
              <div className="relative">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Avatar"
                    className="w-20 h-20 rounded-full border-4 border-white dark:border-surface-card object-cover" />
                ) : (
                  <div className="avatar w-20 h-20 text-2xl border-4 border-white dark:border-surface-card">
                    {initials}
                  </div>
                )}
                {isEditing && (
                  <label className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900
                    flex items-center justify-center cursor-pointer text-xs hover:opacity-80 transition">
                    +
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => setAvatarFile(e.target.files[0])} />
                  </label>
                )}
              </div>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="btn-secondary text-sm">✏️ Edit Profile</button>
              )}
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
            {profile.bio ? (
              <p className="text-sm text-gray-400 mt-1 leading-relaxed">{profile.bio}</p>
            ) : (
              <p className="text-sm text-gray-400 italic mt-1">No bio yet</p>
            )}
            {profile.location && (
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">📍 {profile.location}</p>
            )}

            {/* Social links */}
            <div className="flex gap-3 mt-3">
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </a>
              )}
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
              )}
            </div>

            {/* Skills */}
            {skillList.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {skillList.map((s, i) => <SkillChip key={i} label={s} />)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Edit form */}
        {isEditing && (
          <div className="card p-6 space-y-4 animate-slide-up">
            <h3 className="font-semibold text-gray-900 dark:text-white">Edit Profile</h3>
            {EDIT_FIELDS.map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
                {type === "area" ? (
                  <textarea name={name} value={profile[name]} onChange={handleChange} placeholder={placeholder} className="textarea-base" rows={3} />
                ) : (
                  <input name={name} value={profile[name]} onChange={handleChange} placeholder={placeholder} className="input-base" />
                )}
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center">
                {saving ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Saving…
                  </span>
                ) : "Save Changes"}
              </button>
              <button onClick={() => setIsEditing(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
