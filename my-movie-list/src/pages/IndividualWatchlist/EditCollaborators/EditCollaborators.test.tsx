import { render, screen, fireEvent } from '@testing-library/react';
import EditCollaborators from './EditCollaborators';

interface EditCollaboratorsProps {
    ownerProfile: Profile | null,
    watchlist: Watchlist,
    collaborators: Array<Profile>,
    setCollaborators: (profiles: Array<Profile>) => void, 
    isOpen: boolean,
    onClose: () => void
}

const mockProfile: Profile = {
    userId: '123',
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
    collaborators:[mockProfile],
    likes:[],
    comments:[],
    listName:'TestList',
    isPublic:true
}

const mockProps: EditCollaboratorsProps = {
    ownerProfile: mockProfile,
    watchlist: mockWatchlist,
    collaborators: mockWatchlist.collaborators,
    setCollaborators: jest.fn(),
    isOpen: true,
    onClose: jest.fn()
}

describe('EditCollaborators Component', () => {
    beforeAll(() => {
        if (!HTMLDialogElement.prototype.showModal) {
          HTMLDialogElement.prototype.showModal = jest.fn();
        }
        if (!HTMLDialogElement.prototype.close) {
          HTMLDialogElement.prototype.close = jest.fn();
        }
      });
    it('renders collaborator editing controls', () => {
        render(<EditCollaborators {...mockProps} />);
        // Check if one of the collaborator emails appears
        expect(screen.getByText(mockProps.collaborators[0].username)).toBeInTheDocument();
        // Check for a close button or similar key action
        const closeButton = screen.getByTestId('edit-collaborators-dialog-close');
        expect(closeButton).toBeInTheDocument();
    });

    it('calls onClose when the dialog is closed', () => {
        render(<EditCollaborators {...mockProps} />);
        // This test is very basic—simulate a click on an "Add" or "Remove" button if available.
        // For example, if there's a button to remove the first collaborator:
        const closeButton = screen.getByTestId('edit-collaborators-dialog-close');
        fireEvent.click(closeButton);
        expect(mockProps.onClose).toHaveBeenCalled();
    });
});