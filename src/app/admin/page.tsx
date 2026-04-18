"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { Users, Shield, Zap, BookOpen, Search, RefreshCw } from "lucide-react";

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  const handleUpdateRole = async (userId: string, currentPlan: string, newPlan: string) => {
    try {
      let schoolName = null;
      if (newPlan === "school") {
        schoolName = prompt("Enter the school name for this user:");
        if (!schoolName) return; // cancelled
      }
      
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { 
        plan: newPlan,
        schoolName: schoolName 
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to update role");
    }
  };

  const handleToggleUnlimited = async (userId: string, currentState: boolean) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { isUnlimited: !currentState });
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to toggle unlimited mode");
    }
  };

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(search.toLowerCase()) || 
    u.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
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
                <th className="p-4 font-medium">Daily Limit Control</th>
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
                          <span className="text-xs text-slate-500 truncate max-w-[150px]">
                            @ {user.schoolName}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleUnlimited(user.id, user.isUnlimited || false)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          user.isUnlimited ? "bg-green-500" : "bg-slate-600"
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          user.isUnlimited ? "translate-x-6" : "translate-x-1"
                        }`} />
                      </button>
                      <span className="ml-2 text-xs text-slate-400">
                        {user.isUnlimited ? "Unlimited AP" : "Strict Limits"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <select 
                        value="" 
                        onChange={(e) => handleUpdateRole(user.id, user.plan, e.target.value)}
                        className="bg-white/5 border border-white/10 text-slate-300 text-xs rounded-lg focus:outline-none focus:border-primary/50 px-2 py-2 cursor-pointer"
                      >
                        <option value="" disabled>Change Tier...</option>
                        <option value="free" className="bg-slate-900">Downgrade to Free</option>
                        <option value="premium" className="bg-slate-900">Promote to Premium</option>
                        <option value="school" className="bg-slate-900">Promote to School</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
