import { render, screen } from '@testing-library/react';
import Profile from './Profile';
import * as useProfileDataHook from '../../hooks/useProfileData';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../hooks/useProfileData', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../../utils/jwt', () => ({
  decodeToken: jest.fn(() => ({ userId: '1234' })),
  isTokenValid: jest.fn(() => true),
}));

describe('Profile Component', () => {
    beforeAll(() => {

        window.HTMLDialogElement.prototype.close = jest.fn();
        window.HTMLDialogElement.prototype.showModal = jest.fn();
        });
    beforeEach(() => {
        jest.spyOn(useProfileDataHook, 'default').mockReturnValue({
        data: {
            userId: '1234',
            username: 'Test User',
            email: 'test@example.com',
            biography: 'Just a test user.',
            preferredGenres: ['Action', 'Comedy'],
            profilePicture: '',
            isAdmin: false,
            isBanned: false,
            collaborativeLists: [],
            likedLists: [],
            friends: [],
            recentlyAdded: [],
            signedUrl: ''
        },
        loading: false,
        });
    });

    it('renders profile info', () => {
        render(<Profile />, { wrapper: MemoryRouter });

        expect(screen.getByText('Test User')).toBeInTheDocument();
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
        expect(screen.getByText('Just a test user.', { selector: 'p' })).toBeInTheDocument();
    });

    it('renders genres', () => {
        render(<Profile />, { wrapper: MemoryRouter });

        expect(screen.getByTestId('profile-genres')).toHaveTextContent('Action, Comedy');
    });
});