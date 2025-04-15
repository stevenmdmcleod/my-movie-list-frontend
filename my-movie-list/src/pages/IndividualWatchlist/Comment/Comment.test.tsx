import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../../hooks/useProfileData', () => ({
  __esModule: true,
  default: jest.fn(() => ({ data: { signedUrl: '' } })),
}));

import Comment from './Comment';

const mockComment = {
  commentId: 'c1',
  userId: 'u1',
  username: 'Commenter',
  comment: 'Nice list!',
  datePosted: new Date().toISOString(),
};

describe('Comment Component', () => {
  it('renders comment text and username', () => {
    render(<Comment comment={mockComment} />, { wrapper: MemoryRouter });

    expect(screen.getByText('Commenter')).toBeInTheDocument();
    expect(screen.getByText('Nice list!')).toBeInTheDocument();
  });
});