"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FiUsers, FiSearch, FiShield } from "react-icons/fi";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PageContainer from "@/components/dashboard/PageContainer";
import RoleGuard from "@/components/auth/RoleGuard";
import DashboardSection from "@/components/dashboard/DashboardSection";
import StaggerContainer from "@/components/dashboard/StaggerContainer";
import { fetchFromAPI } from "@/lib/api-client";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const roleColors: Record<string, string> = {
  admin: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  doctor: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  patient: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  receptionist: "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setSearchLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const result = await fetchFromAPI<{ users: User[] }>(`/api/users?${params.toString()}`);
      setUsers(result.users || []);
    } catch {
    } finally {
      setSearchLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await fetchFromAPI("/api/users/role", {
        method: "PATCH",
        body: JSON.stringify({ userId, role: newRole }),
      });
      fetchUsers();
    } catch {
    }
  };

  return (
    <RoleGuard roles={["admin"]}>
      <DashboardLayout>
        <PageContainer title="User Management" subtitle="Manage system users, roles, and permissions">
          <StaggerContainer>
            <DashboardSection title="All Users" subtitle="View and manage user accounts">
              <div className="mb-4 flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-sm text-heading placeholder:text-muted focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
                <span className="text-sm text-muted">{users.length} users</span>
              </div>

              {searchLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
                </div>
              ) : users.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FiUsers className="h-12 w-12 text-muted mb-3" />
                  <p className="text-sm text-muted">No users found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-xs font-medium uppercase text-muted">
                        <th className="pb-3 pr-4">Name</th>
                        <th className="pb-3 pr-4">Email</th>
                        <th className="pb-3 pr-4">Role</th>
                        <th className="pb-3 pr-4">Joined</th>
                        <th className="pb-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {users.map((user) => (
                        <motion.tr
                          key={user._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-heading"
                        >
                          <td className="py-3 pr-4 font-medium">{user.name}</td>
                          <td className="py-3 pr-4 text-muted">{user.email}</td>
                          <td className="py-3 pr-4">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${roleColors[user.role] || ""}`}>
                              <FiShield className="h-3 w-3" />
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 pr-4 text-muted">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                          </td>
                          <td className="py-3">
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user._id, e.target.value)}
                              className="rounded-lg border border-border bg-card px-2 py-1 text-xs text-heading focus:border-teal-500 focus:outline-none"
                            >
                              <option value="admin">Admin</option>
                              <option value="doctor">Doctor</option>
                              <option value="patient">Patient</option>
                              <option value="receptionist">Receptionist</option>
                            </select>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </DashboardSection>
          </StaggerContainer>
        </PageContainer>
      </DashboardLayout>
    </RoleGuard>
  );
}
