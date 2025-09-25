import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export type Role = "alumni" | "student" | "admin" | "faculty";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // NOTE: for demo only — do NOT use plain text in production
  role: Role;
  batch?: string;
  department?: string;
  skills?: string[];
  verified?: boolean;
  disabled?: boolean;
  lastActiveAt?: number;
  location?: {
    city: string;
    country: string;
    lat: number;
    lng: number;
  };
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  register: (payload: Omit<User, "id">) => Promise<User>;
  getUsers: () => User[];
  verifyUser: (id: string) => void;
  rejectUser: (id: string) => void;
  deleteUser: (id: string) => void;
  updateUserRole: (id: string, role: Role) => void;
  getPendingUsers: () => User[];
  createUser: (payload: Omit<User, "id">) => User;
  updateUser: (
    id: string,
    patch: Partial<Omit<User, "id" | "email">>,
  ) => User | undefined;
  setUserDisabled: (id: string, disabled: boolean) => void;
  resetPassword: (
    id: string,
    newPassword?: string,
  ) => { resetToken: string; link: string };
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USERS_KEY = "alumnihub_users";
const CURRENT_KEY = "alumnihub_current";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function seedAdminIfNeeded() {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) {
    const admin: User = {
      id: uid(),
      name: "Site Admin",
      email: "admin@institute.edu",
      password: "admin123",
      role: "admin",
      verified: true,
    };
    const faculty: User = {
      id: uid(),
      name: "Faculty Member",
      email: "faculty@institute.edu",
      password: "faculty123",
      role: "faculty",
      verified: true,
    };
    const alumniSamples: User[] = [
      {
        id: uid(),
        name: "Aarav Patel",
        email: "aarav.patel@example.com",
        password: "alumni123",
        role: "alumni",
        verified: true,
        location: {
          city: "Mumbai",
          country: "India",
          lat: 19.076,
          lng: 72.8777,
        },
      },
      {
        id: uid(),
        name: "Olivia Smith",
        email: "olivia.smith@example.com",
        password: "alumni123",
        role: "alumni",
        verified: true,
        location: {
          city: "London",
          country: "United Kingdom",
          lat: 51.5074,
          lng: -0.1278,
        },
      },
      {
        id: uid(),
        name: "Liam Johnson",
        email: "liam.johnson@example.com",
        password: "alumni123",
        role: "alumni",
        verified: true,
        location: {
          city: "New York",
          country: "USA",
          lat: 40.7128,
          lng: -74.006,
        },
      },
      {
        id: uid(),
        name: "Sakura Tanaka",
        email: "sakura.tanaka@example.com",
        password: "alumni123",
        role: "alumni",
        verified: true,
        location: {
          city: "Tokyo",
          country: "Japan",
          lat: 35.6762,
          lng: 139.6503,
        },
      },
      {
        id: uid(),
        name: "Noah Williams",
        email: "noah.williams@example.com",
        password: "alumni123",
        role: "alumni",
        verified: true,
        location: {
          city: "Sydney",
          country: "Australia",
          lat: -33.8688,
          lng: 151.2093,
        },
      },
    ];
    localStorage.setItem(
      USERS_KEY,
      JSON.stringify([admin, faculty, ...alumniSamples]),
    );
  } else {
    try {
      const list = JSON.parse(raw) as User[];
      if (!list.find((u) => u.role === "faculty")) {
        const faculty: User = {
          id: uid(),
          name: "Faculty Member",
          email: "faculty@institute.edu",
          password: "faculty123",
          role: "faculty",
          verified: true,
        };
        localStorage.setItem(USERS_KEY, JSON.stringify([...list, faculty]));
      }
    } catch {}
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    seedAdminIfNeeded();
    const raw = localStorage.getItem(CURRENT_KEY);
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch (e) {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const persistUsers = (users: User[]) =>
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  const readUsers = (): User[] => {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as User[];
    } catch {
      return [];
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const users = readUsers();
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password,
    );
    if (!found) {
      setLoading(false);
      return Promise.reject(new Error("Invalid credentials"));
    }
    if (found.disabled) {
      setLoading(false);
      return Promise.reject(new Error("Account disabled by admin"));
    }
    if (!found.verified && found.role !== "admin") {
      setLoading(false);
      return Promise.reject(new Error("Account not verified by admin yet"));
    }
    const updatedFound: User = { ...found, lastActiveAt: Date.now() };
    const list = readUsers().map((u) =>
      u.id === updatedFound.id ? updatedFound : u,
    );
    persistUsers(list);
    localStorage.setItem(CURRENT_KEY, JSON.stringify(updatedFound));
    setUser(updatedFound);
    setLoading(false);
    // redirect to appropriate dashboard
    if (updatedFound.role === "admin") navigate("/admin/redirect");
    else if (updatedFound.role === "student") navigate("/dashboard/student");
    else if (updatedFound.role === "faculty") navigate("/dashboard/faculty");
    else navigate("/dashboard/alumni");
    return updatedFound;
  };

  const logout = () => {
    localStorage.removeItem(CURRENT_KEY);
    setUser(null);
    navigate("/");
  };

  const register = async (payload: Omit<User, "id">) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const users = readUsers();
    if (
      users.find((u) => u.email.toLowerCase() === payload.email.toLowerCase())
    ) {
      setLoading(false);
      return Promise.reject(new Error("User already exists"));
    }
    const needsVerification = payload.role !== "admin";
    const newUser: User = {
      id: uid(),
      ...payload,
      verified: !needsVerification,
    } as User;
    users.push(newUser);
    persistUsers(users);
    localStorage.setItem(CURRENT_KEY, JSON.stringify(newUser));
    setUser(newUser);
    setLoading(false);
    // redirect
    if (newUser.role === "admin") navigate("/admin/redirect");
    else if (newUser.role === "student") navigate("/dashboard/student");
    else if (newUser.role === "faculty") navigate("/dashboard/faculty");
    else navigate("/dashboard/alumni");
    return newUser;
  };

  const getUsers = () => readUsers();

  const verifyUser = (id: string) => {
    const list = readUsers();
    const updated = list.map((u) =>
      u.id === id ? { ...u, verified: true } : u,
    );
    persistUsers(updated);
    // update current user if needed
    const cur = JSON.parse(localStorage.getItem(CURRENT_KEY) || "null");
    if (cur && cur.id === id)
      localStorage.setItem(
        CURRENT_KEY,
        JSON.stringify({ ...cur, verified: true }),
      );
  };

  const rejectUser = (id: string) => {
    const list = readUsers();
    const filtered = list.filter((u) => u.id !== id);
    persistUsers(filtered);
    const cur = JSON.parse(localStorage.getItem(CURRENT_KEY) || "null");
    if (cur && cur.id === id) localStorage.removeItem(CURRENT_KEY);
  };

  const deleteUser = (id: string) => {
    rejectUser(id);
  };

  const updateUserRole = (id: string, role: Role) => {
    const list = readUsers();
    const updated = list.map((u) => (u.id === id ? { ...u, role } : u));
    persistUsers(updated);
    const cur = JSON.parse(localStorage.getItem(CURRENT_KEY) || "null");
    if (cur && cur.id === id)
      localStorage.setItem(CURRENT_KEY, JSON.stringify({ ...cur, role }));
  };

  const getPendingUsers = () => readUsers().filter((u) => !u.verified);

  const createUser = (payload: Omit<User, "id">) => {
    const users = readUsers();
    if (
      users.find((u) => u.email.toLowerCase() === payload.email.toLowerCase())
    ) {
      throw new Error("User already exists");
    }
    const created: User = { id: uid(), ...payload } as User;
    users.push(created);
    persistUsers(users);
    return created;
  };

  const updateUser = (
    id: string,
    patch: Partial<Omit<User, "id" | "email">>,
  ) => {
    const users = readUsers();
    const next = users.map((u) => (u.id === id ? { ...u, ...patch } : u));
    persistUsers(next);
    const updated = next.find((u) => u.id === id);
    const cur = JSON.parse(localStorage.getItem(CURRENT_KEY) || "null");
    if (cur && cur.id === id && updated)
      localStorage.setItem(CURRENT_KEY, JSON.stringify(updated));
    return updated;
  };

  const setUserDisabled = (id: string, disabled: boolean) => {
    updateUser(id, { disabled });
  };

  const resetPassword = (id: string, newPassword?: string) => {
    const token =
      Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    if (newPassword) updateUser(id, { password: newPassword });
    const link = `${location.origin}/reset-password?token=${token}&id=${id}`;
    return { resetToken: token, link };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        getUsers,
        verifyUser,
        rejectUser,
        deleteUser,
        updateUserRole,
        getPendingUsers,
        createUser,
        updateUser,
        setUserDisabled,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
