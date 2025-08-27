// Game State Management
class GameState {
    constructor() {
        this.player = {
            name: '',
            species: 'human',
            traits: [],
            backstory: 'diplomat',
            stats: {
                charisma: 5,
                intelligence: 5,
                adventure: 5,
                empathy: 5,
                technology: 5
            }
        };
        
        this.currentWeek = 1;
        this.credits = 100;
        this.currentScreen = 'main-menu';
        this.activitiesThisWeek = 0;
        this.selectedActivities = [];
        this.characterCreated = false;
        
        this.characters = {
            zarath: {
                name: "Zara'thul",
                species: "Plantoid - Cactus Species",
                personality: ["Wise", "Patient", "Eco-conscious"],
                interests: ["Botany", "Philosophy", "Terraforming"],
                backstory: "Senior botanist from a desert world, dedicated to preserving life",
                affection: 0,
                met: false,
                dialogues: {
                    greeting: [
                        "Greetings, fellow being. The stars have brought us together in this vast cosmos.",
                        "Your presence brings a refreshing energy to my day, like morning dew on desert blooms.",
                        "I find great joy in our conversations. They help me understand the diversity of life."
                    ],
                    interests: [
                        "I spend my cycles studying how life adapts to harsh environments. Every world has its own beauty.",
                        "Philosophy teaches us that growth requires patience, much like nurturing a rare seedling.",
                        "Terraforming is not about conquest, but about creating harmony between worlds and their inhabitants."
                    ],
                    backstory: [
                        "I come from Xeris Prime, where water is precious and every plant is a miracle of adaptation.",
                        "My people believe that all life is interconnected. We are gardeners of the galaxy.",
                        "I've spent decades learning how different species can coexist and thrive together."
                    ],
                    flirt: [
                        "Like a rare flower, your company brings color to my otherwise methodical existence.",
                        "In all my botanical studies, I've never encountered anything as fascinating as you.",
                        "Perhaps we could explore the hydroponics bay together? I'd love to show you my favorite specimens."
                    ]
                }
            },
            velnari: {
                name: "Captain Vel'nari",
                species: "Humanoid - Blue-skinned",
                personality: ["Confident", "Adventurous", "Diplomatic"],
                interests: ["Space exploration", "Alien cultures", "Archaeology"],
                backstory: "Starship captain and cultural liaison officer",
                affection: 0,
                met: false,
                dialogues: {
                    greeting: [
                        "Commander! Always a pleasure to see a fellow explorer in these parts of the galaxy.",
                        "Your reputation precedes you. I've heard excellent things about your work.",
                        "Between missions, I always enjoy good company and stimulating conversation."
                    ],
                    interests: [
                        "I've explored seventeen different star systems, and each one teaches me something new about the universe.",
                        "Understanding alien cultures isn't just diplomatic necessity—it's the key to galactic harmony.",
                        "Last month I discovered pre-FTL ruins on Kepler-442c. The artifacts suggest a fascinating civilization."
                    ],
                    backstory: [
                        "I started as a junior diplomat, but my wanderlust led me to command my own exploration vessel.",
                        "The Stellar Meridian is my ship—fast, elegant, and equipped for any diplomatic mission.",
                        "I've negotiated first contact with twelve species. Each encounter was unique and enlightening."
                    ],
                    flirt: [
                        "You know, exploring the galaxy is wonderful, but it's even better with the right companion.",
                        "I'd love to show you the view from my ship's observation deck—it's quite romantic under the nebula.",
                        "Care to join me for dinner? I know a charming little restaurant on the station's upper levels."
                    ]
                }
            },
            kethra: {
                name: "Dr. Keth'ra",
                species: "Aquatic - Fish-like",
                personality: ["Intelligent", "Graceful", "Mysterious"],
                interests: ["Marine biology", "Deep space research", "Meditation"],
                backstory: "Research scientist specializing in exotic matter studies",
                affection: 0,
                met: false,
                dialogues: {
                    greeting: [
                        "The currents of fate have brought you to me today. How fascinating.",
                        "Your energy resonates at an interesting frequency. Most intriguing.",
                        "In the depths of space, as in the depths of oceans, we find unexpected connections."
                    ],
                    interests: [
                        "My research focuses on dark matter interactions in aquatic environments—truly mind-bending physics.",
                        "Meditation helps me process the vast complexity of the universe. Stillness brings clarity.",
                        "I study how consciousness might be distributed throughout cosmic phenomena. Revolutionary work."
                    ],
                    backstory: [
                        "I hail from the oceanic world of Aquatica, where thought and water flow as one.",
                        "My doctorate in xenobiology led me to discover new forms of exotic matter in deep space.",
                        "I've spent years studying the connection between consciousness and quantum mechanics."
                    ],
                    flirt: [
                        "Your mind creates fascinating ripples in the fabric of reality around us.",
                        "I sense great depth in you—like the deepest ocean trenches of my homeworld.",
                        "Would you join me in the meditation chambers? I find shared contemplation quite... intimate."
                    ]
                }
            },
            ryxtal: {
                name: "Commander Ryx'tal",
                species: "Reptilian - Lizard-like",
                personality: ["Strategic", "Honor-bound", "Protective"],
                interests: ["Military tactics", "Ancient history", "Engineering"],
                backstory: "Decorated military officer from an honor-based society",
                affection: 0,
                met: false,
                dialogues: {
                    greeting: [
                        "Honor to you, respected colleague. Your reputation as a capable leader precedes you.",
                        "It is good to meet someone who understands the weight of command and responsibility.",
                        "In my experience, true strength comes from knowing when to fight and when to protect."
                    ],
                    interests: [
                        "Military strategy is like a complex dance—every move must be calculated, every outcome considered.",
                        "Ancient military history teaches us that honor and tactics must work together for true victory.",
                        "I design defensive systems for colony worlds. Protection of the innocent is our highest calling."
                    ],
                    backstory: [
                        "I come from Draconus, where honor is earned through service and sacrifice for others.",
                        "My military service has taken me to the edge of known space, defending peaceful worlds.",
                        "I've commanded everything from patrol squadrons to massive defense fleets."
                    ],
                    flirt: [
                        "Your strength impresses me. True warriors recognize quality in others.",
                        "I would be honored to have someone of your caliber fighting alongside me.",
                        "Perhaps you'd join me in the tactical simulation chamber? I could teach you some... advanced maneuvers."
                    ]
                }
            },
            morgeth: {
                name: "Sage Mor'geth",
                species: "Molluscoid - Tentacled",
                personality: ["Thoughtful", "Empathetic", "Artistic"],
                interests: ["Philosophy", "Art", "Psychic phenomena"],
                backstory: "Psionic researcher and cultural anthropologist",
                affection: 0,
                met: false,
                dialogues: {
                    greeting: [
                        "Your psychic emanations are quite beautiful today. A pleasure to experience them.",
                        "I sense great potential in you—a mind capable of profound artistic and philosophical thought.",
                        "Welcome, kindred spirit. The universe speaks to us in many beautiful languages."
                    ],
                    interests: [
                        "Philosophy is the art of asking the right questions about existence, consciousness, and meaning.",
                        "My latest sculpture explores the intersection of emotion and quantum mechanics—quite moving.",
                        "Psychic phenomena reveal the hidden connections between all conscious beings in the galaxy."
                    ],
                    backstory: [
                        "I am from the contemplative world of Cerebros, where thought and art merge into one discipline.",
                        "My research combines anthropology with psionic studies—understanding cultures through psychic resonance.",
                        "I've documented the artistic expressions of forty-seven different species across the galaxy."
                    ],
                    flirt: [
                        "Your thoughts create the most beautiful patterns in the psychic realm. Quite captivating.",
                        "I sense a deep emotional resonance between us—a connection that transcends mere physical interaction.",
                        "Would you model for my next sculpture? I see great beauty in your form and spirit."
                    ]
                }
            },
            thexik: {
                name: "Engineer Thex'ik",
                species: "Arthropoid - Insectoid",
                personality: ["Logical", "Innovative", "Curious"],
                interests: ["Technology", "Starship engineering", "Efficiency optimization"],
                backstory: "Brilliant engineer working on megastructure projects",
                affection: 0,
                met: false,
                dialogues: {
                    greeting: [
                        "Greetings. Your arrival has increased the efficiency of my day by 23.7 percent.",
                        "Fascinating. I detect optimal compatibility parameters in our interaction protocols.",
                        "Your presence creates interesting variables in my otherwise predictable routine."
                    ],
                    interests: [
                        "I'm currently optimizing fusion reactor designs for maximum energy output with minimal waste.",
                        "Starship engineering requires perfect balance between structural integrity and operational efficiency.",
                        "My latest project involves designing a Dyson sphere collector array—quite the challenge!"
                    ],
                    backstory: [
                        "I originate from the hive-mind world of Mechanicus, where individual innovation is highly valued.",
                        "My engineering achievements include improvements to three different classes of starship drives.",
                        "I've contributed to the construction of seventeen space stations and four orbital habitats."
                    ],
                    flirt: [
                        "Your cognitive patterns create fascinating resonance frequencies in my neural networks.",
                        "I calculate a 94.6% compatibility rating between our personality matrices. Most intriguing.",
                        "Would you like to see my private workshop? I have some... experimental technologies I'd love to show you."
                    ]
                }
            }
        };
    }

    // Update character affection
    updateAffection(characterId, amount) {
        if (this.characters[characterId]) {
            this.characters[characterId].affection = Math.max(0, Math.min(100, 
                this.characters[characterId].affection + amount));
            this.updateAffectionDisplay(characterId);
        }
    }

    // Update affection display in UI
    updateAffectionDisplay(characterId) {
        const character = this.characters[characterId];
        if (character) {
            // Update in character cards
            const cardAffectionFill = document.querySelector(`[data-character="${characterId}"] .affection-fill`);
            const cardAffectionValue = document.querySelector(`[data-character="${characterId}"] .affection-value`);
            
            if (cardAffectionFill) {
                cardAffectionFill.style.width = `${character.affection}%`;
            }
            if (cardAffectionValue) {
                cardAffectionValue.textContent = character.affection;
            }

            // Update in interaction screen if currently viewing this character
            const interactionFill = document.getElementById('interaction-affection-fill');
            const interactionText = document.getElementById('interaction-affection-text');
            
            if (interactionFill && game.currentCharacter === characterId) {
                interactionFill.style.width = `${character.affection}%`;
                interactionText.textContent = `Affection: ${character.affection}/100`;
            }
        }
    }

    // Update player stats display
    updateStatsDisplay() {
        const charismaStat = document.getElementById('charisma-stat');
        const intelligenceStat = document.getElementById('intelligence-stat');
        const adventureStat = document.getElementById('adventure-stat');
        const empathyStat = document.getElementById('empathy-stat');
        const technologyStat = document.getElementById('technology-stat');

        if (charismaStat) charismaStat.textContent = this.player.stats.charisma;
        if (intelligenceStat) intelligenceStat.textContent = this.player.stats.intelligence;
        if (adventureStat) adventureStat.textContent = this.player.stats.adventure;
        if (empathyStat) empathyStat.textContent = this.player.stats.empathy;
        if (technologyStat) technologyStat.textContent = this.player.stats.technology;
    }

    // Advance to next week
    nextWeek() {
        this.currentWeek++;
        this.activitiesThisWeek = 0;
        this.selectedActivities = [];
        const weekElement = document.getElementById('current-week');
        if (weekElement) {
            weekElement.textContent = this.currentWeek;
        }
    }
}

// Initialize game state
const game = new GameState();

// Screen Management
function showScreen(screenId) {
    console.log('Showing screen:', screenId);
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        game.currentScreen = screenId;
    } else {
        console.error('Screen not found:', screenId);
    }
}

// Character Creation Logic
function setupCharacterCreation() {
    const traitCheckboxes = document.querySelectorAll('input[name="traits"]');
    
    traitCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkedBoxes = document.querySelectorAll('input[name="traits"]:checked');
            if (checkedBoxes.length > 2) {
                this.checked = false;
            }
        });
    });

    const createCharacterBtn = document.getElementById('create-character-btn');
    if (createCharacterBtn) {
        createCharacterBtn.addEventListener('click', function() {
            const name = document.getElementById('player-name').value;
            const species = document.getElementById('player-species').value;
            const backstory = document.getElementById('backstory').value;
            const selectedTraits = Array.from(document.querySelectorAll('input[name="traits"]:checked'))
                .map(checkbox => checkbox.value);

            if (!name.trim()) {
                alert('Please enter your character name.');
                return;
            }

            if (selectedTraits.length !== 2) {
                alert('Please select exactly 2 traits.');
                return;
            }

            // Update game state
            game.player.name = name;
            game.player.species = species;
            game.player.backstory = backstory;
            game.player.traits = selectedTraits;
            game.characterCreated = true;

            // Apply trait bonuses
            selectedTraits.forEach(trait => {
                switch(trait) {
                    case 'charismatic':
                        game.player.stats.charisma += 2;
                        break;
                    case 'intelligent':
                        game.player.stats.intelligence += 2;
                        break;
                    case 'adventurous':
                        game.player.stats.adventure += 2;
                        break;
                    case 'empathetic':
                        game.player.stats.empathy += 2;
                        break;
                    case 'tech-savvy':
                        game.player.stats.technology += 2;
                        break;
                }
            });

            // Update display
            const playerDisplayName = document.getElementById('player-display-name');
            if (playerDisplayName) {
                playerDisplayName.textContent = name;
            }
            game.updateStatsDisplay();

            // Go to main hub
            showScreen('main-hub');
        });
    }
}

// Character Interaction Logic
function setupCharacterInteractions() {
    // Character card clicks
    document.querySelectorAll('.character-card').forEach(card => {
        card.addEventListener('click', function() {
            const characterId = this.dataset.character;
            openCharacterInteraction(characterId);
        });
    });

    // Dialogue options
    document.querySelectorAll('.dialogue-option').forEach(button => {
        button.addEventListener('click', function() {
            const topic = this.dataset.topic;
            showDialogue(game.currentCharacter, topic);
        });
    });
}

function openCharacterInteraction(characterId) {
    game.currentCharacter = characterId;
    const character = game.characters[characterId];
    
    if (!character.met) {
        character.met = true;
        game.updateAffection(characterId, 5); // First meeting bonus
    }

    // Update character display
    const imageMap = {
        zarath: "https://pplx-res.cloudinary.com/image/upload/v1753245899/pplx_project_search_images/ca4ea9771d7c7564e030f38aa0dd7360b7936b6b.jpg",
        velnari: "https://pplx-res.cloudinary.com/image/upload/v1753245899/pplx_project_search_images/e95cdb53efa6232c36d1a108bad460d7041e918b.jpg",
        kethra: "https://pplx-res.cloudinary.com/image/upload/v1753245899/pplx_project_search_images/4d0c2669763ba29ea236ff892d76124b8b9e1208.jpg",
        ryxtal: "https://pplx-res.cloudinary.com/image/upload/v1753245899/pplx_project_search_images/1a002dfee1f9dd851d63c86c06e1d4a34adb5dbb.jpg",
        morgeth: "https://pplx-res.cloudinary.com/image/upload/v1753245899/pplx_project_search_images/3b50ab4fdc907c1e2d49fb226e812d5da1fc8f54.jpg",
        thexik: "https://pplx-res.cloudinary.com/image/upload/v1753245899/pplx_project_search_images/e901ac18f5b5edc006767e8e795115de4e06fe3c.jpg"
    };

    const interactionImage = document.getElementById('interaction-character-image');
    const interactionName = document.getElementById('interaction-character-name');
    const interactionSpecies = document.getElementById('interaction-character-species');

    if (interactionImage) interactionImage.src = imageMap[characterId];
    if (interactionName) interactionName.textContent = character.name;
    if (interactionSpecies) interactionSpecies.textContent = character.species;
    
    game.updateAffectionDisplay(characterId);
    
    // Reset dialogue
    const dialogueText = document.getElementById('dialogue-text');
    if (dialogueText) {
        dialogueText.textContent = 'Select a conversation topic to begin...';
    }
    
    showScreen('character-interaction');
}

function showDialogue(characterId, topic) {
    const character = game.characters[characterId];
    const dialogues = character.dialogues[topic];
    
    if (dialogues && dialogues.length > 0) {
        // Select random dialogue
        const randomDialogue = dialogues[Math.floor(Math.random() * dialogues.length)];
        const dialogueText = document.getElementById('dialogue-text');
        if (dialogueText) {
            dialogueText.textContent = randomDialogue;
        }
        
        // Calculate affection gain based on player stats and topic
        let affectionGain = 0;
        let success = true;
        
        switch(topic) {
            case 'greeting':
                affectionGain = Math.floor(game.player.stats.charisma / 3) + 1;
                break;
            case 'interests':
                if (characterId === 'zarath' || characterId === 'kethra') {
                    affectionGain = Math.floor(game.player.stats.intelligence / 2) + 1;
                } else if (characterId === 'velnari') {
                    affectionGain = Math.floor(game.player.stats.adventure / 2) + 1;
                } else if (characterId === 'ryxtal') {
                    affectionGain = Math.floor(game.player.stats.adventure / 3) + Math.floor(game.player.stats.intelligence / 3) + 1;
                } else if (characterId === 'morgeth') {
                    affectionGain = Math.floor(game.player.stats.empathy / 2) + 1;
                } else if (characterId === 'thexik') {
                    affectionGain = Math.floor(game.player.stats.technology / 2) + 1;
                }
                break;
            case 'backstory':
                affectionGain = Math.floor(game.player.stats.empathy / 2) + 2;
                break;
            case 'flirt':
                const flirtRequirement = character.affection >= 20;
                if (flirtRequirement) {
                    affectionGain = Math.floor(game.player.stats.charisma / 2) + 3;
                } else {
                    success = false;
                    if (dialogueText) {
                        dialogueText.textContent = 
                            `${character.name} seems a bit uncomfortable with your advance. Perhaps you should get to know them better first.`;
                    }
                    affectionGain = -2;
                }
                break;
        }
        
        game.updateAffection(characterId, affectionGain);
    }
}

// Activities System
function setupActivitiesSystem() {
    const activitiesBtn = document.getElementById('activities-btn');
    if (activitiesBtn) {
        activitiesBtn.addEventListener('click', function() {
            const activitiesWeek = document.getElementById('activities-week');
            if (activitiesWeek) {
                activitiesWeek.textContent = game.currentWeek;
            }
            showScreen('activities-screen');
        });
    }

    document.querySelectorAll('.activity-card').forEach(card => {
        card.addEventListener('click', function() {
            const activity = this.dataset.activity;
            toggleActivitySelection(activity, this);
        });
    });

    const confirmActivitiesBtn = document.getElementById('confirm-activities-btn');
    if (confirmActivitiesBtn) {
        confirmActivitiesBtn.addEventListener('click', function() {
            executeActivities();
        });
    }

    const cancelActivitiesBtn = document.getElementById('cancel-activities-btn');
    if (cancelActivitiesBtn) {
        cancelActivitiesBtn.addEventListener('click', function() {
            showScreen('main-hub');
        });
    }
}

function toggleActivitySelection(activity, cardElement) {
    if (game.selectedActivities.includes(activity)) {
        // Deselect
        game.selectedActivities = game.selectedActivities.filter(a => a !== activity);
        cardElement.classList.remove('selected');
    } else if (game.selectedActivities.length < 2) {
        // Select
        game.selectedActivities.push(activity);
        cardElement.classList.add('selected');
    }

    updateActivitySelection();
}

function updateActivitySelection() {
    const selectedCount = document.getElementById('selected-count');
    const selectedActivitiesDiv = document.getElementById('selected-activities');
    const confirmBtn = document.getElementById('confirm-activities-btn');

    if (selectedCount) {
        selectedCount.textContent = game.selectedActivities.length;
    }
    
    if (selectedActivitiesDiv) {
        selectedActivitiesDiv.innerHTML = '';
        game.selectedActivities.forEach(activity => {
            const tag = document.createElement('span');
            tag.className = 'selected-activity-tag';
            tag.textContent = getActivityName(activity);
            selectedActivitiesDiv.appendChild(tag);
        });
    }

    if (confirmBtn) {
        confirmBtn.disabled = game.selectedActivities.length !== 2;
    }
}

function getActivityName(activity) {
    const names = {
        work: 'Work Assignment',
        social: 'Social Event',
        research: 'Research Project',
        exploration: 'Exploration Mission',
        meditation: 'Meditation Retreat',
        training: 'Skills Training'
    };
    return names[activity] || activity;
}

function executeActivities() {
    game.selectedActivities.forEach(activity => {
        switch(activity) {
            case 'work':
                const randomStat = ['charisma', 'intelligence', 'adventure', 'empathy', 'technology'][Math.floor(Math.random() * 5)];
                game.player.stats[randomStat]++;
                game.credits += 50;
                break;
            case 'social':
                game.player.stats.charisma++;
                // Random chance to increase affection with someone
                const randomCharacter = Object.keys(game.characters)[Math.floor(Math.random() * 6)];
                game.updateAffection(randomCharacter, 3);
                break;
            case 'research':
                game.player.stats.intelligence += 2;
                game.player.stats.technology++;
                break;
            case 'exploration':
                game.player.stats.adventure += 2;
                // Small chance of finding rare items (placeholder)
                break;
            case 'meditation':
                game.player.stats.empathy += 2;
                game.player.stats.charisma++;
                break;
            case 'training':
                // Player chooses which stat to improve
                game.player.stats.charisma++; // Simplified for now
                break;
        }
    });

    game.updateStatsDisplay();
    game.nextWeek();
    
    // Clear selection
    game.selectedActivities = [];
    document.querySelectorAll('.activity-card').forEach(card => card.classList.remove('selected'));
    updateActivitySelection();

    showScreen('main-hub');
}

// Event Listeners Setup
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Setting up event listeners');

    // Main menu buttons
    const startGameBtn = document.getElementById('start-game-btn');
    if (startGameBtn) {
        startGameBtn.addEventListener('click', function() {
            console.log('Start Game clicked');
            if (game.characterCreated) {
                showScreen('main-hub');
            } else {
                showScreen('character-creation');
            }
        });
    }

    const characterCreationBtn = document.getElementById('character-creation-btn');
    if (characterCreationBtn) {
        characterCreationBtn.addEventListener('click', function() {
            console.log('Character Creation clicked');
            showScreen('character-creation');
        });
    }

    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            alert('Settings coming soon!');
        });
    }

    // Character creation back button
    const backToMenuBtn = document.getElementById('back-to-menu-btn');
    if (backToMenuBtn) {
        backToMenuBtn.addEventListener('click', function() {
            showScreen('main-menu');
        });
    }

    // Hub navigation
    const menuBtn = document.getElementById('menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            showScreen('main-menu');
        });
    }

    const inventoryBtn = document.getElementById('inventory-btn');
    if (inventoryBtn) {
        inventoryBtn.addEventListener('click', function() {
            alert('Inventory system coming soon!');
        });
    }

    // Character interaction navigation
    const backToHubBtn = document.getElementById('back-to-hub-btn');
    if (backToHubBtn) {
        backToHubBtn.addEventListener('click', function() {
            showScreen('main-hub');
        });
    }

    const giveGiftBtn = document.getElementById('give-gift-btn');
    if (giveGiftBtn) {
        giveGiftBtn.addEventListener('click', function() {
            alert('Gift system coming soon!');
        });
    }

    const askOnDateBtn = document.getElementById('ask-on-date-btn');
    if (askOnDateBtn) {
        askOnDateBtn.addEventListener('click', function() {
            const character = game.characters[game.currentCharacter];
            if (character && character.affection >= 30) {
                alert(`${character.name} agrees to go on a date with you! Dating system coming soon!`);
                game.updateAffection(game.currentCharacter, 10);
            } else if (character) {
                alert(`${character.name} politely declines. You need to build more affection first.`);
            }
        });
    }

    // Setup systems
    setupCharacterCreation();
    setupCharacterInteractions();
    setupActivitiesSystem();

    // Initialize displays
    game.updateStatsDisplay();
    
    console.log('Setup complete');
});

// Additional helper functions for future expansion
function saveGameState() {
    // Placeholder for save system
    console.log('Game state saved (placeholder)');
}

function loadGameState() {
    // Placeholder for load system
    console.log('Game state loaded (placeholder)');
}

function checkForSpecialEvents() {
    // Placeholder for random events system
    if (Math.random() < 0.1) { // 10% chance
        // Special event occurs
        console.log('Special event triggered (placeholder)');
    }
}

// Export for potential testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameState, game };
}