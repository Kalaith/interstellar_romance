import { apiClient } from './apiClient';
import { ApiError, ApiResponse } from './types';
import { PlayerCreationInput } from '../types/game';

type HttpMethod = 'get' | 'post';

async function request<T>(method: HttpMethod, url: string, payload?: unknown): Promise<T> {
  try {
    const response =
      method === 'get'
        ? await apiClient.get<ApiResponse<T>>(url)
        : await apiClient.post<ApiResponse<T>>(url, payload);

    if (!response.data.success) {
      throw new ApiError(response.data.error || 'Backend request failed', response.status);
    }

    return response.data.data as T;
  } catch (error: unknown) {
    const maybeAxiosError = error as {
      response?: { status?: number; data?: { error?: string; message?: string } };
      message?: string;
    };
    const status = maybeAxiosError.response?.status ?? 500;
    const message =
      maybeAxiosError.response?.data?.error ||
      maybeAxiosError.response?.data?.message ||
      maybeAxiosError.message ||
      'Backend request failed';

    throw new ApiError(message, status);
  }
}

export const gameApi = {
  getLoginInfo: () =>
    request<{
      login_url: string;
    }>('get', '/api/auth/login-info'),
  createGuestSession: () =>
    request<{
      token: string;
      user: {
        id: string;
        username: string;
        display_name: string;
        roles: string[];
        is_guest: boolean;
        auth_type: 'guest';
      };
    }>('post', '/api/auth/guest-session'),
  linkGuestAccount: (guestToken: string) =>
    request<{
      merged: boolean;
      game_state: unknown;
    }>('post', '/api/auth/link-guest', { guest_token: guestToken }),
  loadGame: () => request<unknown>('get', '/api/game'),
  startGame: (player: PlayerCreationInput) => request<unknown>('post', '/api/game/start', player),
  selectCharacter: (characterId: string) =>
    request<unknown>('post', '/api/character/select', { character_id: characterId }),
  chooseDialogue: (characterId: string, optionId: string, timezone: string) =>
    request<unknown>('post', '/api/dialogue/choose', {
      character_id: characterId,
      option_id: optionId,
      timezone,
    }),
  completeDate: (characterId: string, datePlanId: string) =>
    request<unknown>('post', '/api/date/complete', {
      character_id: characterId,
      date_plan_id: datePlanId,
    }),
  completeActivities: (activityIds: string[]) =>
    request<unknown>('post', '/api/week/activities', { activity_ids: activityIds }),
  completeSelfImprovement: (activityId: string) =>
    request<unknown>('post', '/api/self-improvement', { activity_id: activityId }),
  completeStorylineChoice: (storylineId: string, choiceId: string) =>
    request<unknown>('post', '/api/storyline/choice', {
      storyline_id: storylineId,
      choice_id: choiceId,
    }),
  useSuperLike: (characterId: string) =>
    request<unknown>('post', '/api/super-like', { character_id: characterId }),
  createConflict: (characterId: string, force = false) =>
    request<unknown>('post', '/api/conflict/create', { character_id: characterId, force }),
  resolveConflict: (conflictId: string, optionId: string) =>
    request<unknown>('post', '/api/conflict/resolve', {
      conflict_id: conflictId,
      option_id: optionId,
    }),
  refreshMoods: () => request<unknown>('post', '/api/moods/refresh'),
};
