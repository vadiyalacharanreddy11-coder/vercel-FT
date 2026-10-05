import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../../profile.css'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Profile = () => {
    let {id} = useParams();
  const { session } = useAuth();
  const [foodPartner, setFoodPartner] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  const canDeleteItems =
    session.role === 'foodpartner' &&
    session.foodpartner?._id &&
    String(session.foodpartner._id) === String(id);

  const handleDeleteItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:8000/api/food/${itemId}`, {
        withCredentials: true,
      });

      setVideos((prev) => prev.filter((item) => item._id !== itemId));
    } catch (error) {
      console.error('Delete failed:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    const fetchFoodPartnerProfile = async () => {
      try {
        console.log("Fetching profile for ID:", id); // Debug log
        
        // Fetch current logged-in food partner profile
        const res = await axios.get(
           `http://localhost:8000/api/foodpartner/profile/${id}`,
          { withCredentials: true }
        )
        
        console.log("Profile response:", res.data); // Debug log
        setFoodPartner(res.data.data)

        
        // Fetch their videos/food items
        const videosRes = await axios.get(
            `http://localhost:8000/api/foodpartner/food-items/${id}`,
          { withCredentials: true }
        )
        console.log("Videos response:", videosRes.data); // Debug log
        setVideos(videosRes.data?.foodItems || [])
      } catch (error) {
        console.error("Error fetching profile:", error.response?.data || error.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchFoodPartnerProfile()
    }
  }, [id])

  if (loading) {
    return <div className="profile-container">Loading...</div>
  }

  return (
    <div className="profile-container">
      {/* Profile Header Section */}
      <div className="profile-header">
        <div className="profile-info-wrapper">
          {/* Profile Picture */}
          <div className="profile-picture">
            <img 
              src={foodPartner?.profilePic || "https://via.placeholder.com/120"} 
              alt="Profile"
            />
          </div>

          {/* Business Info */}
          <div className="profile-details">
            <div className="profile-field">
              <label>Business Name</label>
              <div className="profile-value">{foodPartner?.businessname || "N/A"}</div>
            </div>
            <div className="profile-field">
              <label>Address</label>
              <div className="profile-value">{foodPartner?.address || "N/A"}</div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="profile-stats">
          <div className="stat-item">
            <div className="stat-label">Total Meals</div>
            <div className="stat-value">{videos.length || 0}</div>
          </div>
        </div>
      </div>

      {/* Videos Grid Section */}
      <div className="videos-section">
        <h2>Your Food Items</h2>
        <div className="videos-grid">
          {videos.length > 0 ? (
            videos.map((item) => (
              <div className="video-card" key={item._id}>
                <video 
                  src={item.video}
                  controls
                  className="video-player"
                />
                <div className="video-info">
                  <p className="video-name">{item.name}</p>
                  {canDeleteItems && (
                    <button
                      type="button"
                      className="delete-item-button"
                      onClick={() => handleDeleteItem(item._id)}
                    >
                      Delete Item
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-videos">No food items yet</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
