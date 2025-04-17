import { render, screen } from '@testing-library/react';
import WatchlistHeaderControls from './WatchlistHeaderControls';
import { MemoryRouter } from 'react-router-dom';

interface WatchlistHeaderControlsProps {
  userIsOwner: boolean,
  ownerProfile: Profile | null,
  userProfile: Profile | null,
  watchlistData: Watchlist,
  likedLists: Array<string>,
  setLikedLists: (newLikedList: Array<string>) => void,
  isPublic: boolean,
  setIsPublic: (newIsPublic: boolean) => void,
  listName: string,
  setListName: (newListName: string) => void,
  collaborators: Array<Profile>,
  setCollaborators: (newCollaborators: Array<Profile>) => void
}

const mockProfile = {
    userId: '1231241234',
    username: 'testUser',
    email: 'test@test.com',
    biography: 'test bio',
    profilePicture: '',
    preferredGenres: [],
    isAdmin: false,
    isBanned: false,
    collaborativeLists: [],
    likedLists: [],
    friends: [],
    recentlyAdded: [],
  }

const mockWatchlist = {
    listId: '456',
    userId:'123',
    titles:[],
    collaborators:[],
    likes:[],
    comments:[],
    listName:'TestList',
    isPublic:true
}

const mockProps:WatchlistHeaderControlsProps = {
    userIsOwner: true,
    ownerProfile: mockProfile,
    userProfile: mockProfile,
    watchlistData: mockWatchlist,
    likedLists: mockProfile.likedLists,
    setLikedLists: jest.fn(),
    isPublic: mockWatchlist.isPublic,
    setIsPublic: jest.fn(),
    listName: mockWatchlist.listName,
    setListName: jest.fn(),
    collaborators: mockWatchlist.collaborators,
    setCollaborators: jest.fn(),
};

describe('WatchlistHeaderControls Component', () => {

    beforeAll(() => {
      if (!HTMLDialogElement.prototype.showModal) {
        HTMLDialogElement.prototype.showModal = jest.fn();
      }
      if (!HTMLDialogElement.prototype.close) {
        HTMLDialogElement.prototype.close = jest.fn();
      }
    });

  it('renders without crashing', () => {
    render(<WatchlistHeaderControls {...mockProps}/>, { wrapper: MemoryRouter });

    expect(screen.getByText(mockWatchlist.listName)).toBeInTheDocument();
  });
  it('shows the edit icon when user is owner', () => {
    render(<WatchlistHeaderControls {...mockProps} />, { wrapper: MemoryRouter });
    const editIcon = screen.getByTestId('edit-watchlist-icon');
    expect(editIcon).toBeVisible();
  });

  it('does not show the edit icon when user is not owner', () => {
    render(
      <WatchlistHeaderControls {...mockProps} userIsOwner={false} />,
      { wrapper: MemoryRouter }
    );
    expect(screen.queryByTestId('edit-watchlist-icon')).not.toBeInTheDocument();
  });
});