"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { 
  User, LogOut, ShieldCheck, Mail, Phone, Loader2, 
  Camera, Bell, Lock, ShieldAlert, ArrowLeft, CheckCircle, AlertTriangle, Info, XCircle, CheckCheck
} from "lucide-react";
import NavBar from "../navbar";
import { NAV_LINKS } from "../navbar";
import { useAuth } from "@/app/[locale]/context/auth-context"; 
import { useNotifications, ToastType } from "../CustomHooks/useNotifications";
import { formatDistanceToNow } from "date-fns"; // adjust relative path to match your folder structure

const ALL_ROLES = [
  { id: "investor", label: "Investor" },
  { id: "farmers", label: "Farmer" },
  { id: "landowner", label: "Landowner" },
  { id: "agronomist", label: "Agronomist" },
];

const COUNTRY_FLAGS: Record<string, string> = {
  "USA": "🇺🇸",
  "UK": "🇬🇧",
  "CA": "🇨🇦",
  "AU": "🇦🇺",
  "IN": "🇮🇳",
  "DE": "🇩🇪",
  "FR": "🇫🇷",
  "ES": "🇪🇸",
  "BR": "🇧🇷",
  "JP": "🇯🇵",
};


export default function AccountSettingsPage() {
  const router = useRouter();
  const { user, setUser, loading } = useAuth();
  
  const [activeTab, setActiveTab] = useState("profile");
  
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    id_number: "",
    tax_id: "",
    tax_country: "",
    address: "",
    preferred_language: "en",

    // Single access role — a user has exactly one at a time
    role: "investor",
  });
  const [saveLoading, setSaveLoading] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'error' | 'success', message: string } | null>(null);

  const { notifications, unreadCount, markAsRead, markAllAsRead, addToast } = useNotifications();

  // Redirect unauthenticated users once the shared auth state has settled
  useEffect(() => {
    if (!loading && !user) {
      router.push("/en/login");
    }
  }, [loading, user, router]);

  // Populate the edit form whenever the shared user record changes
  // (initial load, or right after a save elsewhere updates context)
  useEffect(() => {
    if (!user) return;

    const names = (user.name || "").split(" ");
    const firstName = names[0] || "";
    const lastName = names.slice(1).join(" ") || "";

    setEditForm({
      firstName,
      lastName,
      email: user.email || "",
      phone: user.phone || "",
      gender: user.gender || "male",
      id_number: user.id_number || "",
      tax_id: user.tax_id || "",
      tax_country: user.tax_country || "USA",
      address: user.address || "",
      preferred_language: user.preferred_language || "en",
      role: user.role || "investor",
    });
  }, [user]);

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      const payload = {
        name: `${editForm.firstName} ${editForm.lastName}`.trim(),
        phone: editForm.phone,
        preferred_language: editForm.preferred_language,
        gender: editForm.gender,
        id_number: editForm.id_number,
        tax_id: editForm.tax_id,
        tax_country: editForm.tax_country,
        address: editForm.address,
        role: editForm.role,
      };
      const res = await fetch("/api/auth/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        // Push the saved values into the shared auth context immediately —
        // NavBar reads from the same context, so it updates on this same click.
        setUser((prev: any) => ({
          ...prev,
          name: payload.name,
          phone: payload.phone,
          preferred_language: payload.preferred_language,
          gender: payload.gender,
          id_number: payload.id_number,
          tax_id: payload.tax_id,
          tax_country: payload.tax_country,
          address: payload.address,
          role: payload.role,
        }));

        addToast("Profile settings saved successfully!", "success");

        if (user.preferred_language !== editForm.preferred_language) {
          const currentPath = window.location.pathname;
          const segments = currentPath.split('/');
          if (segments.length > 1) {
            segments[1] = editForm.preferred_language;
            window.location.href = segments.join('/');
          } else {
            window.location.href = `/${editForm.preferred_language}/profile`;
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaveLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ type: 'error', message: "New passwords do not match." });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordStatus({ type: 'error', message: "New password must be at least 8 characters long." });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await res.json();
      if (res.ok) {
        setPasswordStatus({ type: 'success', message: "Password updated successfully!" });
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        addToast("Your password was updated securely.", "success");
      } else {
        setPasswordStatus({ type: 'error', message: data.error || "Failed to update password." });
        addToast(data.error || "Failed to update password.", "error");
      }
    } catch (err) {
      setPasswordStatus({ type: 'error', message: "An unexpected error occurred." });
      addToast("An unexpected error occurred.", "error");
    } finally {
      setPasswordLoading(false);
    }
  };

  const getNotificationIcon = (type: ToastType) => {
    switch (type) {
      case "success": return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error": return <XCircle className="w-5 h-5 text-red-500" />;
      case "warning": return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "info":
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9f2] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#c8e639] animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  function handleKYC() { router.push('/en/profile/KYC'); }


  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans selection:bg-[#c8e639] selection:text-black">
      <NavBar />
      
      <div className="max-w-6xl mx-auto px-6 py-10">
        
        <div className="mb-6 flex items-center gap-4">
          <Link href="/en/Wallet" className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-500 hover:text-[#1b2620] transition-colors">
             <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-extrabold text-[#1b2620]">Account settings</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          
          <div className="w-full md:w-64 bg-white rounded-xl shadow-sm overflow-hidden shrink-0 py-2">
            <button 
              onClick={() => setActiveTab("profile")}
              className={`w-full text-left px-6 py-4 flex items-center gap-3 text-sm font-bold transition-colors ${activeTab === 'profile' ? 'bg-[#f7f9f2] text-[#1b2620] border-r-4 border-[#1b2620]' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <User size={18} /> Profile Settings
            </button>
            <button 
              onClick={() => setActiveTab("password")}
              className={`w-full text-left px-6 py-4 flex items-center gap-3 text-sm font-bold transition-colors ${activeTab === 'password' ? 'bg-[#f7f9f2] text-[#1b2620] border-r-4 border-[#1b2620]' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <Lock size={18} /> Password
            </button>
            <button 
              onClick={() => setActiveTab("notifications")}
              className={`w-full text-left px-6 py-4 flex items-center justify-between transition-colors ${activeTab === 'notifications' ? 'bg-[#f7f9f2] text-[#1b2620] border-r-4 border-[#1b2620]' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3 text-sm font-bold">
                <Bell size={18} /> Notifications
              </div>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab("verification")}
              className={`w-full text-left px-6 py-4 flex items-center justify-between transition-colors ${activeTab === 'verification' ? 'bg-[#f7f9f2] text-[#1b2620] border-r-4 border-[#1b2620]' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3 text-sm font-bold">
                <ShieldCheck size={18} /> Verification
              </div>
              {!user.kyc?.verified && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              )}
            </button>
          </div>

          <div className="flex-1 bg-white rounded-xl shadow-sm p-8 w-full min-h-[600px]">
            {activeTab === "profile" && (
              <div className="animate-in fade-in duration-300">
                
                <div className="flex items-center gap-6 mb-10">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-[#1b2620] flex items-center justify-center text-4xl font-extrabold text-[#c8e639] border-4 border-[#f7f9f2] shadow-sm">
                      {user.name.substring(0, 1)}
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#1b2620] text-white flex items-center justify-center border-2 border-white shadow-md hover:bg-[#0a0f0c] transition-colors">
                      <Camera size={14} />
                    </button>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <button className="bg-[#1b2620] text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#0a0f0c] transition-colors shadow-sm">Upload New</button>
                      <button className="bg-gray-100 text-gray-600 px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors">Delete avatar</button>
                    </div>
                    <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 w-max">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-gray-400">Reputation</span>
                        <span className="text-lg font-black text-[#1b2620]">{user.reputation || 0}</span>
                      </div>
                      <div className="w-px h-8 bg-gray-200"></div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-gray-400">Trust Score</span>
                        <span className="text-lg font-black text-[#1b2620]">{user.trust_value || 50}/100</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">First Name <span className="text-red-500">*</span></label>
                    <input type="text" value={editForm.firstName} onChange={e => setEditForm({...editForm, firstName: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm font-bold text-[#1b2620] bg-[#f7f9f2]/50 focus:outline-none focus:border-[#1b2620] transition-colors" placeholder="First name" />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Last Name <span className="text-red-500">*</span></label>
                    <input type="text" value={editForm.lastName} onChange={e => setEditForm({...editForm, lastName: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm font-bold text-[#1b2620] focus:outline-none focus:border-[#1b2620] transition-colors" placeholder="Last name" />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Email</label>
                    <input type="email" disabled value={editForm.email} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm font-bold text-gray-500 bg-gray-50 cursor-not-allowed" placeholder="examples@gmail.com" />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Mobile Number <span className="text-red-500">*</span></label>
                    <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#1b2620] transition-colors">
                      <div className="bg-gray-50 px-3 py-3 border-r border-gray-300 flex items-center justify-center min-w-[50px]">
                        <span className="text-sm font-bold">{COUNTRY_FLAGS[editForm.tax_country] || "🌐"} ▾</span>
                      </div>
                      <input type="text" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="flex-1 px-4 py-3 text-sm font-bold text-[#1b2620] outline-none" placeholder="0806 123 7890" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Gender</label>
                    <div className="flex gap-4">
                      <label className={`flex-1 flex items-center gap-3 border ${editForm.gender === 'male' ? 'border-[#1b2620] bg-[#f7f9f2]' : 'border-gray-300'} rounded-lg px-4 py-3 cursor-pointer transition-colors`}>
                        <input type="radio" name="gender" value="male" checked={editForm.gender === 'male'} onChange={e => setEditForm({...editForm, gender: e.target.value})} className="w-4 h-4 text-[#1b2620] focus:ring-[#1b2620]" />
                        <span className="text-sm font-bold text-[#1b2620]">Male</span>
                      </label>
                      <label className={`flex-1 flex items-center gap-3 border ${editForm.gender === 'female' ? 'border-[#1b2620] bg-[#f7f9f2]' : 'border-gray-300'} rounded-lg px-4 py-3 cursor-pointer transition-colors`}>
                        <input type="radio" name="gender" value="female" checked={editForm.gender === 'female'} onChange={e => setEditForm({...editForm, gender: e.target.value})} className="w-4 h-4 text-[#1b2620] focus:ring-[#1b2620]" />
                        <span className="text-sm font-bold text-[#1b2620]">Female</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">ID</label>
                    <input type="text" value={editForm.id_number} onChange={e => setEditForm({...editForm, id_number: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm font-bold text-[#1b2620] bg-gray-50 outline-none focus:border-[#1b2620] transition-colors" placeholder="1559 000 7788 8DER" />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Tax Identification Number</label>
                    <input type="text" value={editForm.tax_id} onChange={e => setEditForm({...editForm, tax_id: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm font-bold text-[#1b2620] outline-none focus:border-[#1b2620] transition-colors" placeholder="Tax ID" />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Tax Identification Country</label>
                    <select value={editForm.tax_country} onChange={e => setEditForm({...editForm, tax_country: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm font-bold text-[#1b2620] outline-none focus:border-[#1b2620] transition-colors bg-white cursor-pointer">
                      <option value="">Select Country...</option>
                      <option value="USA">United States (USA)</option>
                      <option value="UK">United Kingdom (UK)</option>
                      <option value="CA">Canada (CA)</option>
                      <option value="AU">Australia (AU)</option>
                      <option value="IN">India (IN)</option>
                      <option value="DE">Germany (DE)</option>
                      <option value="FR">France (FR)</option>
                      <option value="ES">Spain (ES)</option>
                      <option value="BR">Brazil (BR)</option>
                      <option value="JP">Japan (JP)</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-2">Residential Address</label>
                    <textarea value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm font-bold text-[#1b2620] outline-none focus:border-[#1b2620] transition-colors resize-none" placeholder="Ib street orogun ibadan"></textarea>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-2">Preferred Translation Language</label>
                    <select value={editForm.preferred_language} onChange={(e) => setEditForm({...editForm, preferred_language: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm font-bold text-[#1b2620] outline-none focus:border-[#1b2620] transition-colors cursor-pointer bg-white">
                      <option value="en">English (Default)</option>
                      <option value="es">Español (Spanish)</option>
                      <option value="fr">Français (French)</option>
                      <option value="hi">हिन्दी (Hindi)</option>
                      <option value="de">Deutsch (German)</option>
                      <option value="it">Italiano (Italian)</option>
                      <option value="ja">日本語 (Japanese)</option>
                      <option value="ko">한국어 (Korean)</option>
                      <option value="pt">Português (Portuguese)</option>
                      <option value="ru">Русский (Russian)</option>
                      <option value="zh">中文 (Chinese)</option>
                    </select>
                  </div>

                  {/* Single access role — a user has exactly one at a time */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-2">
                      Access Role
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {ALL_ROLES.map((role) => (
                        <label
                          key={role.id}
                          className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer ${
                            editForm.role === role.id
                              ? "bg-[#c8e639]/20 border-[#c8e639]"
                              : "border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="accessRole"
                            value={role.id}
                            checked={editForm.role === role.id}
                            onChange={() => setEditForm({ ...editForm, role: role.id })}
                          />
                          <span>{role.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                </div>

                <div className="mt-8">
                  <button onClick={handleSave} disabled={saveLoading} className="bg-[#1b2620] text-white px-8 py-3.5 rounded-lg text-sm font-bold shadow-md hover:bg-[#0a0f0c] transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
                    {saveLoading ? <Loader2 size={18} className="animate-spin" /> : "Save Changes"}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "verification" && (
              <div className="animate-in fade-in duration-300 flex flex-col items-center justify-center py-20 text-center">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-sm border-4 ${user.kyc?.verified ? 'bg-green-100 border-green-200 text-green-600' : 'bg-amber-100 border-amber-200 text-amber-600'}`}>
                  {user.kyc?.verified ? <ShieldCheck size={48} /> : <ShieldAlert size={48} />}
                </div>
                <h2 className="text-2xl font-extrabold text-[#1b2620] mb-3">
                  {user.kyc?.verified ? 'KYC Verification Complete' : 'KYC Verification Pending'}
                </h2>
                <p className="text-gray-500 text-sm font-bold max-w-md mb-8">
                  {user.kyc?.verified 
                    ? 'Your identity has been successfully verified. You have full access to all investment opportunities.' 
                    : 'To comply with financial regulations and unlock investments, please complete your identity verification.'}
                </p>
                {!user.kyc?.verified && (
                  <button onClick={handleKYC} className="bg-[#c8e639] text-[#1b2620] px-8 py-3.5 rounded-lg text-sm font-extrabold shadow-md hover:opacity-90 transition-opacity">
                    Start Verification Process
                  </button>
                )}
              </div>
            )}

            {activeTab === "password" && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-xl font-extrabold text-[#1b2620] mb-6">Change Password</h2>
                
                {passwordStatus && (
                  <div className={`p-4 mb-6 rounded-lg text-sm font-bold ${passwordStatus.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                    {passwordStatus.message}
                  </div>
                )}

                <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-6 max-w-md">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Current Password</label>
                    <input 
                      type="password" 
                      autoComplete="current-password"
                      value={passwordForm.currentPassword} 
                      onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm font-bold text-[#1b2620] outline-none focus:border-[#1b2620] transition-colors" 
                      placeholder="Enter current password" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">New Password</label>
                    <input 
                      type="password" 
                      autoComplete="new-password"
                      value={passwordForm.newPassword} 
                      onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm font-bold text-[#1b2620] outline-none focus:border-[#1b2620] transition-colors" 
                      placeholder="Enter new password" 
                      required 
                    />
                    <p className="text-gray-400 text-[10px] font-bold mt-1">Must be at least 8 characters long.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Confirm New Password</label>
                    <input 
                      type="password" 
                      autoComplete="new-password"
                      value={passwordForm.confirmPassword} 
                      onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm font-bold text-[#1b2620] outline-none focus:border-[#1b2620] transition-colors" 
                      placeholder="Confirm new password" 
                      required 
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={passwordLoading} 
                    className="bg-[#1b2620] text-white px-8 py-3.5 rounded-lg text-sm font-bold shadow-md hover:bg-[#0a0f0c] transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
                  >
                    {passwordLoading ? <Loader2 size={18} className="animate-spin" /> : "Update Password"}
                  </button>
                </form>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="animate-in fade-in duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-extrabold text-[#1b2620]">Notifications</h2>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead} 
                      className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                      <CheckCheck size={16} /> Mark all read
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  {notifications.length === 0 ? (
                    <div className="py-12 text-center text-gray-400 font-bold">
                      <Bell size={48} className="mx-auto mb-4 opacity-20" />
                      <p>You have no notifications.</p>
                    </div>
                  ) : (
                    notifications.map(notification => (
                      <div 
                        key={notification._id} 
                        onClick={() => { if (!notification.isRead) markAsRead(notification._id); }}
                        className={`flex gap-4 p-5 rounded-xl border transition-colors cursor-pointer ${notification.isRead ? 'bg-gray-50 border-gray-100 opacity-70' : 'bg-white border-[#c8e639] shadow-sm'}`}
                      >
                        <div className="mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <h4 className={`text-sm ${notification.isRead ? 'font-bold text-gray-700' : 'font-extrabold text-[#1b2620]'}`}>
                            {notification.title}
                          </h4>
                          <p className="text-sm font-medium text-gray-500 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs font-bold text-gray-400 mt-3">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <div className="w-3 h-3 rounded-full bg-[#c8e639] self-center"></div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}