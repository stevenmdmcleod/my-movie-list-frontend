import { render, screen, fireEvent } from '@testing-library/react';
import CommentSection from './CommentSection';
import { MemoryRouter } from 'react-router';

const mockWatchlist = {
  listId: '456',
  userId: 'user1',
  listName: 'My List',
  isPublic: true,
  collaborators: [],
  titles: [],
  comments: [],
  likes: [],
};

const mockComments = [
  {
    commentId: '1',
    userId: 'u1',
    username: 'User One',
    comment: 'Great!',
    datePosted: '2024-04-01T10:00:00Z',
  },
  {
    commentId: '2',
    userId: 'u2',
    username: 'User Two',
    comment: 'Interesting choice!',
    datePosted: '2024-04-01T12:00:00Z',
  },
];

describe('CommentSection Component', () => {
  it('renders comment section and all comments', () => {
    render(
      <CommentSection
        comments={mockComments}
        setComments={jest.fn()}
        watchlistData={mockWatchlist}
      />,  { wrapper: MemoryRouter }
    );

    expect(screen.getByText('Comments')).toBeInTheDocument();
    expect(screen.getByText('Great!')).toBeInTheDocument();
    expect(screen.getByText('Interesting choice!')).toBeInTheDocument();
  });

  it('updates textarea when typing', () => {
    render(
      <CommentSection
        comments={mockComments}
        setComments={jest.fn()}
        watchlistData={mockWatchlist}
      />,  { wrapper: MemoryRouter }
    );

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'New comment' } });
    expect(textarea).toHaveValue('New comment');
  });
});
