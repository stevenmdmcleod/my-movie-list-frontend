import { render, screen, fireEvent } from '@testing-library/react';
import EditProfile from './EditProfile';
import { MemoryRouter } from 'react-router-dom';

const mockProfile = {
  userId: '1234',
  username: 'Test User',
  email: 'test@example.com',
  biography: 'Just a test user.',
  preferredGenres: ['Action'],
  profilePicture: '',
  isAdmin: false,
  isBanned: false,
  collaborativeLists: [],
  likedLists: [],
  friends: [],
  recentlyAdded: []
};

describe('EditProfile Component', () => {

    beforeAll(() => {
        HTMLDialogElement.prototype.showModal = jest.fn();
        HTMLDialogElement.prototype.close = jest.fn();
      });
    const setProfile = jest.fn();
    const setImageSource = jest.fn();
    const onClose = jest.fn();

    it('renders when open', () => {
        render(
        <EditProfile
            profile={mockProfile}
            setProfile={setProfile}
            setImageSource={setImageSource}
            isOpen={true}
            onClose={onClose}
        />,
        { wrapper: MemoryRouter }
        );

        expect(screen.getByText('Edit Profile')).toBeInTheDocument();
        expect(screen.getByLabelText('About Me:')).toBeInTheDocument();
        expect(screen.getByText('Delete Profile')).toBeInTheDocument();
    });

    it('updates biography field', () => {
        render(
        <EditProfile
            profile={mockProfile}
            setProfile={setProfile}
            setImageSource={setImageSource}
            isOpen={true}
            onClose={onClose}
        />,
        { wrapper: MemoryRouter }
        );

        const textarea = screen.getByTestId('edit-profile-biography');
        fireEvent.change(textarea, { target: { value: 'Updated bio' } });
        expect(textarea).toHaveValue('Updated bio');
    });
});
