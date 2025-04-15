import { render, screen } from '@testing-library/react';
import TitleCard from './TitleCard';
import { MemoryRouter } from 'react-router-dom';

const mockTitle = { id: 1, title: 'Mock Title', poster: 'mock.jpg' };

describe('TitleCard Component', () => {
  it('renders title name and image', () => {
    render(
      <TitleCard
        titleInfo={mockTitle}
        handleDelete={jest.fn()}
        userCanDelete={false}
      />,
      { wrapper: MemoryRouter }
    );

    expect(screen.getByText('Mock Title')).toBeInTheDocument();
    expect(screen.getByAltText('Title Poster')).toBeInTheDocument();
  });

  it('shows delete icon if user can delete', () => {
    render(
      <TitleCard
        titleInfo={mockTitle}
        handleDelete={jest.fn()}
        userCanDelete={true}
      />,
      { wrapper: MemoryRouter }
    );

    const deleteIcon = screen.getAllByTestId('title-card-delete'); 
    expect(deleteIcon[0]).toBeInTheDocument(); 
  });
  it("doesn't shows delete icon if user can delete", () => {
    render(
      <TitleCard
        titleInfo={mockTitle}
        handleDelete={jest.fn()}
        userCanDelete={false}
      />,
      { wrapper: MemoryRouter }
    );

    const deleteIcon = screen.queryAllByTestId('title-card-delete'); 
    expect(deleteIcon.length).toBe(0); 
  });
});
