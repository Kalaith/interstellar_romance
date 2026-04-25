import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CharacterCreation } from '../src/components/CharacterCreation';
import { useGameStore } from '../src/stores/gameStore';

describe('CharacterCreation', () => {
  beforeEach(() => {
    useGameStore.setState({
      currentScreen: 'character-creation',
      isSaving: false,
      error: null,
      isAuthenticated: true,
    });
  });

  it('calls createPlayer when the create button is clicked with valid input', async () => {
    const createPlayer = vi.fn().mockResolvedValue(undefined);
    useGameStore.setState({ createPlayer });

    render(<CharacterCreation />);

    fireEvent.change(screen.getByPlaceholderText('Enter your name...'), {
      target: { value: 'Nova' },
    });
    fireEvent.click(screen.getByText('Charismatic'));
    fireEvent.click(screen.getByText('Intelligent'));
    fireEvent.click(screen.getByRole('button', { name: /Create Character/i }));

    await waitFor(() => {
      expect(createPlayer).toHaveBeenCalledWith({
        name: 'Nova',
        species: 'human',
        gender: 'male',
        sexualPreference: 'all',
        traits: ['charismatic', 'intelligent'],
        backstory: 'diplomat',
      });
    });
  });
});
