import { render, screen, fireEvent } from '@testing-library/react';
import EditWatchlist from './EditWatchlist';

describe('EditWatchlist Component', () => {    
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
    const EditWatchlistProps = {
        watchlist: mockWatchlist,
        listName: "Test name",
        setListName: () => null,
        setIsPublic: () => null,
        isOpen: true,
        onClose: () => null
    };

    beforeAll(() => {
        if (!HTMLDialogElement.prototype.showModal) {
          HTMLDialogElement.prototype.showModal = jest.fn();
        }
        if (!HTMLDialogElement.prototype.close) {
          HTMLDialogElement.prototype.close = jest.fn();
        }
      });

    it('renders edit watchlist form when open', () => {
        // If your component uses a boolean to control visibility, pass that prop here.
        render(<EditWatchlist {...EditWatchlistProps} isOpen={true} />);
        // Look for a header or label you know must be in the component.
        expect(screen.getByText(/edit watchlist/i)).toBeInTheDocument();
        // Optionally check for a field with the initial title value
        expect(screen.getByDisplayValue(EditWatchlistProps.listName)).toBeInTheDocument();
    });

    it('updates title input field', () => {
        render(<EditWatchlist {...EditWatchlistProps} isOpen={true} />);
        const titleInput = screen.getByDisplayValue(EditWatchlistProps.listName);
        fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
        expect(titleInput).toHaveValue('Updated Title');
    });
});