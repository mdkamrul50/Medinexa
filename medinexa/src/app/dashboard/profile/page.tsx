"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiShield,
  FiLock,
  FiCheck,
  FiAlertCircle,
  FiLoader,
  FiEye,
  FiEyeOff,
  FiRefreshCw,
  FiMonitor,
  FiSave,
} from "react-icons/fi";
import Image from "next/image";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PageContainer from "@/components/dashboard/PageContainer";
import RoleGuard from "@/components/auth/RoleGuard";
import DashboardSection from "@/components/dashboard/DashboardSection";
import { Skeleton } from "@/components/dashboard/Skeleton";
import { useUser } from "@/hooks/useUser";
import { useProfileUpdate } from "@/hooks/useProfileUpdate";
import { getRoleBadgeColor } from "@/lib/auth-utils";

function formatDate(dateStr: string | undefined | null): string {
  if (!dateStr) return "N/A";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "N/A";
  }
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-card overflow-hidden">
        <div className="h-48 sm:h-56 animate-pulse bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600" />
        <div className="px-6 sm:px-8 pb-6 sm:pb-8 -mt-16 sm:-mt-20 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6">
            <Skeleton variant="circular" width={120} height={120} className="border-4 border-card" />
            <div className="text-center sm:text-left space-y-2 flex-1">
              <Skeleton width={200} height={24} />
              <Skeleton width={160} height={14} />
              <Skeleton width={100} height={20} className="rounded-full" />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DashboardSection title="">
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton variant="circular" width={36} height={36} />
                  <div className="flex-1 space-y-1">
                    <Skeleton width="30%" height={11} />
                    <Skeleton width="50%" height={14} />
                  </div>
                </div>
              ))}
            </div>
          </DashboardSection>
        </div>
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <DashboardSection key={i} title="">
              <div className="space-y-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-center gap-3">
                    <Skeleton variant="circular" width={28} height={28} />
                    <div className="flex-1 space-y-1">
                      <Skeleton width="50%" height={11} />
                      <Skeleton width="30%" height={13} />
                    </div>
                  </div>
                ))}
              </div>
            </DashboardSection>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileInfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3.5 py-3 border-b border-border/40 last:border-0">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/50 text-muted shrink-0">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold text-muted uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-heading mt-0.5 truncate">{value || "Not provided"}</p>
      </div>
    </div>
  );
}

function AccountInfoRow({
  icon: Icon,
  label,
  value,
  badge,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border/40 last:border-0">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/50 text-muted shrink-0">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold text-muted uppercase tracking-wider">{label}</p>
        {badge || (
          <p className="text-sm font-semibold text-heading mt-0.5 truncate">{value || "N/A"}</p>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, role, isPending, refetch } = useUser();
  const { profileState, passwordState, updateProfile, changePassword, clearProfileError, clearPasswordError } = useProfileUpdate(refetch);

  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const editSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditName(user.name ?? "");
      setEditPhone((user as { phone?: string }).phone ?? "");
      setEditAddress((user as { address?: string }).address ?? "");
    }
  }, [user]);

  const initials = useMemo(() => {
    if (!user?.name) return "?";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    clearProfileError();
    await updateProfile({ name: editName, phone: editPhone, address: editAddress });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearPasswordError();
    await changePassword({ currentPassword, newPassword, confirmPassword });
    if (!passwordState.error) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  if (isPending) {
    return (
      <RoleGuard roles={["admin", "doctor", "patient", "receptionist"]}>
        <DashboardLayout>
          <PageContainer title="My Profile" breadcrumbs={[{ label: "My Profile" }]}>
            <ProfileSkeleton />
          </PageContainer>
        </DashboardLayout>
      </RoleGuard>
    );
  }

  const isDoctor = role === "doctor";

  return (
    <RoleGuard roles={["admin", "doctor", "patient", "receptionist"]}>
      <DashboardLayout>
        <PageContainer title="My Profile" breadcrumbs={[{ label: "My Profile" }]}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-3xl border border-border bg-card overflow-hidden shadow-lg shadow-black/5"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/60 via-primary/30 to-purple-500/40 dark:from-primary/40 dark:via-primary/20 dark:to-purple-500/30" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.05),transparent_50%)]" />
              <div className="relative h-48 sm:h-56" />

              <div className="relative px-6 sm:px-8 pb-6 sm:pb-8 -mt-16 sm:-mt-20">
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6">
                  <div className="relative shrink-0">
                    <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-2xl border-4 border-card bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl sm:text-4xl font-extrabold shadow-xl shadow-primary/20 overflow-hidden">
                      {user?.image ? (
                        <Image src={user.image} alt="" width={128} height={128} className="h-full w-full object-cover" />
                      ) : (
                        initials
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-emerald-500 border-2 border-card flex items-center justify-center">
                      <FiCheck className="h-3.5 w-3.5 text-white" />
                    </div>
                  </div>

                  <div className="text-center sm:text-left min-w-0 flex-1 pt-2 sm:pt-0">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight drop-shadow-sm">
                      {user?.name ?? "User"}
                    </h1>
                    <p className="text-sm text-white/80 mt-0.5 drop-shadow-sm">
                      {user?.email ?? ""}
                    </p>
                    <div className="flex items-center gap-3 mt-2.5 justify-center sm:justify-start flex-wrap">
                      {role && (
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full capitalize bg-white/15 text-white backdrop-blur-sm border border-white/10`}>
                          <FiShield className="h-3 w-3" />
                          {role}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white/70">
                        <FiCalendar className="h-3 w-3" />
                        Member since {formatDate(user?.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Profile Information */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <DashboardSection title="Profile Information">
                    <div className="divide-y divide-border/40">
                      <ProfileInfoRow icon={FiUser} label="Full Name" value={user?.name ?? ""} />
                      <ProfileInfoRow icon={FiMail} label="Email Address" value={user?.email ?? ""} />
                      <ProfileInfoRow icon={FiPhone} label="Phone Number" value={(user as { phone?: string })?.phone ?? ""} />
                      <ProfileInfoRow icon={FiMapPin} label="Address" value={(user as { address?: string })?.address ?? ""} />
                      {isDoctor && (
                        <>
                          <ProfileInfoRow icon={FiShield} label="Department" value="General Medicine" />
                          <ProfileInfoRow icon={FiUser} label="Specialization" value="Primary Care" />
                        </>
                      )}
                    </div>
                  </DashboardSection>
                </motion.div>

                {/* Edit Profile */}
                <motion.div
                  ref={editSectionRef}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <DashboardSection
                    title="Edit Profile"
                    subtitle="Update your personal information"
                    action={
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
                      >
                        {isEditing ? "Cancel" : "Edit"}
                      </button>
                    }
                  >
                    {isEditing ? (
                      <form onSubmit={handleSaveProfile} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-heading">Full Name</label>
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full rounded-xl border border-border bg-slate-50 dark:bg-slate-800/40 px-4 py-2.5 text-sm font-medium text-heading outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                              placeholder="Your name"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-heading">Email</label>
                            <input
                              type="email"
                              value={user?.email ?? ""}
                              disabled
                              className="w-full rounded-xl border border-border bg-slate-100 dark:bg-slate-800/20 px-4 py-2.5 text-sm font-medium text-muted outline-none cursor-not-allowed"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-heading">Phone Number</label>
                            <input
                              type="tel"
                              value={editPhone}
                              onChange={(e) => setEditPhone(e.target.value)}
                              className="w-full rounded-xl border border-border bg-slate-50 dark:bg-slate-800/40 px-4 py-2.5 text-sm font-medium text-heading outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                              placeholder="+1 (555) 000-0000"
                            />
                          </div>
                          <div className="space-y-1.5 sm:col-span-2">
                            <label className="text-xs font-semibold text-heading">Address</label>
                            <textarea
                              value={editAddress}
                              onChange={(e) => setEditAddress(e.target.value)}
                              rows={2}
                              className="w-full rounded-xl border border-border bg-slate-50 dark:bg-slate-800/40 px-4 py-2.5 text-sm font-medium text-heading outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none"
                              placeholder="Your address"
                            />
                          </div>
                        </div>

                        <AnimatePresence>
                          {profileState.error && (
                            <motion.div
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              className="flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-4 py-2.5"
                            >
                              <FiAlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                              <p className="text-xs font-medium text-red-600 dark:text-red-400">{profileState.error}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="flex items-center gap-3 justify-end">
                          {profileState.success && (
                            <motion.span
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                            >
                              <FiCheck className="h-3.5 w-3.5" />
                              Profile updated
                            </motion.span>
                          )}
                          <button
                            type="submit"
                            disabled={profileState.loading}
                            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors disabled:opacity-60 cursor-pointer"
                          >
                            {profileState.loading ? (
                              <FiLoader className="h-4 w-4 animate-spin" />
                            ) : (
                              <FiSave className="h-4 w-4" />
                            )}
                            {profileState.loading ? "Saving..." : "Save Changes"}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex items-center justify-center py-6 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <FiUser className="h-8 w-8 text-muted" />
                          <p className="text-sm text-muted">Click &quot;Edit&quot; to update your profile information</p>
                        </div>
                      </div>
                    )}
                  </DashboardSection>
                </motion.div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Security */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <DashboardSection title="Security">
                    <form onSubmit={handleChangePassword} className="space-y-3.5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-heading">Current Password</label>
                        <div className="relative">
                          <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                          <input
                            type={showCurrent ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full rounded-xl border border-border bg-slate-50 dark:bg-slate-800/40 pl-10 pr-10 py-2.5 text-sm font-medium text-heading outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrent(!showCurrent)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-heading cursor-pointer"
                            tabIndex={-1}
                          >
                            {showCurrent ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-heading">New Password</label>
                        <div className="relative">
                          <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                          <input
                            type={showNew ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full rounded-xl border border-border bg-slate-50 dark:bg-slate-800/40 pl-10 pr-10 py-2.5 text-sm font-medium text-heading outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                            placeholder="Enter new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNew(!showNew)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-heading cursor-pointer"
                            tabIndex={-1}
                          >
                            {showNew ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-heading">Confirm New Password</label>
                        <div className="relative">
                          <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                          <input
                            type={showConfirm ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full rounded-xl border border-border bg-slate-50 dark:bg-slate-800/40 pl-10 pr-10 py-2.5 text-sm font-medium text-heading outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                            placeholder="Confirm new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-heading cursor-pointer"
                            tabIndex={-1}
                          >
                            {showConfirm ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <AnimatePresence>
                        {passwordState.error && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-4 py-2.5"
                          >
                            <FiAlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                            <p className="text-xs font-medium text-red-600 dark:text-red-400">{passwordState.error}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <button
                        type="submit"
                        disabled={passwordState.loading || !currentPassword || !newPassword || !confirmPassword}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {passwordState.loading ? (
                          <FiLoader className="h-4 w-4 animate-spin" />
                        ) : (
                          <FiRefreshCw className="h-4 w-4" />
                        )}
                        {passwordState.loading ? "Updating..." : "Change Password"}
                      </button>

                      {passwordState.success && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                        >
                          <FiCheck className="h-3.5 w-3.5" />
                          Password changed successfully
                        </motion.p>
                      )}
                    </form>

                    <div className="mt-5 pt-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/50 text-muted">
                            <FiShield className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-heading">Two-Factor Authentication</p>
                            <p className="text-[11px] text-muted">Add an extra layer of security</p>
                          </div>
                        </div>
                        <div className="flex h-6 w-10 rounded-full bg-slate-200 dark:bg-slate-700 cursor-not-allowed opacity-50">
                          <div className="h-5 w-5 m-0.5 rounded-full bg-white shadow-sm" />
                        </div>
                      </div>
                    </div>
                  </DashboardSection>
                </motion.div>

                {/* Active Sessions */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <DashboardSection title="Active Sessions">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 rounded-xl bg-primary/5 border border-primary/10 p-3.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <FiMonitor className="h-4.5 w-4.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-heading">Current Session</p>
                          <p className="text-[11px] text-muted truncate">
                            {typeof window !== "undefined" ? window.navigator.userAgent.split("/")[0]?.trim()?.slice(0, 30) || "Browser" : "Browser"}
                          </p>
                        </div>
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                          <FiCheck className="h-3 w-3" />
                          Active
                        </span>
                      </div>
                    </div>
                  </DashboardSection>
                </motion.div>

                {/* Account */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <DashboardSection title="Account">
                    <div className="divide-y divide-border/40">
                      <AccountInfoRow
                        icon={FiShield}
                        label="Role"
                        badge={
                          role && (
                            <span className={`inline-block mt-0.5 text-[11px] font-bold px-3 py-0.5 rounded-full capitalize ${getRoleBadgeColor(role)}`}>
                              {role}
                            </span>
                          )
                        }
                      />
                      <AccountInfoRow icon={FiCalendar} label="Member Since" value={formatDate(user?.createdAt)} />
                      <AccountInfoRow icon={FiRefreshCw} label="Last Updated" value={formatDate(user?.updatedAt)} />
                      <AccountInfoRow
                        icon={FiCheck}
                        label="Status"
                        badge={
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        }
                      />
                    </div>
                  </DashboardSection>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </PageContainer>
      </DashboardLayout>
    </RoleGuard>
  );
}
