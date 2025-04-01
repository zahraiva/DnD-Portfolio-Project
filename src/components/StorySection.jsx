import React, { useState } from 'react';
import dndStories from '../data/dndStories';
import '../styles/StorySection.css';

const StorySection = () => {
  const [selectedStory, setSelectedStory] = useState(null);

  const handleStorySelect = (storyId) => {
    const story = dndStories.find(story => story.id === storyId);
    setSelectedStory(story);
  };

  return (
    <section className="story-section" id="story">
      <div className="container">
        <h2 className="section-title">Epic Tales Await</h2>
        
        <div className="story-selector">
          <div className="story-options">
            {dndStories.map(story => (
              <div 
                key={story.id} 
                className={`story-card ${selectedStory?.id === story.id ? 'selected' : ''}`}
                onClick={() => handleStorySelect(story.id)}
              >
                <h3>{story.title}</h3>
                <p className="story-meta">{story.levelRange} • {story.setting}</p>
                <div className="story-img-container">
                  <img src={story.image} alt={story.title} className="story-img" />
                </div>
                <p>{story.description.substring(0, 100)}...</p>
              </div>
            ))}
          </div>

          {selectedStory && (
            <div className="story-details">
              <h3>{selectedStory.title}</h3>
              <div className="story-header">
                <div className="story-img-container">
                  <img src={selectedStory.image} alt={selectedStory.title} className="story-img" />
                </div>
                <div className="story-info">
                  <p><strong>Difficulty:</strong> {selectedStory.difficulty}</p>
                  <p><strong>Level Range:</strong> {selectedStory.levelRange}</p>
                  <p><strong>Setting:</strong> {selectedStory.setting}</p>
                  <p><strong>Featured Creatures:</strong> {selectedStory.featuredCreatures}</p>
                </div>
              </div>
              <div className="story-description">
                <p>{selectedStory.description}</p>
              </div>
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button className="adventure-btn">Begin This Adventure</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default StorySection;
