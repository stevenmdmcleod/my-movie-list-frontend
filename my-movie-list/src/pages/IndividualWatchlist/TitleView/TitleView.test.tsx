import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TitleView from './TitleView';

const mockTitles = [
  { id: 1, title: 'Movie A', poster: 'posterA.jpg' },
  { id: 2, title: 'Movie B', poster: 'posterB.jpg' },
];

const mockWatchlist = {
  listId: '123',
  userId: 'user1',
  titles: [],
  collaborators: [],
  comments: [],
  likes: [],
  listName: 'My List',
  isPublic: true,
};

describe('TitleView Component', () => {
  it('renders all titles passed in', () => {
    render(
      <MemoryRouter>
        <TitleView
          titles={mockTitles}
          setTitles={jest.fn()}
          userIsOwner={true}
          userIsCollaborator={false}
          watchlistData={mockWatchlist}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Movie A')).toBeInTheDocument();
    expect(screen.getByText('Movie B')).toBeInTheDocument();
  });
});
