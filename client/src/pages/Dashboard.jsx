import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/api/auth/get-user`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok || !data.status) {
          navigate("/login", { replace: true });
          return;
        }

        setUser(data.user);
      } catch (error) {
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [baseUrl, navigate]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">
        Welcome, {user.name}
      </h1>
      <p className="text-lg">
        Email: {user.email}
      </p>
    </div>
  );
};

export default Dashboard;
