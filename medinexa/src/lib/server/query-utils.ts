export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const PATIENT_SORT_FIELDS = [
  "name", "email", "createdAt", "updatedAt", "bloodGroup", "status",
];

const DOCTOR_SORT_FIELDS = [
  "name", "email", "createdAt", "updatedAt", "department", "status", "rating",
];

export function sanitizeSortField(field: string, allowed: string[]): string {
  return allowed.includes(field) ? field : "createdAt";
}
