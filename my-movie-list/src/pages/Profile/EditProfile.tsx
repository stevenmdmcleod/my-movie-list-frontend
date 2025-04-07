import { ChangeEvent, useEffect, useRef, useState } from 'react'
import "./EditProfile.css";
import SearchableDropdown from './SearchableDropdown';
import axios from 'axios';

interface EditProfileProps {
    profile: Profile,
    setProfile: (profile: Profile) => void,
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

function EditProfile({profile, setProfile, isOpen, onClose}:EditProfileProps) {
    const EditProfileRef = useRef<HTMLDialogElement>(null);
    const [selectedGenres, setSelectedGenres] = useState<Array<string>>(profile.preferredGenres || []);
    const [biography, setBiography] = useState(profile.biography || '');
    const [imageFile, setImageFile] = useState<File | null>(null);

    function displayGenres(preferredGenres: Array<string>):string {
        let genreString = '';
        preferredGenres.map(genre => genreString += `${genre}, `);
    
        // Removes extra comma formatting at end of string
        if (genreString.slice(-2) == ', ') {
          genreString = genreString.slice(0,-2);
        }
        return genreString;
      }

    function handleSelectedGenre(genre:string) {
        if (selectedGenres.includes(genre)) {
            setSelectedGenres(selectedGenres.filter(option => option !== genre))
        } else {
            setSelectedGenres([...selectedGenres, genre]);
        }
    }

    function handleBiographyUpdate(event: ChangeEvent<HTMLTextAreaElement>) {
        setBiography(event.target.value);
    }

    function handleFileChange(event: ChangeEvent<HTMLInputElement>){
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setImageFile(file);
        }
    }

    async function handleSaveChanges(){
        try {
            const formData = new FormData();

            if (imageFile) {
                formData.append('image', imageFile);
            }

            formData.append('biography', biography);
            for (const genre of selectedGenres) {
                formData.append('preferredGenres', genre);
            }
            const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/users/update-profile`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${window.localStorage.getItem("token")}`
                }
            })
            if (response.status === 200) {
                setProfile({...profile, ...response.data.user, signedUrl: response.data.signedUrl});
                onClose();
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        function handleBackdropClick(event: MouseEvent) {
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

        setSelectedGenres(profile?.preferredGenres);
        setBiography(profile?.biography);
        return () => {
            EditProfileRef.current?.removeEventListener('click', handleBackdropClick);
        };
    }, [isOpen, onClose, profile]);

  return (
    <dialog ref={EditProfileRef} onClose={onClose} id='edit-profile-dialog'>
        <div className="dialog-container">
            <button id="edit-profile-dialog-close" onClick={onClose}>&times;</button>
            
            <h1>Edit Profile</h1>

            <div id="preferred-genres-input">
                <label className='edit-profile-input-label'>Preferred Genres:</label>
                <SearchableDropdown options={genres} setSelected={handleSelectedGenre}/>
            </div>
            <p className='genres-list'>{displayGenres(selectedGenres)}</p>

            <label className="edit-profile-input-label" id='edit-profile-about-me-label'>About Me:</label>
            <textarea name="edit-profile-biography" id="edit-profile-biography" rows={8} maxLength={500} value={biography} onChange={handleBiographyUpdate}></textarea>
            
            <label htmlFor='profile-picture-upload' className='edit-profile-input-label' id='file-upload-label'>Upload New Profile Picture:</label>
            <div id="profile-upload-background">
                <input type="file" accept='image/*' onChange={handleFileChange} id="profile-picture-upload" name="myfile" />
            </div>

            <button id="edit-profile-submit" onClick={handleSaveChanges}>Save Changes</button>
        </div>
    </dialog>
  )
}

export default EditProfile
