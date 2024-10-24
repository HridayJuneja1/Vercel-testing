import React, { useEffect, useState } from 'react';
import { useParams, Link, Route, Routes } from 'react-router-dom';
import PersonalInfo from './PersonalInfo';
import PastOrders from './PastOrders';
import ReadyForPickup from './ReadyForPickup';

const Dashboard = () => {
  const { userId } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [pastOrders, setPastOrders] = useState([]);
  const [readyForPickup, setReadyForPickup] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setError("User ID is missing");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`/api/dashboard/${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUserInfo(data.user);
        setPastOrders(data.pastOrders);
        setReadyForPickup(data.readyForPickup);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="dashboard" style={styles.dashboard}>
      <div className="sidebar" style={styles.sidebar}>
        <h2>Dashboard</h2>
        <ul>
          {/* Use absolute paths */}
          <li>
            <Link to={`/dashboard/${userId}/personal-info`} style={styles.sidebarLink}>
              Personal Info
            </Link>
          </li>
          <li>
            <Link to={`/dashboard/${userId}/past-orders`} style={styles.sidebarLink}>
              Past Orders
            </Link>
          </li>
          <li>
            <Link to={`/dashboard/${userId}/ready-for-pickup`} style={styles.sidebarLink}>
              Books Ready for Pickup
            </Link>
          </li>
        </ul>
      </div>

      <div className="content" style={styles.content}>
        <Routes>
            <Route path="/personal-info" element={<PersonalInfo userInfo={userInfo} />} />
            <Route path="/past-orders" element={<PastOrders pastOrders={pastOrders} />} />
            <Route path="/ready-for-pickup" element={<ReadyForPickup readyForPickup={readyForPickup} />} />
        </Routes>
      </div>
    </div>
  );
};

const styles = {
    dashboard: {
      display: 'flex',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
    },
    sidebar: {
      width: '200px',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRight: '1px solid #ddd',
    },
    sidebarLink: {
      textDecoration: 'none',
      color: '#333',
      display: 'block',
      margin: '10px 0',
      fontWeight: 'bold',
    },
    content: {
      flex: 1,
      padding: '20px',
    },
    section: {
      marginBottom: '30px',
    },
    listItem: {
      marginBottom: '10px',
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#007BFF',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
  };


export default Dashboard;
