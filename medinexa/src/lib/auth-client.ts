"use client";

import { createAuthClient } from "better-auth/react";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "";

export const authClient = createAuthClient({
  baseURL,
  fetchOptions: {
    credentials: "include",
  },
  $InferAuth: {
    user: {
      additionalFields: {
        role: {
          type: "string",
          required: true,
          defaultValue: "patient",
          input: false,
        },
        phone: {
          type: "string",
          required: false,
          defaultValue: "",
          input: true,
        },
        address: {
          type: "string",
          required: false,
          defaultValue: "",
          input: true,
        },
      },
    },
  },
});
