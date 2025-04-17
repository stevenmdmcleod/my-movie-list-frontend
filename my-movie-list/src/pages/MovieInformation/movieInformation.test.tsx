import { render, screen, waitFor } from '@testing-library/react';
import MovieInformation from './movieInformation';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom';

beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Silence console.error
    jest.spyOn(console, 'log').mockImplementation(() => {});   // Silence console.log
    localStorage.setItem("token", "fake-jwt");
});

const renderWithRouter = (ui: React.ReactElement, route = '/movieinformation/123') => {
  window.history.pushState({}, 'Test page', route);
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/movieinformation/:titleid" element={ui} />
      </Routes>
    </MemoryRouter>
  );
};

describe('MovieInformation Component', () => {
  it('renders loading state initially', () => {
    renderWithRouter(<MovieInformation />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('renders movie information after fetching data', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        title: 'Inception',
        plot_overview: 'A mind-bending thriller.',
        user_rating: 8.8,
        critic_score: 91,
        release_date: '2010-07-16',
        genre_names: ['Action', 'Sci-Fi', 'Thriller'],
        us_rating: 'PG-13',
        type: 'movie',
        poster: 'poster_url',
        trailer: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
        similar_titles: [],
      }),
    });

    renderWithRouter(<MovieInformation />);

    await waitFor(() => {
      expect(screen.getByText(/Inception/i)).toBeInTheDocument();
      expect(screen.getByText(/A mind-bending thriller/i)).toBeInTheDocument();
    });
  });

  it('handles API error gracefully', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    renderWithRouter(<MovieInformation />);

    await waitFor(() => {
      expect(screen.getByText(/Could not fetch movie data/i)).toBeInTheDocument();
    });
  });

  it('renders similar titles', async () => {
    // First call = main movie
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        title: 'Inception',
        plot_overview: 'A mind-bending thriller.',
        user_rating: 8.8,
        critic_score: 91,
        release_date: '2010-07-16',
        genre_names: ['Action', 'Sci-Fi'],
        us_rating: 'PG-13',
        type: 'movie',
        poster: 'poster_url',
        trailer: '',
        similar_titles: [1, 2],
      }),
    });

    // Next two calls = similar titles
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        title: 'Interstellar',
        poster: 'poster_interstellar',
        id: 1,
      }),
    }).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        title: 'The Prestige',
        poster: 'poster_prestige',
        id: 2,
      }),
    });

    renderWithRouter(<MovieInformation />);

    await waitFor(() => {
      expect(screen.getByText('Interstellar')).toBeInTheDocument();
      expect(screen.getByText('The Prestige')).toBeInTheDocument();
    });
  });

});