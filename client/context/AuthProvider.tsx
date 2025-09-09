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
  verified?: boolean;
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
    localStorage.setItem(USERS_KEY, JSON.stringify([admin, faculty]));
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
    if (!found.verified && found.role !== "admin") {
      setLoading(false);
      return Promise.reject(new Error("Account not verified by admin yet"));
    }
    localStorage.setItem(CURRENT_KEY, JSON.stringify(found));
    setUser(found);
    setLoading(false);
    // redirect to appropriate dashboard
    if (found.role === "admin") navigate("/admin/dashboard");
    else if (found.role === "student") navigate("/dashboard/student");
    else if (found.role === "faculty") navigate("/dashboard/faculty");
    else navigate("/dashboard/alumni");
    return found;
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
    const newUser: User = { id: uid(), ...payload, verified: !needsVerification } as User;
    users.push(newUser);
    persistUsers(users);
    localStorage.setItem(CURRENT_KEY, JSON.stringify(newUser));
    setUser(newUser);
    setLoading(false);
    // redirect
    if (newUser.role === "admin") navigate("/admin/dashboard");
    else if (newUser.role === "student") navigate("/dashboard/student");
    else if (newUser.role === "faculty") navigate("/dashboard/faculty");
    else navigate("/dashboard/alumni");
    return newUser;
  };

  const getUsers = () => readUsers();

  const verifyUser = (id: string) => {
    const list = readUsers();
    const updated = list.map((u) => (u.id === id ? { ...u, verified: true } : u));
    persistUsers(updated);
    // update current user if needed
    const cur = JSON.parse(localStorage.getItem(CURRENT_KEY) || "null");
    if (cur && cur.id === id) localStorage.setItem(CURRENT_KEY, JSON.stringify({ ...cur, verified: true }));
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
    if (cur && cur.id === id) localStorage.setItem(CURRENT_KEY, JSON.stringify({ ...cur, role }));
  };

  const getPendingUsers = () => readUsers().filter((u) => !u.verified);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, register, getUsers, verifyUser, rejectUser, deleteUser, updateUserRole, getPendingUsers }}
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
