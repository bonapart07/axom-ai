"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { Users, Shield, Zap, BookOpen, Search, RefreshCw, Trash2, Edit2, X, Check, Save, RotateCcw } from "lucide-react";
import clsx from "clsx";

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Modal State
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    plan: "free",
    isUnlimited: false,
    dailyLimit: 5,
    schoolName: "",
    maxStudentAccounts: 0
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
    } catch (error) {
      console.error("Error fetching users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setEditForm({
      plan: user.plan || "free",
      isUnlimited: user.isUnlimited || false,
      dailyLimit: user.dailyLimit || (user.plan === 'premium' ? 100 : 5),
      schoolName: user.schoolName || "",
      maxStudentAccounts: user.maxStudentAccounts || 0
    });
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    setIsSaving(true);
    try {
      const userRef = doc(db, "users", editingUser.id);
      
      const updateData: any = {
        plan: editForm.plan,
        isUnlimited: editForm.isUnlimited,
        dailyLimit: editForm.dailyLimit
      };

      if (editForm.plan === "school") {
        updateData.schoolName = editForm.schoolName;
        updateData.maxStudentAccounts = editForm.maxStudentAccounts;
        // Initialize created accounts to 0 if it doesn't already exist
        if (editingUser.createdStudentAccounts === undefined) {
            updateData.createdStudentAccounts = 0;
        }
      }

      await updateDoc(userRef, updateData);
      await fetchUsers();
      setEditingUser(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update user");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetUsage = async (userId: string) => {
    if (!confirm("Are you sure you want to reset this user's daily usage to 0?")) return;
    try {
      await updateDoc(doc(db, "users", userId), { usedToday: 0 });
      alert("Daily usage reset to 0!");
      fetchUsers();
    } catch (err) {
      alert("Failed to reset usage");
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Are you sure you want to completely delete the database record for ${userEmail}?\n\nNote: If they have Google Authentication, they may still be able to log back in unless deleted from the Firebase Console.`)) return;
    try {
      await deleteDoc(doc(db, "users", userId));
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete user from database.");
    }
  };

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(search.toLowerCase()) || 
    u.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 relative">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-6 border border-white/5">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-blue-500/10 rounded-xl"><Users className="w-6 h-6 text-blue-400" /></div>
            <h3 className="text-slate-400 font-medium">Total Users</h3>
          </div>
          <p className="text-3xl font-bold">{users.length}</p>
        </div>
        
        <div className="glass-panel p-6 border border-white/5">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-green-500/10 rounded-xl"><Zap className="w-6 h-6 text-green-400" /></div>
            <h3 className="text-slate-400 font-medium">Premium</h3>
          </div>
          <p className="text-3xl font-bold">{users.filter(u => u.plan === 'premium').length}</p>
        </div>
        
        <div className="glass-panel p-6 border border-white/5">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-purple-500/10 rounded-xl"><BookOpen className="w-6 h-6 text-purple-400" /></div>
            <h3 className="text-slate-400 font-medium">School Tier</h3>
          </div>
          <p className="text-3xl font-bold">{users.filter(u => u.plan === 'school').length}</p>
        </div>

        <div className="glass-panel p-6 border border-white/5">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-yellow-500/10 rounded-xl"><Shield className="w-6 h-6 text-yellow-400" /></div>
            <h3 className="text-slate-400 font-medium">Unlimited</h3>
          </div>
          <p className="text-3xl font-bold">{users.filter(u => u.isUnlimited).length}</p>
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-panel border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">User Directory</h2>
          
          <div className="flex gap-2">
             <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search email or name..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-primary/50 text-white w-64"
              />
            </div>
            <button 
              onClick={fetchUsers} 
              className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 text-slate-300 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-sm text-slate-400">
                <th className="p-4 font-medium">User Details</th>
                <th className="p-4 font-medium">Access Tier</th>
                <th className="p-4 font-medium">Usage Limit</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">Loading directory...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">No users found. Wait for users to register!</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4">
                      <div className="font-medium text-slate-200">{user.name}</div>
                      <div className="text-sm text-slate-500">{user.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`text-xs px-2 py-1 rounded border font-medium uppercase tracking-wider
                          ${user.plan === 'premium' ? 'bg-primary/20 border-primary/30 text-primary' : 
                            user.plan === 'school' ? 'bg-purple-500/20 border-purple-500/30 text-purple-400' : 
                            'bg-slate-500/20 border-slate-500/30 text-slate-400'}
                        `}>
                          {user.plan || 'free'}
                        </span>
                        {user.plan === 'school' && user.schoolName && (
                          <div className="flex flex-col mt-1">
                            <span className="text-xs text-slate-500 truncate max-w-[150px]">
                              @ {user.schoolName}
                            </span>
                            <span className="text-xs text-blue-400 mt-1 bg-blue-500/10 px-1.5 py-0.5 rounded w-fit">
                              Used: {user.createdStudentAccounts || 0} / {user.maxStudentAccounts || 0}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {user.isUnlimited ? (
                         <span className="inline-flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded border border-green-500/20 font-medium">
                            <Shield className="w-3 h-3" /> Unlimited
                         </span>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-slate-300">
                            Limit: <span className="font-bold text-white">{user.dailyLimit || (user.plan === 'premium' ? 100 : 5)}</span>/day
                          </span>
                          <span className="text-xs text-slate-500">
                            Used today: {user.usedToday || 0}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex flex-col gap-2 items-end">
                        <button
                          onClick={() => openEditModal(user)}
                          className="flex items-center justify-center gap-1.5 text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors border border-white/10 w-32"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Manage User
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id, user.email)}
                          className="flex items-center justify-center gap-1.5 text-xs text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 px-3 py-1.5 rounded-lg transition-colors border border-red-400/20 w-32"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in px-4">
          <div className="relative w-full max-w-lg p-6 overflow-hidden bg-slate-900 border border-primary/30 rounded-2xl shadow-[0_0_40px_rgba(79,70,229,0.2)]">
            
            <button 
              onClick={() => setEditingUser(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-1">Manage User</h2>
            <p className="text-sm text-slate-400 mb-6">{editingUser.email}</p>

            <div className="space-y-4">
              
              {/* Plan Selection */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Access Tier</label>
                <select 
                  value={editForm.plan}
                  onChange={(e) => setEditForm({...editForm, plan: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 focus:outline-none focus:border-primary/50"
                >
                  <option value="free">Free Tier</option>
                  <option value="premium">Premium Tier</option>
                  <option value="school">School Tier</option>
                </select>
              </div>

              {/* School Specific Options */}
              {editForm.plan === "school" && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl">
                  <div>
                    <label className="block text-xs font-medium text-purple-300 mb-1">School Name</label>
                    <input 
                      type="text" 
                      value={editForm.schoolName}
                      onChange={(e) => setEditForm({...editForm, schoolName: e.target.value})}
                      className="w-full bg-slate-900/50 border border-purple-500/30 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400/50 text-sm"
                      placeholder="e.g. KV Guwahati"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-purple-300 mb-1">Max Accounts</label>
                    <input 
                      type="number" 
                      value={editForm.maxStudentAccounts}
                      onChange={(e) => setEditForm({...editForm, maxStudentAccounts: parseInt(e.target.value) || 0})}
                      className="w-full bg-slate-900/50 border border-purple-500/30 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400/50 text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Usage Controls */}
              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 space-y-4">
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-slate-300">Unlimited Access</h4>
                    <p className="text-xs text-slate-500">Bypass all daily AI limits entirely.</p>
                  </div>
                  <button
                    onClick={() => setEditForm({...editForm, isUnlimited: !editForm.isUnlimited})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      editForm.isUnlimited ? "bg-green-500" : "bg-slate-600"
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      editForm.isUnlimited ? "translate-x-6" : "translate-x-1"
                    }`} />
                  </button>
                </div>

                {!editForm.isUnlimited && (
                  <div className="pt-3 border-t border-slate-700">
                    <label className="block text-xs font-medium text-slate-400 mb-1">Custom Daily Limit</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="number" 
                        value={editForm.dailyLimit}
                        onChange={(e) => setEditForm({...editForm, dailyLimit: parseInt(e.target.value) || 0})}
                        className="w-24 bg-slate-900/50 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-primary/50 text-sm"
                      />
                      <span className="text-xs text-slate-500">
                        Default: {editForm.plan === 'premium' ? 100 : 5}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Extra Tools */}
              <button
                onClick={() => handleResetUsage(editingUser.id)}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> Reset Today's Usage (Currently {editingUser.usedToday || 0})
              </button>

            </div>

            <div className="mt-8 flex gap-3">
              <button 
                onClick={() => setEditingUser(null)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveUser}
                disabled={isSaving}
                className="flex-1 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium text-sm flex items-center justify-center gap-2"
              >
                {isSaving ? "Saving..." : <><Save className="w-4 h-4" /> Save Changes</>}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
