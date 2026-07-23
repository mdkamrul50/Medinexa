export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function sanitizeSortField(field: string, allowed: string[]): string {
  return allowed.includes(field) ? field : "createdAt";
}

export function validatePassword(password: unknown): string | null {
  if (!password || typeof password !== "string") return "Password is required";
  if (password.length < 5) return "Password must be at least 5 characters";
  if (!/[a-zA-Z]/.test(password)) return "Password must contain at least one letter";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number";
  return null;
}

const DOCTOR_UPDATABLE_FIELDS = [
  "name", "email", "phone", "image", "gender", "dateOfBirth",
  "department", "specialization", "qualifications", "experience",
  "consultationFee", "availableDays", "availableTime", "hospitalBranch",
  "biography", "status", "rating",
];

const DOCTOR_SORT_FIELDS = [
  "name", "email", "createdAt", "updatedAt", "department", "status", "rating",
];

export const pickDoctorFields = (body: Record<string, unknown>): Record<string, unknown> => {
  const picked: Record<string, unknown> = {};
  for (const key of DOCTOR_UPDATABLE_FIELDS) {
    if (body[key] !== undefined) picked[key] = body[key];
  }
  return picked;
};

const PATIENT_UPDATABLE_FIELDS = [
  "name", "email", "phone", "image", "gender", "dateOfBirth",
  "bloodGroup", "height", "weight", "emergencyContact", "address",
  "assignedDoctor", "medicalHistory", "allergies", "currentMedications", "status",
];

const PATIENT_SORT_FIELDS = [
  "name", "email", "createdAt", "updatedAt", "bloodGroup", "status",
];

export const pickPatientFields = (body: Record<string, unknown>): Record<string, unknown> => {
  const picked: Record<string, unknown> = {};
  for (const key of PATIENT_UPDATABLE_FIELDS) {
    if (body[key] !== undefined) picked[key] = body[key];
  }
  return picked;
};

export { DOCTOR_SORT_FIELDS, PATIENT_SORT_FIELDS };
