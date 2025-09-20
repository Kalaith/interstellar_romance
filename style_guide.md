# Interstellar Romance - Stellaris UI Style Guide

## Overview
This project implements an **authentic Stellaris UI theme** based on the official game's interface design. The styling replicates the exact visual hierarchy, color scheme, and interaction patterns from Stellaris for a space-age dating simulation with complex relationship and empire management systems.

## Architecture

### Design Philosophy - Authentic Stellaris Elements
From the official Stellaris interface:
- **Deep space teal gradients** (#1a2330 to #0a0e13) for main backgrounds
- **Hierarchical panel system** with distinct visual layers and borders
- **Icon-grid interfaces** for building/character selection with + buttons
- **Multi-colored resource tracking** (yellow energy, red minerals, green food, etc.)
- **Angular technological frames** with subtle cyan borders
- **Information density** with compact layouts and efficient space usage
- **Portrait-based character displays** with status indicators
- **Segmented progress systems** for multiple simultaneous tracking

### Core Visual Elements
1. **Teal-dominated color scheme** with cyan accents
2. **Nested panel hierarchy** - outer panels contain inner grids
3. **Grid-based selection systems** with hover states and add buttons
4. **Resource bars with colored segments** showing different resource types
5. **Portrait frames** with rounded corners and status overlays
6. **Subtle gradients and borders** creating depth without heavy shadows

### Technical Stack
- **Primary Framework**: Tailwind CSS (utility classes for layout)
- **Custom Theme**: Authentic Stellaris CSS theme in `style.css`
- **Global Styles**: `frontend/src/styles/globals.css` (Tailwind + Stellaris)
- **Implementation**: Custom CSS with higher specificity than Tailwind utilities

## Authentic Stellaris Color Palette

### Core Stellaris Colors (from Official UI Screenshot)
```css
/* Main Background Hierarchy */
--bg-space: #0a0e13;       /* deep space background */
--bg-panel: #1a2330;       /* main panel background (teal-dark) */
--bg-section: #152028;     /* sub-panel background (slightly darker) */
--bg-item: #1e2d3a;        /* individual item/card background */

/* Primary Interface Colors */
--text-primary: #e8f4fa;   /* bright white-cyan text */
--text-secondary: #b8d4e3; /* secondary text - light cyan */
--text-muted: #6b8395;     /* muted labels and descriptions */

/* Stellaris Signature Accents */
--accent-cyan: #00d4ff;    /* primary cyan - borders and highlights */
--accent-teal: #4ae6c8;    /* secondary teal - active states */
--border-frame: rgba(0, 212, 255, 0.2); /* panel borders */
--border-inner: rgba(74, 230, 200, 0.15); /* inner section borders */

/* Resource Type Colors (from screenshot) */
--resource-energy: #f1c40f;    /* yellow - energy credits */
--resource-minerals: #e74c3c;  /* red - minerals */
--resource-food: #27ae60;      /* green - food */
--resource-alloys: #9b59b6;    /* purple - alloys */
--resource-research: #3498db;  /* blue - research */
--resource-influence: #f39c12; /* orange - influence */

/* UI State Colors */
--state-available: #2ed573;    /* green - available actions */
--state-building: #f39c12;     /* orange - in progress */
--state-locked: #7f8c8d;       /* gray - unavailable */
--state-deficit: #e74c3c;      /* red - negative states */
```

### Stellaris Visual Hierarchy
```css
/* Panel Depth System (matching screenshot) */
--depth-background: 0;                    /* space background */
--depth-main-panel: 1;                    /* main content panels */
--depth-sub-panel: 2;                     /* nested sections */
--depth-item-grid: 3;                     /* selection grids */
--depth-overlay: 4;                       /* tooltips, modals */

/* Border System */
--border-panel: 1px solid rgba(0, 212, 255, 0.2);
--border-section: 1px solid rgba(74, 230, 200, 0.15);
--border-item: 1px solid rgba(255, 255, 255, 0.1);
--border-active: 1px solid var(--accent-cyan);
```

## Stellaris UI Component Patterns

### 1. Main Interface Layout (Replicating Screenshot)
**Three-Panel Stellaris Layout:**
```jsx
<div className="stellaris-theme">
  <div className="stellaris-background">
    {/* Planetary/space background image */}
    <img src="/background-space-scene.jpg" className="stellaris-bg-image" />
  </div>
  
  <div className="stellaris-ui-overlay">
    {/* Top Status Bar */}
    <div className="stellaris-top-bar">
      <div className="empire-info">
        <div className="empire-icon">🌍</div>
        <div className="empire-details">
          <h3>Earth</h3>
          <span>Empire Capital</span>
        </div>
      </div>
      
      <div className="stellaris-resources">
        <span className="resource energy">⚡ 5.2K</span>
        <span className="resource minerals">⛏️ 763K</span>
        <span className="resource food">🌾 0</span>
        {/* etc */}
      </div>
    </div>

    {/* Main Content Panel */}
    <div className="stellaris-main-panel">
      <div className="panel-header">
        <h2>Districts and Buildings</h2>
        <div className="panel-stats">
          <span className="grid-counter">3/18</span>
          <span className="energy-cost">⚡ 18</span>
        </div>
      </div>
      
      <div className="stellaris-grid-section">
        {/* Grid content */}
      </div>
    </div>

    {/* Side Panel for Details */}
    <div className="stellaris-side-panel">
      <h3>Planet Production</h3>
      <div className="production-breakdown">
        {/* Resource breakdowns */}
      </div>
    </div>
  </div>
</div>
```

### 2. Stellaris Grid System (Building/Character Selection)
**Authentic Grid with Add Buttons:**
```jsx
<div className="stellaris-grid-container">
  <div className="grid-section">
    <h4 className="section-title">City Districts</h4>
    <span className="section-subtitle">Space Age Industry</span>
    
    <div className="stellaris-selection-grid">
      {/* Existing items */}
      {existingBuildings.map(building => (
        <div key={building.id} className="grid-item filled">
          <img src={building.icon} alt={building.name} />
          <div className="item-info">
            <span className="item-name">{building.name}</span>
          </div>
        </div>
      ))}
      
      {/* Available slots */}
      {availableSlots.map(slot => (
        <div key={slot.id} className="grid-item empty">
          <button className="add-button">
            <span className="plus-icon">+</span>
          </button>
        </div>
      ))}
    </div>
  </div>

  <div className="grid-section">
    <h4 className="section-title">Generator Districts</h4>
    <span className="section-subtitle">Basic Generators</span>
    {/* Similar grid structure */}
  </div>
</div>
```

### 3. Stellaris Resource Tracking
**Multi-Resource Progress System:**
```jsx
<div className="stellaris-resources-panel">
  <div className="resource-header">
    <h3>Planet Production</h3>
    <button className="auto-designate-btn">
      🔄 Auto Designated
    </button>
  </div>

  <div className="resource-breakdown">
    <div className="resource-line">
      <span className="resource-icon energy">⚡</span>
      <span className="resource-amount positive">+60</span>
      <div className="resource-details">
        <span className="base">💼 25</span>
        <span className="modifier green">🏭 +35</span>
      </div>
    </div>
    
    <div className="resource-line">
      <span className="resource-icon minerals">⛏️</span>
      <span className="resource-amount positive">+63</span>
      <div className="resource-details">
        <span className="base">💼 17</span>
        <span className="modifier green">🏭 +19</span>
        <span className="modifier green">� +15</span>
      </div>
    </div>
  </div>

  <div className="planet-status">
    <div className="status-line">
      <span className="status-label">Planet Deficit</span>
      <span className="status-value neutral">-</span>
    </div>
  </div>
</div>
```

### 4. Stellaris Buttons & Controls
**Authentic Button System:**
```jsx
{/* Primary Build Buttons */}
<button className="stellaris-btn build-btn">
  <span className="btn-icon">🏗️</span>
  <span className="btn-text">Build</span>
</button>

{/* Icon Controls */}
<button className="stellaris-icon-btn settings">
  <span className="icon">⚙️</span>
</button>

{/* Add/Plus Buttons in Grids */}
<button className="stellaris-add-btn">
  <span className="plus">+</span>
</button>

{/* Tab Navigation */}
<div className="stellaris-tabs">
  <button className="tab active">Surface</button>
  <button className="tab">Management</button>
  <button className="tab">Economy</button>
  <button className="tab">Armies</button>
  <button className="tab">Holdings</button>
</div>
```

### 5. Character Portraits (Dating App Adaptation)
**Stellaris-Style Character Cards:**
```jsx
<div className="stellaris-character-panel">
  <div className="character-portrait">
    <div className="portrait-frame">
      <img src={character.image} alt={character.name} />
      <div className="portrait-overlay">
        <div className="character-status online"></div>
        <div className="character-level">{character.level}</div>
      </div>
    </div>
    
    <div className="character-details">
      <h3 className="character-name">{character.name}</h3>
      <span className="character-title">{character.species}</span>
      <div className="character-traits">
        {character.traits.map(trait => (
          <span key={trait} className="trait-badge">{trait}</span>
        ))}
      </div>
    </div>
  </div>

  <div className="relationship-resources">
    <div className="relationship-stat">
      <span className="stat-icon">�</span>
      <span className="stat-value">{character.affection}</span>
    </div>
    <div className="relationship-stat">
      <span className="stat-icon">🧠</span>
      <span className="stat-value">{character.compatibility}</span>
    </div>
  </div>
</div>
```

## Typography

### Current Fonts
- **Primary**: System fonts (default Tailwind stack)
- **Fantasy**: 'Cinzel' serif (configured but not widely used)

### Stellaris Fonts
```css
--ui-font: "Inter", "SF Pro Text", -apple-system, system-ui, "Segoe UI", Roboto;
--mono-font: "Fira Code", "Roboto Mono", monospace;
```

### Typography Scale
```jsx
// Headings
<h1 className="text-2xl font-bold text-white mb-2">  // Current
<h1 className="brand">                              // Stellaris

// Body text
<p className="text-lg">                             // Current  
<p className="text-[var(--text)]">                  // Stellaris

// Muted text
<p className="text-gray-400">                       // Current
<p className="text-[var(--muted)]">                 // Stellaris
```

## Animation Guidelines

### Current Animations
```javascript
// tailwind.config.js
animation: {
  'pulse-gold': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  'bounce-gentle': 'bounce 2s infinite',
  'float': 'float 3s ease-in-out infinite',
}
```

### Stellaris Animations
```css
/* Starfield drift */
animation: star-drift 80s linear infinite;

/* Neon glow on hover */
.neon-outline:hover::after { opacity: 1; }

/* Blinking cursor for sci-fi terminals */
.cursor { animation: blink 1.1s steps(2, start) infinite; }
```

## Implementation Guide

### Step 1: Add Stellaris Theme to App
```jsx
// In App.tsx or main layout component
function App() {
  return (
    <div className="stellaris-theme">
      <div className="starfield"></div>
      {/* Rest of app */}
    </div>
  );
}
```

### Step 2: Import Custom Styles
```css
/* In globals.css */
@import "tailwindcss";
@import "../../../style.css"; /* Import Stellaris theme */
```

### Step 3: Component Migration Strategy
1. **Keep Tailwind for layout** (flexbox, grid, spacing)
2. **Use Stellaris classes for theming** (colors, backgrounds, effects)
3. **Combine both approaches** for maximum flexibility

### Example Mixed Implementation:
```jsx
<div className="flex items-center space-x-4 card"> {/* Tailwind layout + Stellaris card */}
  <button className="btn primary"> {/* Stellaris button */}
    <span className="mr-2">💫</span> {/* Tailwind spacing */}
    Super Like
  </button>
</div>
```

## Dating App Specific Patterns

### Character Discovery (Stellaris-Style Empire Selection)
**Grid-Based Character Discovery:**
```jsx
<div className="stellaris-main-panel">
  <div className="panel-header">
    <h2>Available Matches</h2>
    <div className="panel-stats">
      <span className="match-counter">12/50</span>
      <span className="daily-limit">Today's Matches</span>
    </div>
  </div>

  <div className="stellaris-character-grid">
    {characters.map(character => (
      <div key={character.id} className="character-grid-item">
        <div className="character-portrait-frame">
          <img src={character.image} alt={character.name} />
          <div className="compatibility-overlay">
            <span className="compatibility-score">{character.compatibility}%</span>
          </div>
        </div>
        
        <div className="character-actions">
          <button className="stellaris-btn reject">✕</button>
          <button className="stellaris-btn like">💖</button>
          <button className="stellaris-btn super-like">⭐</button>
        </div>
        
        <div className="character-info">
          <h4>{character.name}</h4>
          <span className="species-tag">{character.species}</span>
        </div>
      </div>
    ))}
  </div>
</div>
```

### Relationship Management (Resource-Style Tracking)
**Stellaris Resource Panel for Relationships:**
```jsx
<div className="stellaris-relationships-panel">
  <div className="panel-header">
    <h3>Active Relationships</h3>
    <button className="auto-manage-btn">🤖 Auto Manage</button>
  </div>

  <div className="relationship-breakdown">
    {relationships.map(rel => (
      <div key={rel.id} className="relationship-line">
        <div className="character-mini-portrait">
          <img src={rel.character.image} alt={rel.character.name} />
        </div>
        
        <div className="relationship-details">
          <span className="character-name">{rel.character.name}</span>
          <div className="relationship-resources">
            <span className="resource affection">💖 {rel.affection}</span>
            <span className="resource trust">🤝 {rel.trust}</span>
            <span className="resource compatibility">🧠 {rel.compatibility}%</span>
          </div>
        </div>

        <div className="relationship-actions">
          <button className="stellaris-icon-btn">💬</button>
          <button className="stellaris-icon-btn">🎁</button>
          <button className="stellaris-icon-btn">📅</button>
        </div>
      </div>
    ))}
  </div>

  <div className="relationship-status">
    <div className="status-line">
      <span className="status-label">Daily Messages</span>
      <span className="status-value">{dailyMessages}/10</span>
    </div>
    <div className="status-line">
      <span className="status-label">Active Dates</span>
      <span className="status-value">{activeDates}</span>
    </div>
  </div>
</div>
```

### Conversation Interface (Stellaris Console Style)
**Terminal-Style Dating Conversations:**
```jsx
<div className="stellaris-conversation-panel">
  <div className="conversation-header">
    <div className="character-portrait-small">
      <img src={activeCharacter.image} alt={activeCharacter.name} />
      <div className="online-status"></div>
    </div>
    <div className="conversation-details">
      <h3>{activeCharacter.name}</h3>
      <span className="last-seen">Active now</span>
    </div>
  </div>

  <div className="stellaris-console-area">
    <div className="conversation-log">
      {messages.map(message => (
        <div key={message.id} className={`message ${message.sender}`}>
          <span className="message-timestamp">[{message.time}]</span>
          <span className="message-content">{message.text}</span>
        </div>
      ))}
    </div>

    <div className="conversation-input">
      <div className="stellaris-response-grid">
        {responseOptions.map(option => (
          <button key={option.id} className="response-option">
            <span className="option-icon">{option.icon}</span>
            <span className="option-text">{option.text}</span>
            <span className="affection-change">+{option.affectionGain}</span>
          </button>
        ))}
      </div>
    </div>
  </div>
</div>
```

### Date Planning (Building/Research Style)
**Stellaris Research Tree for Date Activities:**
```jsx
<div className="stellaris-date-planner">
  <div className="panel-header">
    <h2>Plan Date Activity</h2>
    <div className="date-budget">
      <span className="resource energy">⚡ 150</span>
      <span className="resource influence">🏛️ 50</span>
    </div>
  </div>

  <div className="activity-categories">
    <div className="activity-section">
      <h4>Casual Activities</h4>
      <div className="stellaris-selection-grid">
        {casualActivities.map(activity => (
          <div key={activity.id} className="activity-grid-item">
            <div className="activity-icon">
              <img src={activity.icon} alt={activity.name} />
            </div>
            <div className="activity-cost">
              <span className="cost energy">⚡{activity.energyCost}</span>
            </div>
            <button className="add-button">+</button>
          </div>
        ))}
      </div>
    </div>

    <div className="activity-section">
      <h4>Romantic Activities</h4>
      <div className="stellaris-selection-grid">
        {romanticActivities.map(activity => (
          <div key={activity.id} className="activity-grid-item">
            <div className="activity-icon">
              <img src={activity.icon} alt={activity.name} />
            </div>
            <div className="activity-requirements">
              <span className="req affection">💖 {activity.minAffection}</span>
            </div>
            <button className="add-button">+</button>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>
```

## Responsive Design

### Mobile-First Approach
- Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`)
- Stellaris theme includes responsive breakpoints
- Stack cards vertically on mobile
- Adjust button sizes for touch interfaces

### Example Responsive Card:
```jsx
<div className="card">
  <div className="flex flex-col md:flex-row md:items-center gap-4">
    <img className="w-24 h-24 md:w-32 md:h-32 rounded-lg mx-auto md:mx-0" />
    <div className="text-center md:text-left">
      <h3 className="brand text-lg md:text-xl">{name}</h3>
      <p className="subtitle">{species}</p>
    </div>
  </div>
</div>
```

## Performance Considerations

### CSS Loading
1. Load Tailwind first (utility classes)
2. Load Stellaris theme second (component styles)
3. Use CSS custom properties for dynamic theming

### Animation Performance
- Stellaris animations use `transform` and `opacity` for GPU acceleration
- Starfield background uses `mix-blend-mode` - test on lower-end devices
- Consider `prefers-reduced-motion` for accessibility

## Accessibility

### Color Contrast
- Stellaris theme provides high contrast ratios
- Test with screen readers
- Ensure focus states are visible

### Interactive Elements
```jsx
<button 
  className="btn primary"
  aria-label="Send Super Like"
  tabIndex={0}
>
  💖 Super Like
</button>
```

## Future Enhancements

1. **CSS Custom Properties**: Use CSS variables for dynamic theming based on selected character
2. **Motion Design**: Add micro-interactions for dating app feedback
3. **Faction Colors**: Adapt accent colors based on character species
4. **Progressive Enhancement**: Graceful fallbacks for older browsers

## Migration Checklist

- [ ] Import Stellaris CSS into globals.css
- [ ] Wrap app in `.stellaris-theme` class
- [ ] Migrate character cards to use `.card` class
- [ ] Update buttons to use `.btn` variants
- [ ] Replace progress bars with Stellaris `.progress` component
- [ ] Add starfield background to main screens
- [ ] Test responsive behavior on mobile devices
- [ ] Verify accessibility compliance
- [ ] Performance test animations on lower-end devices
