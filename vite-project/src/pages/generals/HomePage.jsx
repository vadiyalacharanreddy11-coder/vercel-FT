import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiHeart, FiBookmark, FiMessageCircle, FiHome } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAuth();

  const [foodItems, setFoodItems] = useState([]);
  const [visibleVideoId, setVisibleVideoId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [likedMap, setLikedMap] = useState({});
  const [likePendingMap, setLikePendingMap] = useState({});
  const [savedMap, setSavedMap] = useState({});
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const videoRefs = useRef({});
  const reelContainerRef = useRef(null);

  
  const scrollToTopOfReels = () => {
    if (reelContainerRef.current) {
      reelContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (location.pathname === "/") {
      scrollToTopOfReels();
    }
  }, [location.pathname, foodItems.length]);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/food/", {
          withCredentials: true,
        });



        const nextFoodItems = res.data?.foodItems || [];

        setFoodItems(nextFoodItems);
        setLikedMap(
          Object.fromEntries(
            nextFoodItems.map((item) => [
              item._id,
              Boolean(item.likedByCurrentUser),
            ])
          )
        );
        setErrorMessage("");
      } catch (error) {
        console.log("Error fetching food:", error);
        setFoodItems([]);

        if (error.response?.status === 401 || session.role === "unauthenticated") {
          setErrorMessage("Please log in to explore FoodReels and discover foodie reels.");
        } else {
          setErrorMessage("Unable to load food videos right now. Please try again later.");
        }
      }
    };

    fetchFood();
    console.log(foodItems);

    const refreshFoodWhenActive = () => {
      if (document.visibilityState === "visible") fetchFood();
    };

    const refreshInterval = window.setInterval(fetchFood, 5000);
    window.addEventListener("focus", refreshFoodWhenActive);
    document.addEventListener("visibilitychange", refreshFoodWhenActive);

    return () => {
      window.clearInterval(refreshInterval);
      window.removeEventListener("focus", refreshFoodWhenActive);
      document.removeEventListener("visibilitychange", refreshFoodWhenActive);
    };
  }, [session.role]);

  useEffect(() => {
    const fetchSavedReels = async () => {
      if (!session.role || session.role === "unauthenticated") {
        setSavedMap({});
        return;
      }

      try {
        const res = await axios.get("http://localhost:8000/api/food/saved", {
          withCredentials: true,
        });

        const savedIds = {};
        (res.data?.savedItems || []).forEach((item) => {
          if (item?._id) savedIds[item._id] = true;
        });

        setSavedMap(savedIds);
      } catch (error) {
        console.log("Error fetching saved reels:", error);
        setSavedMap({});
      }
    };

    fetchSavedReels();
  }, [session.role]);

  useEffect(() => {
    if (!foodItems.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoId = entry.target.getAttribute("data-video-id");

          if (entry.isIntersecting) {
            setVisibleVideoId(videoId);
            if (videoRefs.current[videoId]) {
              videoRefs.current[videoId].play();
            }
          } else if (videoRefs.current[videoId]) {
            videoRefs.current[videoId].pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    Object.keys(videoRefs.current).forEach((videoId) => {
      const videoElement = videoRefs.current[videoId];
      if (videoElement) {
        observer.observe(videoElement);
      }
    });

    return () => observer.disconnect();
  }, [foodItems]);
 

  const toggleDescription = (id) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleLike = async (id) => {
    if (likePendingMap[id]) return;

    const desiredLiked = !Boolean(likedMap[id]);
    setLikePendingMap((prev) => ({ ...prev, [id]: true }));

  try {
    const resp = await axios.post(
      "http://localhost:8000/api/food/likes",
      { foodId: id, liked: desiredLiked },
      { withCredentials: true }
    );

    setLikedMap((prev) => ({ ...prev, [id]: Boolean(resp.data.currLiked) }));
    setFoodItems((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, likes: Number(resp.data.currLikeCount) }
          : item
      )
    );

  } catch (err) {
    console.log(err);
  } finally {
    setLikePendingMap((prev) => ({ ...prev, [id]: false }));
  }
};
 

  const toggleSave = async (id) => {
  try {
    const wasSaved = Boolean(savedMap[id]);

    setSavedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

    setFoodItems((prev) =>
      prev.map((item) =>
        item._id === id
          ? {
              ...item,
              saves: wasSaved
                ? Math.max(0, Number(item.saves || 0) - 1)
                : Number(item.saves || 0) + 1,
            }
          : item
      )
    );

    const resp = await axios.post(
      "http://localhost:8000/api/food/saves",
      { foodId: id },
      { withCredentials: true }
    );

    const nextSavedValue = Number(resp.data?.currSaved || 0) === 1;
    setSavedMap((prev) => ({
      ...prev,
      [id]: nextSavedValue,
    }));

    if (resp.data?.currSaveCount !== undefined) {
      setFoodItems((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                saves: Number(resp.data.currSaveCount),
              }
            : item
        )
      );
    }

  } catch (err) {
    console.log(err);
  }
};

  if (!foodItems.length && (session.role === "unauthenticated" || errorMessage)) {
    return (
      <main className="guest-homepage">
        <div className="guest-card">
          <div className="guest-logo">FoodReels</div>
          <h1>Discover food through short-form videos</h1>
          <p>
            {errorMessage ||
              "FoodReels is a food discovery platform where users explore food through short-form videos and discover food partners. Food partners can create profiles, upload food videos, and showcase their dishes, while users can visit stores and explore their available food items."}
          </p>
          <div className="guest-actions">
            <Link to="/user/login" className="guest-button primary">Login</Link>
            <Link to="/user/register" className="guest-button secondary">Register</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="reel-page">
      <section className="reel-container" ref={reelContainerRef}>
        {foodItems.map((item) => {
          const liked = Boolean(likedMap[item._id]);
          const saved = Boolean(savedMap[item._id]);
          const likeCount = Number(item.likes ?? item.like ?? 0);
          const saveCount = Number(item.saves ?? item.save ?? 0);
          const commentCount = Number(item.comments ?? 0);
          const isExpanded = Boolean(expandedDescriptions[item._id]);
          const descriptionText = item.description || "";

          return (
            <article className="reel-item" key={item._id}>
              <video
                ref={(el) => {
                  if (el) videoRefs.current[item._id] = el;
                }}
                data-video-id={item._id}
                className="reel-video"
                src={item.video}
                muted
                loop
                playsInline
              />

              <div className="reel-overlay">
                <div className="reel-header" aria-hidden="true" />

                {!isExpanded && (
                  <div className="reel-actions">
                    <button
                      type="button"
                      className={`action-button ${liked ? "liked" : ""}`}
                      onClick={() => toggleLike(item._id)}
                      disabled={Boolean(likePendingMap[item._id])}
                      aria-label={liked ? "Unlike this food reel" : "Like this food reel"}
                    >
                      <FiHeart className="action-icon" />
                      <span>{likeCount}</span>
                    </button>

                    <button
                      type="button"
                      className={`action-button ${saved ? "saved" : ""}`}
                      onClick={() => toggleSave(item._id)}
                      aria-label={saved ? "Remove saved bookmark" : "Save this food reel"}
                    >
                      <FiBookmark className="action-icon" />
                      <span>{saveCount}</span>
                    </button>

                    <div className="action-button" aria-label="Comments">
                      <FiMessageCircle className="action-icon" />
                      <span>{commentCount}</span>
                    </div>
                  </div>
                )}

                <div className="reel-footer">
                  <p className={`reel-description ${isExpanded ? "expanded" : ""}`}>
                    {descriptionText}
                  </p>

                  {descriptionText && (
                    <button
                      type="button"
                      className="read-more-btn"
                      onClick={() => toggleDescription(item._id)}
                    >
                      {isExpanded ? "Read less" : "Read more"}
                    </button>
                  )}

                  <button
                    type="button"
                    className="reel-button"
                    onClick={() => navigate(`/store/${item.foodpartner}`)}
                  >
                    Visit Store
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <nav className="bottom-nav">
        <button
          type="button"
          className="bottom-nav-item active"
          onClick={() => {
            navigate("/");
            setTimeout(scrollToTopOfReels, 50);
          }}
        >
          <FiHome className="bottom-nav-icon" />
          <span>Home</span>
        </button>
{/* Saved */}
  <button
    type="button"
    className={`bottom-nav-item ${location.pathname === "/saved" ? "active" : ""}`}
    onClick={() => navigate("/saved")}
  >
    <FiBookmark className="bottom-nav-icon"   />
    <span>Saved</span>
  </button>
      </nav>
    </main>
  );
};

export default HomePage;



 