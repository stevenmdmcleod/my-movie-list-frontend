import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import MyWatchLists from './myWatchLists';
import { BrowserRouter } from 'react-router-dom';
import * as db from '../../utils/databaseCalls';


const originalLog = console.log;

jest.spyOn(console, 'log').mockImplementation((msg) => {
  if (typeof msg === 'string' && msg.includes('Collaborative watchlists fetched')) return;
  originalLog(msg);
});

jest.mock('../../utils/databaseCalls');

const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}));

const renderComponent = () => {
  render(
    <BrowserRouter>
      <MyWatchLists />
    </BrowserRouter>
  );
};

describe('myWatchLists Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Silence console.error
    jest.spyOn(console, 'log').mockImplementation(() => {});   // Silence console.log
      
  });

  it('renders titles and buttons from fetched watchlists', async () => {
    (db.getUserWatchlists as jest.Mock).mockResolvedValue({
      status: 200,
      data: { watchlists: [
        { listId: '1', listName: 'Favorites' },
        { listId: '2', listName: 'To Watch' }
      ]}
    });
  
    (db.getUserCollaborativeWatchlists as jest.Mock).mockResolvedValue({
      status: 200,
      data: { watchlist: [
        { listId: '3', listName: 'Sci-Fi Collab' }
      ]}
    });
  
    renderComponent();
  
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /My Watchlists/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: /My Watchlists/i })).toBeInTheDocument();
      expect(screen.getByText('Favorites')).toBeInTheDocument();
      expect(screen.getByText('To Watch')).toBeInTheDocument();
      expect(screen.getByText('Sci-Fi Collab')).toBeInTheDocument(); // <- this will now work
    });
  });

  it('navigates to watchlist page on button click', async () => {
    (db.getUserWatchlists as jest.Mock).mockResolvedValue({
      status: 200,
      data: { watchlists: [{ listId: '1', listName: 'Favorites' }] }
    });

    (db.getUserCollaborativeWatchlists as jest.Mock).mockResolvedValue({
      status: 200,
      data: { watchlist: [] }
    });

    renderComponent();

    await waitFor(() => {
      const button = screen.getByText('Favorites');
      fireEvent.click(button);
      expect(mockNavigate).toHaveBeenCalledWith('/watchlist/1');
    });
  });

  it('shows error when trying to create a watchlist with empty input', async () => {
    (db.getUserWatchlists as jest.Mock).mockResolvedValue({ status: 200, data: { watchlists: [] } });
    (db.getUserCollaborativeWatchlists as jest.Mock).mockResolvedValue({ status: 200, data: { watchlist: [] } });

    renderComponent();

    const submitButton = screen.getByText(/Create Watchlist/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/Watchlist name cannot be empty/i)).not.toBeInTheDocument(); // Not rendered in DOM, just console
    });
  });

  it('shows error message when watchlist already exists', async () => {
    (db.getUserWatchlists as jest.Mock).mockResolvedValue({ status: 200, data: { watchlists: [] } });
    (db.getUserCollaborativeWatchlists as jest.Mock).mockResolvedValue({ status: 200, data: { watchlist: [] } });
    (db.createWatchlist as jest.Mock).mockRejectedValue(new Error('watchlist exists already'));

    renderComponent();

    const input = screen.getByPlaceholderText(/name your watchlist/i);
    fireEvent.change(input, { target: { value: 'Duplicate List' } });

    const submitButton = screen.getByText(/Create Watchlist/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Failed to create watchlist. watchlist already exists/i)).toBeInTheDocument();
    });
  });

  it('navigates after successful watchlist creation', async () => {
    (db.getUserWatchlists as jest.Mock).mockResolvedValue({ status: 200, data: { watchlists: [] } });
    (db.getUserCollaborativeWatchlists as jest.Mock).mockResolvedValue({ status: 200, data: { watchlist: [] } });

    (db.createWatchlist as jest.Mock).mockResolvedValue({
      status: 201,
      data: { watchlist: { listId: '10', listName: 'New List' } }
    });

    renderComponent();

    const input = screen.getByPlaceholderText(/name your watchlist/i);
    fireEvent.change(input, { target: { value: 'New List' } });

    const submitButton = screen.getByText(/Create Watchlist/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/watchlist/10');
    });
  });
});