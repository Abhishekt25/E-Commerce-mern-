import { useState, useCallback } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  role: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:2509";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    role: "user"
  });

  const getAdminToken = () => {
    return localStorage.getItem("adminToken");
  };

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const token = getAdminToken();
      
      if (!token) {
        alert("Please log in as admin first");
        window.location.href = "/admin/login";
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminName");
          window.location.href = "/admin/login";
          return;
        }
        if (response.status === 403) {
          alert("Access denied. Admin role required.");
          return;
        }
        throw new Error("Failed to fetch users");
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = getAdminToken();
      if (!token) {
        alert("Please log in first");
        window.location.href = "/admin/login";
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/create-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create user");
      }
      
      alert("User created successfully!");
      setShowCreateModal(false);
      setFormData({ name: "", email: "", password: "", role: "user" });
      fetchUsers();
    } catch (error: any) {
      console.error("Error creating user:", error);
      alert(error.message || "Failed to create user");
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const token = getAdminToken();
      if (!token) {
        alert("Please log in first");
        window.location.href = "/admin/login";
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update role");
      }
      
      alert("Role updated successfully!");
      fetchUsers();
    } catch (error: any) {
      console.error("Error updating role:", error);
      alert(error.message || "Failed to update role");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = getAdminToken();
      if (!token) {
        alert("Please log in first");
        window.location.href = "/admin/login";
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete user");
      }
      
      alert("User deleted successfully!");
      fetchUsers();
    } catch (error: any) {
      console.error("Error deleting user:", error);
      alert(error.message || "Failed to delete user");
    }
  };

  return {
    users,
    loading,
    showCreateModal,
    formData,
    setShowCreateModal,
    setFormData,
    fetchUsers,
    handleCreateUser,
    handleUpdateRole,
    handleDeleteUser
  };
};