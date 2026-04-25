import { createRequire } from 'module';
import { pathToFileURL } from 'url';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';

const scriptDir = path.dirname(new URL(import.meta.url).pathname);
const normalizedScriptDir =
  process.platform === 'win32' && scriptDir.startsWith('/') ? scriptDir.slice(1) : scriptDir;
const repoRoot = path.resolve(normalizedScriptDir, '..', '..');
const frontendRoot = path.join(repoRoot, 'frontend');
const backendRoot = path.join(repoRoot, 'backend');
const outputPath = path.join(backendRoot, 'database', 'seed_data.sql');
const requireFromFrontend = createRequire(path.join(frontendRoot, 'package.json'));
const esbuildPath = requireFromFrontend.resolve('esbuild');
const esbuild = await import(pathToFileURL(esbuildPath).href);

const entry = `
import { CHARACTERS } from './frontend/src/data/characters.ts';
import * as gameConstants from './frontend/src/constants/gameConstants.ts';
import * as dialogue from './frontend/src/data/dialogue-trees.ts';
import { datePlans } from './frontend/src/data/date-plans.ts';
import { ACTIVITIES } from './frontend/src/data/activities.ts';
import { selfImprovementActivities } from './frontend/src/data/self-improvement.ts';
import { ACHIEVEMENTS } from './frontend/src/data/achievements.ts';
import { defaultMilestones } from './frontend/src/data/milestones.ts';
import { moodDescriptions, moodEffects } from './frontend/src/data/moods.ts';
import * as photoGalleries from './frontend/src/data/photo-galleries.ts';
import * as storylines from './frontend/src/data/character-storylines.ts';
import * as superLikes from './frontend/src/data/super-likes.ts';
import * as conflicts from './frontend/src/data/relationship-conflicts.ts';
import * as icebreakers from './frontend/src/data/icebreaker-messages.ts';
import * as personalityGrowth from './frontend/src/data/personality-growth.ts';

export default {
  CHARACTERS,
  gameConstants,
  dialogue,
  datePlans,
  ACTIVITIES,
  selfImprovementActivities,
  ACHIEVEMENTS,
  defaultMilestones,
  moodDescriptions,
  moodEffects,
  photoGalleries,
  storylines,
  superLikes,
  conflicts,
  icebreakers,
  personalityGrowth
};
`;

const bundlePath = path.join(os.tmpdir(), `interstellar-content-${Date.now()}.mjs`);
await esbuild.build({
  stdin: {
    contents: entry,
    resolveDir: repoRoot,
    loader: 'ts',
  },
  outfile: bundlePath,
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'es2022',
  define: {
    'import.meta.env.DEV': 'false',
    'import.meta.env.PROD': 'true',
  },
});

const contentModule = await import(pathToFileURL(bundlePath).href);
await fs.unlink(bundlePath);
const content = contentModule.default;

const now = '2026-04-25 00:00:00';
const currentCharacterIds = new Set(content.CHARACTERS.map(character => character.id));

function sqlString(value) {
  if (value === null || value === undefined) {
    return 'NULL';
  }

  return `'${String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\u0000/g, '')
    .replace(/'/g, "''")
    .replace(/\r\n/g, '\\n')
    .replace(/\n/g, '\\n')}'`;
}

function sqlNumber(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return 'NULL';
  }

  return String(Number(value));
}

function sqlBool(value) {
  return value ? '1' : '0';
}

function sqlJson(value) {
  return sqlString(JSON.stringify(value ?? null));
}

function upsert(table, columns, rows, updateColumns = columns) {
  if (rows.length === 0) {
    return [];
  }

  const updates = updateColumns.map(column => `${column} = VALUES(${column})`).join(', ');
  return rows.map(row => {
    const values = columns.map(column => row[column]).join(', ');
    return `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${values})` +
      (updates === '' ? ';' : ` ON DUPLICATE KEY UPDATE ${updates};`);
  });
}

function activeMilestones() {
  const firstCharacter = content.CHARACTERS[0];
  return Array.isArray(firstCharacter?.milestones) ? firstCharacter.milestones : content.defaultMilestones;
}

function defaultKnownInfo() {
  const firstCharacter = content.CHARACTERS[0];
  return firstCharacter?.knownInfo ?? {
    name: true,
    appearance: true,
    species: false,
    basicPersonality: false,
    mood: false,
    interests: false,
    conversationStyle: false,
    values: false,
    background: false,
    goals: false,
    dealbreakers: false,
    favoriteTopics: false,
    deepPersonality: false,
    secretTraits: false,
  };
}

function relationshipLevels() {
  return [
    ['stranger', 0, 10, 'Unknown', "You've just met {character}. There's much to discover about this intriguing individual."],
    ['acquaintance', 11, 20, 'New Acquaintance', 'You and {character} are getting to know each other. First impressions are forming.'],
    ['friend', 21, 35, 'Friend', "{character} has become a valued friend. You enjoy each other's company and conversation."],
    ['close_friend', 36, 50, 'Close Friend', 'You and {character} share a deep friendship built on trust and mutual understanding.'],
    ['romantic_interest', 51, 65, 'Romantic Interest', "There's a spark between you and {character}. Romance is blossoming in your relationship."],
    ['dating', 66, 80, 'Dating', 'You and {character} are officially dating. Your romantic connection continues to deepen.'],
    ['committed_partner', 81, 95, 'Committed Partner', '{character} is your committed romantic partner. Your bond is strong and meaningful.'],
    ['soulmate', 96, 100, 'Soulmate', '{character} is your soulmate. Your connection transcends the ordinary - a perfect union of hearts and minds.'],
  ];
}

function flattenDialogueOptions(tree) {
  const rows = [];
  let order = 0;

  for (const option of tree.rootOptions ?? []) {
    rows.push({ option, parent: null, sort: order++ });
  }

  for (const [parent, options] of Object.entries(tree.branches ?? {})) {
    for (const option of options) {
      rows.push({ option, parent, sort: order++ });
    }
  }

  return rows.map(({ option, parent, sort }) => ({
    option_id: sqlString(option.id),
    tree_id: sqlString(tree.id),
    character_id: sqlString(tree.characterId),
    parent_option_id: sqlString(parent),
    text: sqlString(option.text),
    topic: sqlString(option.topic),
    emotion: sqlString(option.emotion ?? null),
    requires_affection: sqlNumber(option.requiresAffection ?? null),
    requires_mood: sqlString(option.requiresMood ?? null),
    next_option_ids_json: sqlJson(option.nextOptions ?? []),
    sort_order: sqlNumber(sort),
  }));
}

const lines = [
  '-- Generated by backend/scripts/generate-seed-data.mjs',
  '-- Source: frontend/src/data and frontend/src/constants',
  'SET NAMES utf8mb4;',
  'START TRANSACTION;',
];

lines.push(...upsert(
  'content_versions',
  ['version_id', 'source', 'generated_at'],
  [{
    version_id: sqlString('interstellar_romance_frontend_content_v1'),
    source: sqlString('frontend/src/data'),
    generated_at: sqlString(now),
  }]
));

const constantRows = [
  ['affection_thresholds', null, content.gameConstants.affectionThresholds, 'Affection thresholds used by game rules.'],
  ['interaction_limits', null, content.gameConstants.interactionLimits, 'Daily interaction limits by affection band.'],
  ['compatibility_scores', null, content.gameConstants.compatibilityScores, 'Compatibility score labels.'],
  ['stat_thresholds', null, content.gameConstants.statThresholds, 'Player stat threshold labels.'],
  ['milestone_thresholds', null, content.gameConstants.milestoneThresholds, 'Relationship milestone thresholds.'],
  ['personality_growth_limits', null, content.gameConstants.personalityGrowthLimits, 'Personality growth limits.'],
  ['validation_limits', null, content.gameConstants.validationLimits, 'Input validation limits.'],
  ['default_known_info', null, defaultKnownInfo(), 'Initial progressive disclosure state.'],
].map(([key, numeric, json, description]) => ({
  constant_key: sqlString(key),
  numeric_value: sqlNumber(numeric),
  json_value: sqlJson(json),
  description: sqlString(description),
}));
lines.push(...upsert('game_constants', ['constant_key', 'numeric_value', 'json_value', 'description'], constantRows));

const knowledgeRows = [
  ['name', null, null],
  ['appearance', null, null],
  ['species', 0, null],
  ['basicPersonality', 0, null],
  ['mood', 5, null],
  ['interests', 10, null],
  ['conversationStyle', 15, null],
  ['values', 25, null],
  ['background', 35, null],
  ['goals', 50, null],
  ['dealbreakers', 60, null],
  ['favoriteTopics', 70, null],
  ['deepPersonality', null, 2],
  ['secretTraits', null, 4],
].map(([infoKey, affection, milestoneCount], index) => ({
  info_key: sqlString(infoKey),
  required_affection: sqlNumber(affection),
  required_milestone_count: sqlNumber(milestoneCount),
  sort_order: sqlNumber(index),
}));
lines.push(...upsert(
  'knowledge_unlock_rules',
  ['info_key', 'required_affection', 'required_milestone_count', 'sort_order'],
  knowledgeRows
));

lines.push(...upsert(
  'relationship_levels',
  ['level_key', 'min_affection', 'max_affection', 'title_template', 'description_template', 'sort_order'],
  relationshipLevels().map(([key, min, max, title, description], index) => ({
    level_key: sqlString(key),
    min_affection: sqlNumber(min),
    max_affection: sqlNumber(max),
    title_template: sqlString(title),
    description_template: sqlString(description),
    sort_order: sqlNumber(index),
  }))
));

const characterRows = content.CHARACTERS.map((character, index) => ({
  character_id: sqlString(character.id),
  name: sqlString(character.name),
  species: sqlString(character.species),
  gender: sqlString(character.gender),
  personality: sqlString(character.personality),
  image: sqlString(character.image),
  profile_json: sqlJson(character.profile),
  relationship_template_json: sqlJson({
    ...character.relationshipStatus,
    lastStatusChange: null,
  }),
  sort_order: sqlNumber(index),
  updated_at: sqlString(now),
}));
lines.push(...upsert(
  'characters',
  ['character_id', 'name', 'species', 'gender', 'personality', 'image', 'profile_json', 'relationship_template_json', 'sort_order', 'updated_at'],
  characterRows
));

const traitRows = [];
for (const character of content.CHARACTERS) {
  for (const trait of character.personalityGrowth ?? []) {
    traitRows.push({
      character_id: sqlString(character.id),
      source_key: sqlString('active'),
      trait_key: sqlString(trait.trait),
      base_value: sqlNumber(trait.baseValue),
      current_value: sqlNumber(trait.currentValue),
      max_growth: sqlNumber(trait.maxGrowth),
      min_growth: sqlNumber(trait.minGrowth),
    });
  }
}
for (const [characterId, traits] of Object.entries(content.personalityGrowth.initialPersonalityTraits ?? {})) {
  for (const trait of traits) {
    traitRows.push({
      character_id: sqlString(characterId),
      source_key: sqlString('legacy'),
      trait_key: sqlString(trait.trait),
      base_value: sqlNumber(trait.baseValue),
      current_value: sqlNumber(trait.currentValue),
      max_growth: sqlNumber(trait.maxGrowth),
      min_growth: sqlNumber(trait.minGrowth),
    });
  }
}
lines.push(...upsert(
  'character_personality_traits',
  ['character_id', 'source_key', 'trait_key', 'base_value', 'current_value', 'max_growth', 'min_growth'],
  traitRows
));

const photoRows = [];
for (const character of content.CHARACTERS) {
  for (const [index, photo] of (character.photoGallery ?? []).entries()) {
    photoRows.push({
      character_id: sqlString(character.id),
      photo_id: sqlString(photo.id),
      url: sqlString(photo.url),
      title: sqlString(photo.title),
      description: sqlString(photo.description),
      unlocked_at_affection: sqlNumber(photo.unlockedAt),
      starts_unlocked: sqlBool(photo.unlocked),
      rarity: sqlString(photo.rarity),
      sort_order: sqlNumber(index),
    });
  }
}
for (const [characterId, photos] of Object.entries(content.photoGalleries.characterPhotoGalleries ?? {})) {
  if (currentCharacterIds.has(characterId)) {
    continue;
  }
  for (const [index, photo] of photos.entries()) {
    photoRows.push({
      character_id: sqlString(characterId),
      photo_id: sqlString(photo.id),
      url: sqlString(photo.url),
      title: sqlString(photo.title),
      description: sqlString(photo.description),
      unlocked_at_affection: sqlNumber(photo.unlockedAt),
      starts_unlocked: sqlBool(photo.unlocked),
      rarity: sqlString(photo.rarity),
      sort_order: sqlNumber(index),
    });
  }
}
lines.push(...upsert(
  'character_photos',
  ['character_id', 'photo_id', 'url', 'title', 'description', 'unlocked_at_affection', 'starts_unlocked', 'rarity', 'sort_order'],
  photoRows
));

lines.push(...upsert(
  'relationship_milestones',
  ['milestone_id', 'name', 'description', 'unlocked_at_affection', 'sort_order'],
  activeMilestones().map((milestone, index) => ({
    milestone_id: sqlString(milestone.id),
    name: sqlString(milestone.name),
    description: sqlString(milestone.description),
    unlocked_at_affection: sqlNumber(milestone.unlockedAt),
    sort_order: sqlNumber(index),
  }))
));

lines.push(...upsert(
  'moods',
  ['mood_key', 'description', 'bonus', 'penalty', 'preferred_topics_json'],
  Object.entries(content.moodDescriptions).map(([moodKey, description]) => ({
    mood_key: sqlString(moodKey),
    description: sqlString(description),
    bonus: sqlNumber(content.moodEffects[moodKey]?.bonus ?? 0),
    penalty: sqlNumber(content.moodEffects[moodKey]?.penalty ?? 0),
    preferred_topics_json: sqlJson(content.moodEffects[moodKey]?.preferredTopics ?? []),
  }))
));

const dialogueTrees = [
  content.dialogue.kyrathenDialogue,
  content.dialogue.seraphinaDialogue,
  content.dialogue.thessarianDialogue,
  content.dialogue.lyralynnDialogue,
  content.dialogue.zaranthaDialogue,
  content.dialogue.thalassosDialogue,
  content.dialogue.nightshadeDialogue,
  content.dialogue.kronosDialogue,
].filter(Boolean);
lines.push(...upsert(
  'dialogue_options',
  ['option_id', 'tree_id', 'character_id', 'parent_option_id', 'text', 'topic', 'emotion', 'requires_affection', 'requires_mood', 'next_option_ids_json', 'sort_order'],
  dialogueTrees.flatMap(flattenDialogueOptions)
));

lines.push(...upsert(
  'dialogue_responses',
  ['option_id', 'response_text', 'emotion', 'affection_change', 'consequence'],
  Object.entries(content.dialogue.dialogueResponses ?? {}).map(([optionId, response]) => ({
    option_id: sqlString(optionId),
    response_text: sqlString(response.text),
    emotion: sqlString(response.emotion),
    affection_change: sqlNumber(response.affectionChange),
    consequence: sqlString(response.consequence ?? null),
  }))
));

lines.push(...upsert(
  'dialogue_fallbacks',
  ['topic', 'response_text', 'emotion', 'affection_change', 'min_affection'],
  [
    ['greeting', "Hello there! It's good to see you.", 'happy', 1, null],
    ['interests', 'I enjoy many things. Perhaps we could explore some interests together?', 'thoughtful', 2, null],
    ['flirt', "You're quite charming yourself.", 'flirty', 3, 20],
    ['flirt_locked', "That's... quite forward. Maybe we should get to know each other better first?", 'surprised', 0, null],
    ['default', "That's an interesting topic.", 'neutral', 1, null],
  ].map(([topic, responseText, emotion, affectionChange, minAffection]) => ({
    topic: sqlString(topic),
    response_text: sqlString(responseText),
    emotion: sqlString(emotion),
    affection_change: sqlNumber(affectionChange),
    min_affection: sqlNumber(minAffection),
  }))
));

lines.push(...upsert(
  'date_plans',
  ['date_plan_id', 'name', 'description', 'activity_type', 'location', 'duration_minutes', 'preferred_topics_json', 'required_affection', 'compatibility_bonus', 'sort_order'],
  content.datePlans.map((plan, index) => ({
    date_plan_id: sqlString(plan.id),
    name: sqlString(plan.name),
    description: sqlString(plan.description),
    activity_type: sqlString(plan.activityType),
    location: sqlString(plan.location),
    duration_minutes: sqlNumber(plan.duration),
    preferred_topics_json: sqlJson(plan.preferredTopics),
    required_affection: sqlNumber(plan.requiredAffection),
    compatibility_bonus: sqlNumber(plan.compatibilityBonus),
    sort_order: sqlNumber(index),
  }))
));

const activityRows = [
  ...content.ACTIVITIES,
  ...content.selfImprovementActivities,
].map((activity, index) => ({
  activity_id: sqlString(activity.id),
  activity_type: sqlString(activity.type),
  name: sqlString(activity.name),
  description: sqlString(activity.description),
  reward: sqlString(activity.reward),
  category: sqlString(activity.category ?? null),
  stat_bonus_json: sqlJson(activity.statBonus ?? {}),
  energy_cost: sqlNumber(activity.energyCost ?? null),
  time_slots: sqlNumber(activity.timeSlots ?? null),
  sort_order: sqlNumber(index),
}));
lines.push(...upsert(
  'activities',
  ['activity_id', 'activity_type', 'name', 'description', 'reward', 'category', 'stat_bonus_json', 'energy_cost', 'time_slots', 'sort_order'],
  activityRows
));

lines.push(...upsert(
  'achievements',
  ['achievement_id', 'name', 'description', 'icon', 'category', 'condition_json', 'reward_json', 'sort_order'],
  content.ACHIEVEMENTS.map((achievement, index) => ({
    achievement_id: sqlString(achievement.id),
    name: sqlString(achievement.name),
    description: sqlString(achievement.description),
    icon: sqlString(achievement.icon),
    category: sqlString(achievement.category),
    condition_json: sqlJson(achievement.condition),
    reward_json: sqlJson(achievement.reward ?? null),
    sort_order: sqlNumber(index),
  }))
));

const storylineCollections = [
  content.storylines.kyrathenStoryline,
  content.storylines.seraphinaStoryline,
  content.storylines.kronosStoryline,
  content.storylines.thessarianStoryline,
  content.storylines.lyralynnStoryline,
  content.storylines.zaranthaStoryline,
  content.storylines.thalassosStoryline,
  content.storylines.nightshadeStoryline,
].filter(Boolean);
const storylineRows = [];
const choiceRows = [];
const rewardRows = [];
let storylineOrder = 0;
for (const collection of storylineCollections) {
  for (const storyline of collection) {
    storylineRows.push({
      storyline_id: sqlString(storyline.id),
      character_id: sqlString(storyline.characterId),
      required_affection: sqlNumber(storyline.requiredAffection),
      title: sqlString(storyline.title),
      description: sqlString(storyline.description),
      dialogue: sqlString(storyline.dialogue),
      sort_order: sqlNumber(storylineOrder++),
    });
    for (const [index, choice] of (storyline.choices ?? []).entries()) {
      choiceRows.push({
        storyline_id: sqlString(storyline.id),
        choice_id: sqlString(choice.id),
        text: sqlString(choice.text),
        consequence: sqlString(choice.consequence),
        affection_change: sqlNumber(choice.affectionChange),
        unlock_next_storyline_id: sqlString(choice.unlockNext ?? null),
        sort_order: sqlNumber(index),
      });
    }
    for (const [index, reward] of (storyline.rewards ?? []).entries()) {
      rewardRows.push({
        storyline_id: sqlString(storyline.id),
        reward_id: sqlString(reward.id),
        reward_type: sqlString(reward.type),
        description: sqlString(reward.description),
        sort_order: sqlNumber(index),
      });
    }
  }
}
lines.push(...upsert(
  'storylines',
  ['storyline_id', 'character_id', 'required_affection', 'title', 'description', 'dialogue', 'sort_order'],
  storylineRows
));
lines.push(...upsert(
  'storyline_choices',
  ['storyline_id', 'choice_id', 'text', 'consequence', 'affection_change', 'unlock_next_storyline_id', 'sort_order'],
  choiceRows
));
lines.push(...upsert(
  'storyline_rewards',
  ['storyline_id', 'reward_id', 'reward_type', 'description', 'sort_order'],
  rewardRows
));

const defaultSuperLike = {
  affectionBonus: 12,
  specialDialogue: true,
  moodBoost: true,
  temporaryCompatibilityBonus: 10,
  duration: 8,
};
const superLikeEffects = { ...content.superLikes.superLikeEffects };
for (const characterId of currentCharacterIds) {
  if (!superLikeEffects[characterId]) {
    superLikeEffects[characterId] = defaultSuperLike;
  }
}
lines.push(...upsert(
  'super_like_effects',
  ['character_id', 'affection_bonus', 'special_dialogue', 'mood_boost', 'temporary_compatibility_bonus', 'duration_hours'],
  Object.entries(superLikeEffects).map(([characterId, effect]) => ({
    character_id: sqlString(characterId),
    affection_bonus: sqlNumber(effect.affectionBonus),
    special_dialogue: sqlBool(effect.specialDialogue),
    mood_boost: sqlBool(effect.moodBoost),
    temporary_compatibility_bonus: sqlNumber(effect.temporaryCompatibilityBonus),
    duration_hours: sqlNumber(effect.duration),
  }))
));

const responseRows = [];
for (const [characterId, responses] of Object.entries(content.superLikes.superLikeResponses ?? {})) {
  for (const [index, responseText] of responses.entries()) {
    responseRows.push({
      character_id: sqlString(characterId),
      response_index: sqlNumber(index),
      response_text: sqlString(responseText),
    });
  }
}
for (const character of content.CHARACTERS) {
  if (content.superLikes.superLikeResponses?.[character.id]) {
    continue;
  }
  responseRows.push({
    character_id: sqlString(character.id),
    response_index: sqlNumber(0),
    response_text: sqlString(`${character.name} is visibly moved by the intensity of your attention.`),
  });
}
lines.push(...upsert(
  'super_like_responses',
  ['character_id', 'response_index', 'response_text'],
  responseRows
));

const unlockRows = [];
for (const [characterId, unlocks] of Object.entries(content.superLikes.superLikeUnlocks ?? {})) {
  unlockRows.push({
    character_id: sqlString(characterId),
    dialogue_json: sqlJson(unlocks.dialogue ?? []),
    content_json: sqlJson(unlocks.content ?? []),
  });
}
for (const character of content.CHARACTERS) {
  if (content.superLikes.superLikeUnlocks?.[character.id]) {
    continue;
  }
  unlockRows.push({
    character_id: sqlString(character.id),
    dialogue_json: sqlJson(['A more vulnerable conversation becomes possible.']),
    content_json: sqlJson(['Unlocked: heightened romantic attention']),
  });
}
lines.push(...upsert(
  'super_like_unlocks',
  ['character_id', 'dialogue_json', 'content_json'],
  unlockRows
));

lines.push(...upsert(
  'conflict_templates',
  ['conflict_type', 'base_affection_penalty'],
  Object.entries(content.conflicts.conflictTemplates ?? {}).map(([conflictType, template]) => ({
    conflict_type: sqlString(conflictType),
    base_affection_penalty: sqlNumber(template.baseAffectionPenalty),
  }))
));

const conflictTriggerRows = [];
const conflictDescriptionRows = [];
for (const [conflictType, template] of Object.entries(content.conflicts.conflictTemplates ?? {})) {
  for (const [index, trigger] of template.triggers.entries()) {
    conflictTriggerRows.push({
      conflict_type: sqlString(conflictType),
      trigger_text: sqlString(trigger),
      sort_order: sqlNumber(index),
    });
  }
  for (const [characterId, description] of Object.entries(template.descriptions ?? {})) {
    conflictDescriptionRows.push({
      conflict_type: sqlString(conflictType),
      character_id: sqlString(characterId),
      description: sqlString(description),
    });
  }
  for (const character of content.CHARACTERS) {
    if (!template.descriptions?.[character.id]) {
      conflictDescriptionRows.push({
        conflict_type: sqlString(conflictType),
        character_id: sqlString(character.id),
        description: sqlString(`${character.name} feels tension around ${conflictType.replace(/_/g, ' ')} and wants to address it honestly.`),
      });
    }
  }
}
lines.push(...upsert(
  'conflict_template_triggers',
  ['conflict_type', 'trigger_text', 'sort_order'],
  conflictTriggerRows
));
lines.push(...upsert(
  'conflict_template_descriptions',
  ['conflict_type', 'character_id', 'description'],
  conflictDescriptionRows
));

lines.push(...upsert(
  'conflict_resolution_options',
  ['option_id', 'method', 'label', 'description', 'requirements_json', 'preview_json', 'sort_order'],
  (content.conflicts.baseResolutionOptions ?? []).map((option, index) => ({
    option_id: sqlString(option.id),
    method: sqlString(option.method),
    label: sqlString(option.label),
    description: sqlString(option.description),
    requirements_json: sqlJson(option.requirements ?? null),
    preview_json: sqlJson(option.preview),
    sort_order: sqlNumber(index),
  }))
));

const characterResolutionRows = [];
for (const [characterId, options] of Object.entries(content.conflicts.characterSpecificResolutions ?? {})) {
  for (const [index, option] of options.entries()) {
    characterResolutionRows.push({
      character_id: sqlString(characterId),
      option_id: sqlString(option.id),
      method: sqlString(option.method),
      label: sqlString(option.label),
      description: sqlString(option.description),
      requirements_json: sqlJson(option.requirements ?? null),
      preview_json: sqlJson(option.preview),
      sort_order: sqlNumber(index),
    });
  }
}
lines.push(...upsert(
  'character_resolution_options',
  ['character_id', 'option_id', 'method', 'label', 'description', 'requirements_json', 'preview_json', 'sort_order'],
  characterResolutionRows
));

const icebreakerRows = [];
for (const categories of Object.values(content.icebreakers.icebreakerTemplates ?? {})) {
  for (const messages of Object.values(categories)) {
    for (const message of messages) {
      icebreakerRows.push({
        icebreaker_id: sqlString(message.id),
        character_id: sqlString(message.characterId),
        category: sqlString(message.category),
        message: sqlString(message.message),
        context_json: sqlJson(message.context),
        effectiveness: sqlNumber(message.effectiveness),
        sort_order: sqlNumber(icebreakerRows.length),
      });
    }
  }
}
lines.push(...upsert(
  'icebreaker_messages',
  ['icebreaker_id', 'character_id', 'category', 'message', 'context_json', 'effectiveness', 'sort_order'],
  icebreakerRows
));

const growthTriggerRows = [];
for (const [triggerKey, effects] of Object.entries(content.personalityGrowth.personalityGrowthTriggers ?? {})) {
  for (const [traitKey, changeAmount] of Object.entries(effects)) {
    growthTriggerRows.push({
      trigger_key: sqlString(triggerKey),
      trait_key: sqlString(traitKey),
      change_amount: sqlNumber(changeAmount),
    });
  }
}
lines.push(...upsert(
  'personality_growth_triggers',
  ['trigger_key', 'trait_key', 'change_amount'],
  growthTriggerRows
));

lines.push('COMMIT;');
lines.push('');

await fs.writeFile(outputPath, lines.join('\n'), 'utf8');
console.log(`Wrote ${path.relative(repoRoot, outputPath)} with ${lines.length} statements.`);
