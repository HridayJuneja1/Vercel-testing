import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PersonalInfo = ({ userInfo }) => {
  const [profileImage, setProfileImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={styles.container}>
      {/* Profile Header Section */}
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>Personal Info</h2>
      </div>

      {/* Profile Content Section */}
      <div style={styles.profileContainer}>
        <div style={styles.profileImageContainer}>
          {/* Render uploaded image or a placeholder */}
          <img
            src={profileImage || 'https://via.placeholder.com/150'}
            alt="Profile"
            style={styles.profileImage}
          />

          {/* Image Upload Section */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={styles.fileInput}
          />
        </div>

        {/* User Details Section */}
        <div style={styles.infoContainer}>
          <div style={styles.infoRow}>
            <strong style={styles.label}>Name:</strong>
            <span style={styles.info}>{userInfo.name}</span>
          </div>
          <div style={styles.infoRow}>
            <strong style={styles.label}>Email:</strong>
            <span style={styles.info}>{userInfo.email}</span>
          </div>

          {/* Action Button */}
          <Link to="/change-password">
            <button style={styles.changePasswordButton}>Change Password</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    backgroundColor: '#007BFF',
    padding: '20px',
    borderRadius: '10px 10px 0 0',
  },
  headerTitle: {
    color: 'white',
    fontSize: '28px',
  },
  profileContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '0 0 10px 10px',
  },
  profileImageContainer: {
    flex: 1,
    textAlign: 'center',
  },
  profileImage: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #007BFF',
  },
  fileInput: {
    marginTop: '10px',
  },
  infoContainer: {
    flex: 2,
    paddingLeft: '40px',
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
  },
  label: {
    width: '120px',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  info: {
    fontSize: '18px',
  },
  changePasswordButton: {
    padding: '12px 20px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default PersonalInfo;
