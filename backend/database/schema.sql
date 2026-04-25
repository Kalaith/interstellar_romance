CREATE TABLE IF NOT EXISTS content_versions (
    version_id VARCHAR(64) PRIMARY KEY,
    source VARCHAR(120) NOT NULL,
    generated_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS game_constants (
    constant_key VARCHAR(96) PRIMARY KEY,
    numeric_value INT NULL,
    json_value JSON NULL,
    description VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS knowledge_unlock_rules (
    info_key VARCHAR(64) PRIMARY KEY,
    required_affection INT NULL,
    required_milestone_count INT NULL,
    sort_order INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS relationship_levels (
    level_key VARCHAR(64) PRIMARY KEY,
    min_affection INT NOT NULL,
    max_affection INT NOT NULL,
    title_template VARCHAR(120) NOT NULL,
    description_template TEXT NOT NULL,
    sort_order INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS characters (
    character_id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    species VARCHAR(120) NOT NULL,
    gender VARCHAR(32) NOT NULL,
    personality VARCHAR(160) NOT NULL,
    image VARCHAR(255) NOT NULL,
    profile_json JSON NOT NULL,
    relationship_template_json JSON NOT NULL,
    sort_order INT NOT NULL,
    updated_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS character_personality_traits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    character_id VARCHAR(64) NOT NULL,
    source_key VARCHAR(32) NOT NULL,
    trait_key VARCHAR(64) NOT NULL,
    base_value INT NOT NULL,
    current_value INT NOT NULL,
    max_growth INT NOT NULL,
    min_growth INT NOT NULL,
    UNIQUE KEY uq_character_trait_source (character_id, source_key, trait_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS character_photos (
    character_id VARCHAR(64) NOT NULL,
    photo_id VARCHAR(96) NOT NULL,
    url VARCHAR(255) NOT NULL,
    title VARCHAR(120) NOT NULL,
    description TEXT NOT NULL,
    unlocked_at_affection INT NOT NULL,
    starts_unlocked TINYINT(1) NOT NULL,
    rarity VARCHAR(32) NOT NULL,
    sort_order INT NOT NULL,
    PRIMARY KEY (character_id, photo_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS relationship_milestones (
    milestone_id VARCHAR(96) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    description TEXT NOT NULL,
    unlocked_at_affection INT NOT NULL,
    sort_order INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS moods (
    mood_key VARCHAR(64) PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    bonus INT NOT NULL,
    penalty INT NOT NULL,
    preferred_topics_json JSON NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS dialogue_options (
    option_id VARCHAR(96) PRIMARY KEY,
    tree_id VARCHAR(96) NOT NULL,
    character_id VARCHAR(64) NOT NULL,
    parent_option_id VARCHAR(96) NULL,
    text TEXT NOT NULL,
    topic VARCHAR(64) NOT NULL,
    emotion VARCHAR(64) NULL,
    requires_affection INT NULL,
    requires_mood VARCHAR(64) NULL,
    next_option_ids_json JSON NOT NULL,
    sort_order INT NOT NULL,
    INDEX idx_dialogue_character_parent (character_id, parent_option_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS dialogue_responses (
    option_id VARCHAR(96) PRIMARY KEY,
    response_text TEXT NOT NULL,
    emotion VARCHAR(64) NOT NULL,
    affection_change INT NOT NULL,
    consequence TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS dialogue_fallbacks (
    topic VARCHAR(64) PRIMARY KEY,
    response_text TEXT NOT NULL,
    emotion VARCHAR(64) NOT NULL,
    affection_change INT NOT NULL,
    min_affection INT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS date_plans (
    date_plan_id VARCHAR(96) PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    description TEXT NOT NULL,
    activity_type VARCHAR(64) NOT NULL,
    location VARCHAR(160) NOT NULL,
    duration_minutes INT NOT NULL,
    preferred_topics_json JSON NOT NULL,
    required_affection INT NOT NULL,
    compatibility_bonus INT NOT NULL,
    sort_order INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS activities (
    activity_id VARCHAR(96) NOT NULL,
    activity_type VARCHAR(32) NOT NULL,
    name VARCHAR(160) NOT NULL,
    description TEXT NOT NULL,
    reward VARCHAR(255) NOT NULL,
    category VARCHAR(64) NULL,
    stat_bonus_json JSON NOT NULL,
    energy_cost INT NULL,
    time_slots INT NULL,
    sort_order INT NOT NULL,
    PRIMARY KEY (activity_id, activity_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS achievements (
    achievement_id VARCHAR(96) PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(16) NOT NULL,
    category VARCHAR(64) NOT NULL,
    condition_json JSON NOT NULL,
    reward_json JSON NULL,
    sort_order INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS storylines (
    storyline_id VARCHAR(96) PRIMARY KEY,
    character_id VARCHAR(64) NOT NULL,
    required_affection INT NOT NULL,
    title VARCHAR(160) NOT NULL,
    description TEXT NOT NULL,
    dialogue TEXT NOT NULL,
    sort_order INT NOT NULL,
    INDEX idx_storylines_character (character_id, required_affection)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS storyline_choices (
    storyline_id VARCHAR(96) NOT NULL,
    choice_id VARCHAR(96) NOT NULL,
    text TEXT NOT NULL,
    consequence TEXT NOT NULL,
    affection_change INT NOT NULL,
    unlock_next_storyline_id VARCHAR(96) NULL,
    sort_order INT NOT NULL,
    PRIMARY KEY (storyline_id, choice_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS storyline_rewards (
    storyline_id VARCHAR(96) NOT NULL,
    reward_id VARCHAR(96) NOT NULL,
    reward_type VARCHAR(64) NOT NULL,
    description TEXT NOT NULL,
    sort_order INT NOT NULL,
    PRIMARY KEY (storyline_id, reward_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS super_like_effects (
    character_id VARCHAR(64) PRIMARY KEY,
    affection_bonus INT NOT NULL,
    special_dialogue TINYINT(1) NOT NULL,
    mood_boost TINYINT(1) NOT NULL,
    temporary_compatibility_bonus INT NOT NULL,
    duration_hours INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS super_like_responses (
    character_id VARCHAR(64) NOT NULL,
    response_index INT NOT NULL,
    response_text TEXT NOT NULL,
    PRIMARY KEY (character_id, response_index)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS super_like_unlocks (
    character_id VARCHAR(64) PRIMARY KEY,
    dialogue_json JSON NOT NULL,
    content_json JSON NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS conflict_templates (
    conflict_type VARCHAR(64) PRIMARY KEY,
    base_affection_penalty INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS conflict_template_triggers (
    conflict_type VARCHAR(64) NOT NULL,
    trigger_text VARCHAR(160) NOT NULL,
    sort_order INT NOT NULL,
    PRIMARY KEY (conflict_type, trigger_text)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS conflict_template_descriptions (
    conflict_type VARCHAR(64) NOT NULL,
    character_id VARCHAR(64) NOT NULL,
    description TEXT NOT NULL,
    PRIMARY KEY (conflict_type, character_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS conflict_resolution_options (
    option_id VARCHAR(96) PRIMARY KEY,
    method VARCHAR(64) NOT NULL,
    label VARCHAR(120) NOT NULL,
    description TEXT NOT NULL,
    requirements_json JSON NULL,
    preview_json JSON NOT NULL,
    sort_order INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS character_resolution_options (
    character_id VARCHAR(64) NOT NULL,
    option_id VARCHAR(96) NOT NULL,
    method VARCHAR(64) NOT NULL,
    label VARCHAR(120) NOT NULL,
    description TEXT NOT NULL,
    requirements_json JSON NULL,
    preview_json JSON NOT NULL,
    sort_order INT NOT NULL,
    PRIMARY KEY (character_id, option_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS icebreaker_messages (
    icebreaker_id VARCHAR(96) PRIMARY KEY,
    character_id VARCHAR(64) NOT NULL,
    category VARCHAR(64) NOT NULL,
    message TEXT NOT NULL,
    context_json JSON NOT NULL,
    effectiveness INT NOT NULL,
    sort_order INT NOT NULL,
    INDEX idx_icebreakers_character (character_id, category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS personality_growth_triggers (
    trigger_key VARCHAR(64) NOT NULL,
    trait_key VARCHAR(64) NOT NULL,
    change_amount INT NOT NULL,
    PRIMARY KEY (trigger_key, trait_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS players (
    auth_user_id VARCHAR(128) PRIMARY KEY,
    email VARCHAR(255) NULL,
    username VARCHAR(120) NULL,
    display_name VARCHAR(160) NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS game_saves (
    id INT AUTO_INCREMENT PRIMARY KEY,
    auth_user_id VARCHAR(128) NOT NULL,
    player_name VARCHAR(120) NULL,
    player_species VARCHAR(64) NULL,
    player_gender VARCHAR(32) NULL,
    sexual_preference VARCHAR(64) NULL,
    player_traits_json JSON NOT NULL,
    backstory TEXT NULL,
    charisma INT NOT NULL DEFAULT 0,
    intelligence INT NOT NULL DEFAULT 0,
    adventure INT NOT NULL DEFAULT 0,
    empathy INT NOT NULL DEFAULT 0,
    technology INT NOT NULL DEFAULT 0,
    current_week INT NOT NULL DEFAULT 1,
    total_conversations INT NOT NULL DEFAULT 0,
    total_dates INT NOT NULL DEFAULT 0,
    super_likes_available INT NOT NULL DEFAULT 3,
    conflict_resolution_skill INT NOT NULL DEFAULT 0,
    icebreaker_unlocks_json JSON NOT NULL,
    selected_character_id VARCHAR(64) NULL,
    selected_activities_json JSON NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    UNIQUE KEY uq_game_saves_auth_user (auth_user_id),
    CONSTRAINT fk_game_saves_player FOREIGN KEY (auth_user_id) REFERENCES players(auth_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS relationship_states (
    save_id INT NOT NULL,
    character_id VARCHAR(64) NOT NULL,
    affection INT NOT NULL DEFAULT 0,
    mood VARCHAR(64) NOT NULL DEFAULT 'neutral',
    known_info_json JSON NOT NULL,
    last_interaction_date DATE NULL,
    daily_reset_date DATE NOT NULL,
    interactions_used INT NOT NULL DEFAULT 0,
    max_interactions INT NOT NULL DEFAULT 3,
    timezone VARCHAR(80) NOT NULL DEFAULT 'UTC',
    level_key VARCHAR(64) NOT NULL DEFAULT 'stranger',
    compatibility INT NOT NULL DEFAULT 0,
    trust INT NOT NULL DEFAULT 0,
    intimacy INT NOT NULL DEFAULT 0,
    commitment INT NOT NULL DEFAULT 0,
    communication_style_json JSON NOT NULL,
    shared_experiences INT NOT NULL DEFAULT 0,
    conflicts_count INT NOT NULL DEFAULT 0,
    last_status_change DATETIME NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    PRIMARY KEY (save_id, character_id),
    CONSTRAINT fk_relationship_save FOREIGN KEY (save_id) REFERENCES game_saves(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS relationship_milestone_states (
    save_id INT NOT NULL,
    character_id VARCHAR(64) NOT NULL,
    milestone_id VARCHAR(96) NOT NULL,
    achieved TINYINT(1) NOT NULL DEFAULT 0,
    achieved_at DATETIME NULL,
    PRIMARY KEY (save_id, character_id, milestone_id),
    CONSTRAINT fk_milestone_state_save FOREIGN KEY (save_id) REFERENCES game_saves(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS character_photo_states (
    save_id INT NOT NULL,
    character_id VARCHAR(64) NOT NULL,
    photo_id VARCHAR(96) NOT NULL,
    unlocked TINYINT(1) NOT NULL DEFAULT 0,
    unlocked_at DATETIME NULL,
    PRIMARY KEY (save_id, character_id, photo_id),
    CONSTRAINT fk_photo_state_save FOREIGN KEY (save_id) REFERENCES game_saves(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS achievement_states (
    save_id INT NOT NULL,
    achievement_id VARCHAR(96) NOT NULL,
    progress INT NOT NULL DEFAULT 0,
    achieved TINYINT(1) NOT NULL DEFAULT 0,
    achieved_at DATETIME NULL,
    PRIMARY KEY (save_id, achievement_id),
    CONSTRAINT fk_achievement_state_save FOREIGN KEY (save_id) REFERENCES game_saves(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS storyline_states (
    save_id INT NOT NULL,
    storyline_id VARCHAR(96) NOT NULL,
    unlocked TINYINT(1) NOT NULL DEFAULT 0,
    completed TINYINT(1) NOT NULL DEFAULT 0,
    completed_at DATETIME NULL,
    PRIMARY KEY (save_id, storyline_id),
    CONSTRAINT fk_storyline_state_save FOREIGN KEY (save_id) REFERENCES game_saves(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS date_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    save_id INT NOT NULL,
    character_id VARCHAR(64) NOT NULL,
    date_plan_id VARCHAR(96) NOT NULL,
    success TINYINT(1) NOT NULL,
    affection_gained INT NOT NULL,
    compatibility_at_time INT NOT NULL,
    player_level INT NOT NULL,
    notes TEXT NULL,
    occurred_at DATETIME NOT NULL,
    CONSTRAINT fk_date_history_save FOREIGN KEY (save_id) REFERENCES game_saves(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS relationship_memories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    save_id INT NOT NULL,
    character_id VARCHAR(64) NOT NULL,
    memory_key VARCHAR(128) NOT NULL,
    memory_type VARCHAR(64) NOT NULL,
    title VARCHAR(160) NOT NULL,
    description TEXT NOT NULL,
    emotional_impact INT NOT NULL,
    participant_emotions_json JSON NOT NULL,
    affection_at_time INT NOT NULL,
    consequence TEXT NULL,
    tags_json JSON NOT NULL,
    occurred_at DATETIME NOT NULL,
    CONSTRAINT fk_memory_save FOREIGN KEY (save_id) REFERENCES game_saves(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS relationship_conflicts (
    conflict_id VARCHAR(128) PRIMARY KEY,
    save_id INT NOT NULL,
    character_id VARCHAR(64) NOT NULL,
    conflict_type VARCHAR(64) NOT NULL,
    severity VARCHAR(32) NOT NULL,
    trigger_text VARCHAR(160) NOT NULL,
    description TEXT NOT NULL,
    start_at DATETIME NOT NULL,
    resolved TINYINT(1) NOT NULL DEFAULT 0,
    resolved_at DATETIME NULL,
    resolution_method VARCHAR(64) NULL,
    affection_penalty INT NOT NULL,
    resolution_options_json JSON NOT NULL,
    CONSTRAINT fk_conflict_save FOREIGN KEY (save_id) REFERENCES game_saves(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS temporary_boosts (
    boost_id VARCHAR(128) PRIMARY KEY,
    save_id INT NOT NULL,
    character_id VARCHAR(64) NOT NULL,
    boost_type VARCHAR(64) NOT NULL,
    effect VARCHAR(64) NOT NULL,
    value INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    starts_at DATETIME NOT NULL,
    expires_at DATETIME NOT NULL,
    CONSTRAINT fk_boost_save FOREIGN KEY (save_id) REFERENCES game_saves(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS super_likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    save_id INT NOT NULL,
    character_id VARCHAR(64) NOT NULL,
    effect_json JSON NOT NULL,
    result_json JSON NOT NULL,
    used_at DATETIME NOT NULL,
    CONSTRAINT fk_super_like_save FOREIGN KEY (save_id) REFERENCES game_saves(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS game_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    save_id INT NOT NULL,
    event_type VARCHAR(64) NOT NULL,
    character_id VARCHAR(64) NULL,
    payload_json JSON NOT NULL,
    created_at DATETIME NOT NULL,
    INDEX idx_game_events_save (save_id, created_at),
    CONSTRAINT fk_game_event_save FOREIGN KEY (save_id) REFERENCES game_saves(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
