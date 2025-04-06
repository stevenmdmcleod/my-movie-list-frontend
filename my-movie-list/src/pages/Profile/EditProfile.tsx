import { useEffect, useRef } from 'react'
import "./EditProfile.css";
import Profile from './profile';
import SearchableDropdown from './SearchableDropdown';

interface EditProfileProps {
    profile: Profile,
    displayGenres: () => string,
    isOpen: boolean,
    onClose: () => void;
}

const genres = [
    "Action",
    "Adventure",
    "Animation",
    "Anime",
    "Biography",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "Food",
    "Game Show",
    "History",
    "Horror",
    "Kids",
    "Music",
    "Musical",
    "Mystery",
    "Nature",
    "News",
    "Reality",
    "Romance",
    "Science Fiction",
    "Soap",
    "Sports",
    "Supernatural",
    "Talk",
    "Thriller",
    "Travel",
    "War",
    "Western"
]

function EditProfile({profile, displayGenres, isOpen, onClose}:EditProfileProps) {
    const EditProfileRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const handleBackdropClick = (event: MouseEvent) => {
            if (EditProfileRef.current && event.target === EditProfileRef.current) {
                onClose();
            }
        };
          
        if (isOpen) {
            const dialog = EditProfileRef.current;
            if (dialog && !dialog.open) {
                dialog.showModal();
            }
            dialog?.addEventListener('click', handleBackdropClick);
        } else {
            EditProfileRef.current?.close();
        }

        return () => {
            EditProfileRef.current?.removeEventListener('click', handleBackdropClick);
        };
    }, [isOpen, onClose]);

  return (
    <dialog ref={EditProfileRef} onClose={onClose} id='edit-profile-dialog'>
        <div className="dialog-container">
            <button id="edit-profile-dialog-close" onClick={onClose}>&times;</button>
            
            <h1>Edit Profile</h1>

            <div id="preferred-genres-input">
                <label className='edit-profile-input-label'>Preferred Genres:</label>
                <SearchableDropdown options={genres} />
            </div>
            <p>{displayGenres()}</p>

            <label className="edit-profile-input-label" id='edit-profile-about-me-label'>About Me:</label>
            <textarea name="edit-profile-biography" id="edit-profile-biography" rows={8} maxLength={500}>{profile.biography}</textarea>
            
            <label htmlFor='profile-picture-upload' className='edit-profile-input-label' id='file-upload-label'>Upload New Profile Picture:</label>
            <div id="profile-upload-background">
                <input type="file" id="profile-picture-upload" name="myfile" />
            </div>

            <button id="edit-profile-submit">Save Changes</button>
        </div>
    </dialog>
  )
}

export default EditProfile
