import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import { FaEdit, FaTrash } from "react-icons/fa"; 

const MyAccount = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
   
    const token = localStorage.getItem("token");

    
    if (!token) {
      navigate("/");
    } else {
      
      axios
        .get("http://localhost:5001/api/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
          if (error.response && error.response.status === 403) {
            navigate("/"); 
          }
        });
    }
  }, [navigate]);

  if (!user) {
    return <div className="d-flex justify-content-center mt-5">Loading...</div>; 
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">My Account</h4>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title mb-0">Welcome, {user.name}!</h5>
                <div className="dropdown">
                  <button
                    className="btn btn-outline-secondary dropdown-toggle"
                    type="button"
                    id="accountDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Actions
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="accountDropdown">
                    <li>
                      <button className="dropdown-item">
                        <FaEdit className="me-2" /> Edit Profile
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item text-danger">
                        <FaTrash className="me-2" /> Delete Account
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              <p className="card-text mb-3">Manage your account details below:</p>

              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <strong>Name:</strong> {user.name}
                </li>
                <li className="list-group-item">
                  <strong>Email:</strong> {user.email}
                </li>
                <li className="list-group-item">
                  <strong>Joined Date:</strong> {new Date(user.joinedDate).toLocaleDateString()}
                </li>
                <li className="list-group-item">
                  <strong>Membership:</strong> {user.membership}
                </li>
              </ul>

              <div className="mt-4 text-center">
                <button className="btn btn-outline-primary me-2">
                  <FaEdit className="me-2" />
                  Edit Profile
                </button>
                <button className="btn btn-outline-danger">
                  <FaTrash className="me-2" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
