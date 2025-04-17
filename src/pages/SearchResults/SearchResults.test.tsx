import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SearchResults from './SearchResults';
import * as dbCalls from '../../utils/databaseCalls';
import userEvent from '@testing-library/user-event';

jest.mock('../../utils/databaseCalls');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('SearchResults Component', () => {
  const renderWithRouter = (query: string) => {
    render(
      <MemoryRouter initialEntries={[`/searchresults/${query}`]}>
        <Routes>
          <Route path="/searchresults/:query" element={<SearchResults />} />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {}); // silence console.error
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (dbCalls.searchWatchlistByName as jest.Mock).mockReturnValue(new Promise(() => {}));
    renderWithRouter('inception');
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('renders search results when API call is successful', async () => {
    const mockResults = {
      status: 200,
      data: {
        title_results: [
          {
            id: '1',
            title: 'Inception',
            name: 'Inception', // Add this line
            poster: 'inception.jpg',
          },
          {
            id: '2',
            title: 'The Matrix',
            name: 'The Matrix', // Add this line
            poster: 'matrix.jpg',
          },
        ],
      },
    };
  
    (dbCalls.searchWatchlistByName as jest.Mock).mockResolvedValue(mockResults);
    renderWithRouter('sci-fi');
  
    await waitFor(() => {
      expect(screen.getByText('Inception')).toBeInTheDocument();
      expect(screen.getByText('The Matrix')).toBeInTheDocument();
    });
  
    expect(screen.getByAltText('Inception')).toBeInTheDocument();
    expect(screen.getByAltText('The Matrix')).toBeInTheDocument();
  });

  it('renders no results message if API returns empty list', async () => {
    (dbCalls.searchWatchlistByName as jest.Mock).mockResolvedValue({
      status: 200,
      data: {
        title_results: [],
      },
    });

    renderWithRouter('unknown');

    await waitFor(() => {
      expect(screen.getByText(/No results found./i)).toBeInTheDocument();
    });
  });

  it('renders error message when API call fails', async () => {
    (dbCalls.searchWatchlistByName as jest.Mock).mockRejectedValue(new Error('API failure'));

    renderWithRouter('errorquery');

    await waitFor(() => {
      expect(screen.getByText(/Could not fetch search results./i)).toBeInTheDocument();
    });
  });

  it('navigates to movie page on click', async () => {
    const mockResults = {
      status: 200,
      data: {
        title_results: [
          {
            id: '5',
            title: 'Interstellar',
            poster: 'poster.jpg',
          },
        ],
      },
    };

    (dbCalls.searchWatchlistByName as jest.Mock).mockResolvedValue(mockResults);
    renderWithRouter('space');

    await waitFor(() => {
      expect(screen.getByText('Interstellar')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Interstellar'));
    expect(mockNavigate).toHaveBeenCalledWith('/movieinformation/5');
  });
});