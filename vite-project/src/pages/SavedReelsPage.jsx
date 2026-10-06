 
import { useEffect, useRef, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { FiHome, FiBookmark, FiArrowLeft } from "react-icons/fi";

const SavedReelsPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const videoRefs = useRef({});
  const [savedItems, setSavedItems] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  useEffect(() => {
    const fetchSavedReels = async () => {
      try {
        const res = await api.get("/api/food/saved", {
          withCredentials: true,
        });

        setSavedItems(res.data?.savedItems || []);
      } catch (error) {
        console.log("Error fetching saved reels:", error);
        setSavedItems([]);
      }
    };

    fetchSavedReels();
  }, []);

  useEffect(() => {
    if (!savedItems.length || !containerRef.current) return;

    const target = containerRef.current.querySelectorAll(".saved-reel-item")[selectedIndex];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedIndex, savedItems.length]);

  useEffect(() => {
    if (!savedItems.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("data-video-id");
          const video = videoRefs.current[id];

          if (!video) return;

          if (entry.isIntersecting) {
            video.muted = true;
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    const items = containerRef.current?.querySelectorAll(".saved-reel-item") || [];
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [savedItems]);

  const handleOpenReel = (index) => {
    setSelectedIndex(index);
  };

  const toggleDescription = (id) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <main className="saved-reel-page">
      {savedItems.length > 0 ? (
        <>
          <header className="saved-reel-header">
            <button type="button" className="saved-back-button" onClick={() => navigate("/")} aria-label="Go back home">
              <FiArrowLeft />
            </button>
            <span>Saved Reels</span>
          </header>

          <section className="saved-reel-container" ref={containerRef}>
            {savedItems.map((item, index) => (
              <article
                key={item._id}
                className={`saved-reel-item ${selectedIndex === index ? "active" : ""}`}
                data-video-id={item._id}
                onClick={() => handleOpenReel(index)}
              >
                <video
                  ref={(el) => {
                    if (el) videoRefs.current[item._id] = el;
                  }}
                  className="saved-reel-video"
                  src={item.video}
                  muted
                  playsInline
                  loop
                />

                <div className="saved-reel-overlay">
                  <div className="saved-reel-footer">
                    <p className={`saved-reel-description ${expandedDescriptions[item._id] ? "expanded" : ""}`}>
                      {item.description || "Saved food reel"}
                    </p>

                    {item.description && (
                      <button
                        type="button"
                        className="saved-read-more-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDescription(item._id);
                        }}
                      >
                        {expandedDescriptions[item._id] ? "Read less" : "Read more"}
                      </button>
                    )}

                    {!expandedDescriptions[item._id] && (
                      <button type="button" className="saved-reel-button" onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/store/${item.foodpartner}`);
                      }}>
                        Visit Store
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </section>
        </>
      ) : (
        <div className="saved-page">
          <div className="saved-shell">
            <h1>Saved</h1>
            <p>No saved reels yet.</p>
          </div>
        </div>
      )}

      <nav className="bottom-nav">
        <button type="button" className="bottom-nav-item" onClick={() => navigate("/")}>
          <FiHome className="bottom-nav-icon" />
          <span>Home</span>
        </button>

        <button type="button" className="bottom-nav-item active" onClick={() => navigate("/saved")}>
          <FiBookmark className="bottom-nav-icon" />
          <span>Saved</span>
        </button>
      </nav>
    </main>
  );
};

export default SavedReelsPage;
 
