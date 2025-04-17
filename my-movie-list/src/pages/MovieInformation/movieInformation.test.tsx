import { render, screen, waitFor } from '@testing-library/react';
import MovieInformation from './movieInformation';
import '@testing-library/jest-dom';

jest.mock('../../databaseCalls', () => ({
  fetchMovieData: jest.fn(),
  fetchSimilarTitles: jest.fn(),
  fetchUserWatchlists: jest.fn(),
}));

describe('MovieInformation Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<MovieInformation />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('renders movie information after fetching data', async () => {
    const mockMovieData = {
      title: 'Inception',
      description: 'A mind-bending thriller.',
      user_rating: 8.8,
      critic_score: 91,
      release_date: '2010-07-16',
      genre_names: ['Action', 'Sci-Fi', 'Thriller'],
    };

    require('../../DatabaseCalls').fetchMovieData.mockResolvedValue(mockMovieData);

    render(<MovieInformation />);

    await waitFor(() => {
      expect(screen.getByText(/Inception/i)).toBeInTheDocument();
      expect(screen.getByText(/A mind-bending thriller./i)).toBeInTheDocument();
      expect(screen.getByText(/User rating: 8.8/i)).toBeInTheDocument();
      expect(screen.getByText(/Critic score: 91/i)).toBeInTheDocument();
      expect(screen.getByText(/Release date: 2010-07-16/i)).toBeInTheDocument();
      expect(screen.getByText(/Genres: Action, Sci-Fi, Thriller/i)).toBeInTheDocument();
    });
  });

  it('renders similar titles', async () => {
    const mockSimilarTitles = [
      { title: 'Interstellar' },
      { title: 'The Prestige' },
    ];

    require('../../DatabaseCalls').fetchSimilarTitles.mockResolvedValue(mockSimilarTitles);

    render(<MovieInformation />);

    await waitFor(() => {
      mockSimilarTitles.forEach((movie) => {
        expect(screen.getByText(movie.title)).toBeInTheDocument();
      });
    });
  });

  it('renders user watchlists in dropdown', async () => {
    const mockWatchlists = [
      { listId: '1', listName: 'Favorites' },
      { listId: '2', listName: 'Watch Later' },
    ];

    require('../../DatabaseCalls').fetchUserWatchlists.mockResolvedValue(mockWatchlists);

    render(<MovieInformation />);

    await waitFor(() => {
      mockWatchlists.forEach((watchlist) => {
        expect(screen.getByText(watchlist.listName)).toBeInTheDocument();
      });
    });
  });

  it('handles API errors gracefully', async () => {
    require('../../DatabaseCalls').fetchMovieData.mockRejectedValue(new Error('API Error'));

    render(<MovieInformation />);

    await waitFor(() => {
      expect(screen.getByText(/Could not fetch movie data./i)).toBeInTheDocument();
    });
  });
});