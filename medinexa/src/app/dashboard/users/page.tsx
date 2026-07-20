"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PageContainer from "@/components/dashboard/PageContainer";
import { FiUsers, FiCalendar, FiMail, FiCheckCircle, FiXCircle } from "react-icons/fi";

interface User {
  _id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/api/users", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setUsers(data.users);
        setTotal(data.total);
      })
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <PageContainer
        title="Registered Users"
        subtitle={`${total} user${total !== 1 ? "s" : ""} registered on the platform`}
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Users" }]}
      >
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-slate-50/50 dark:bg-slate-800/20">
                  <th className="text-left py-4 px-5 font-semibold text-heading">Name</th>
                  <th className="text-left py-4 px-5 font-semibold text-heading">Email</th>
                  <th className="text-center py-4 px-5 font-semibold text-heading">Verified</th>
                  <th className="text-left py-4 px-5 font-semibold text-heading">Registered</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-muted">Loading...</td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-muted">No users registered yet</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="border-b border-border/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-heading">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-body">{user.email}</td>
                      <td className="py-4 px-5 text-center">
                        {user.emailVerified ? (
                          <FiCheckCircle className="inline h-4.5 w-4.5 text-emerald-500" />
                        ) : (
                          <FiXCircle className="inline h-4.5 w-4.5 text-slate-300" />
                        )}
                      </td>
                      <td className="py-4 px-5 text-body text-sm">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
