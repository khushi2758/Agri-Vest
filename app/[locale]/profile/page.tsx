"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { 
  User, LogOut, ShieldCheck, Mail, Phone, Loader2, 
  Camera, Bell, Lock, ShieldAlert, ArrowLeft 
} from "lucide-react";
import NavBar from "../navbar";


export default function AccountSettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
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
    roles: ["investor"]
  });
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          
          const names = (data.name || "").split(" ");
          const firstName = names[0] || "";
          const lastName = names.slice(1).join(" ") || "";
          
          setEditForm({
            firstName,
            lastName,
            email: data.email || "",
            phone: data.phone || "",
            gender: data.gender || "male",
            id_number: data.id_number || "",
            tax_id: data.tax_id || "",
            tax_country: data.tax_country || "USA",
            address: data.address || "",
            preferred_language: data.preferred_language || "en",
            roles: data.roles || ["investor"]
          });
        } else {
          router.push("/en/login");
        }
      } catch (err) {
        router.push("/en/login");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [router]);

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
        roles: editForm.roles
      };
      const res = await fetch("/api/auth/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
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
              className={`w-full text-left px-6 py-4 flex items-center gap-3 text-sm font-bold transition-colors ${activeTab === 'notifications' ? 'bg-[#f7f9f2] text-[#1b2620] border-r-4 border-[#1b2620]' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <Bell size={18} /> Notifications
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
                      <div className="bg-gray-50 px-3 py-3 border-r border-gray-300 flex items-center justify-center">
                        <span className="text-sm font-bold">🇺🇸 ▾</span>
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
                    <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#1b2620] transition-colors">
                      <div className="bg-gray-50 px-3 py-3 border-r border-gray-300 flex items-center justify-center">
                        <span className="text-sm font-bold">🇺🇸 ▾</span>
                      </div>
                      <input type="text" value={editForm.tax_country} onChange={e => setEditForm({...editForm, tax_country: e.target.value})} className="flex-1 px-4 py-3 text-sm font-bold text-[#1b2620] outline-none" placeholder="Country" />
                    </div>
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

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-2">Account Roles (Select all that apply)</label>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                      {[
                        { id: 'investor', label: 'Investor' },
                        { id: 'farmer', label: 'Farmer (Producer)' },
                        { id: 'landowner', label: 'Landowner' },
                        { id: 'agronomist', label: 'Agronomist' }
                      ].map(roleOption => (
                        <label key={roleOption.id} className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer transition-all ${editForm.roles.includes(roleOption.id) ? 'bg-[#c8e639]/20 border-[#c8e639]' : 'bg-white border-gray-300 hover:border-[#c8e639]/50'}`}>
                          <input type="checkbox" className="accent-[#1b2620] w-4 h-4 cursor-pointer" checked={editForm.roles.includes(roleOption.id)} onChange={() => {
                            setEditForm(prev => {
                              const newRoles = prev.roles.includes(roleOption.id) ? prev.roles.filter(r => r !== roleOption.id) : [...prev.roles, roleOption.id];
                              return { ...prev, roles: newRoles.length ? newRoles : ['investor'] };
                            });
                          }} />
                          <span className="text-sm font-bold text-[#1b2620]">{roleOption.label}</span>
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

            {(activeTab === "password" || activeTab === "notifications") && (
              <div className="animate-in fade-in duration-300 flex flex-col items-center justify-center py-20 text-center">
                <p className="text-gray-400 font-bold">This section is currently under construction.</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
