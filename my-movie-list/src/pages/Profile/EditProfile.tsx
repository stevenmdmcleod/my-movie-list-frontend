import { ChangeEvent, useEffect, useRef, useState } from 'react'
import "./EditProfile.css";
import SearchableDropdown from '../../components/SearchableDropdown/SearchableDropdown';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { removeActiveUser } from '../../LocalStorage';

interface EditProfileProps {
    profile: Profile,
    setProfile: (profile: Profile) => void,
    setImageSource: (source: string) => void,
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

function EditProfile({profile, setProfile, setImageSource, isOpen, onClose}:EditProfileProps) {
    const EditProfileRef = useRef<HTMLDialogElement>(null);
    const navigate = useNavigate();
    const [selectedGenres, setSelectedGenres] = useState<Array<string>>(profile.preferredGenres || []);
    const [biography, setBiography] = useState(profile.biography || '');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [activeDelete, setActiveDelete] = useState<boolean>(false);
    const [activeDeleteInput, setActiveDeleteInput] = useState<string>('');

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
        } else if (selectedGenres.length < 7){
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
                if (response.data.signedUrl) {
                    setImageSource(response.data.signedUrl);
                }
                onClose();
            }
            setActiveDelete(false);
        } catch (error) {
            console.log(error)
        }
    }

    async function handleDeleteProfile() {
        if (activeDeleteInput !== 'delete') {
            setActiveDeleteInput('');
            setActiveDelete(false);
            return;
        }

        const response = await axios.delete(`${ import.meta.env.VITE_BASE_URL}/users/me`, {
            headers: {
                'Authorization': `Bearer ${window.localStorage.getItem("token")}`
            }
        })

        if (response.status === 200) {
            removeActiveUser();
            window.localStorage.removeItem("token");
            navigate('/');
        }
    }

    useEffect(() => {
        function handleBackdropClick(event: MouseEvent) {
            if (EditProfileRef.current && event.target === EditProfileRef.current) {
                setActiveDelete(false);
                onClose();
            }
        };

        if (isOpen) {
            const dialog = EditProfileRef.current;
            if (dialog && !dialog.open) {
                dialog.showModal();
            }
            dialog?.addEventListener('click', handleBackdropClick);
            document.body.style.overflow = 'hidden';
        } else {
            EditProfileRef.current?.close();
            document.body.style.overflow = '';
        }

        setSelectedGenres(profile?.preferredGenres);
        setBiography(profile?.biography);
        return () => {
            EditProfileRef.current?.removeEventListener('click', handleBackdropClick);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose, profile]);

  return (
    <dialog ref={EditProfileRef} onClose={onClose} id='edit-profile-dialog'>
        <div id="edit-profile-dialog-container">
            <button id="edit-profile-dialog-close" onClick={() => {setActiveDelete(false);onClose();}}>&times;</button>
            
            <h1>Edit Profile</h1>

            <div id="preferred-genres-input">
                <div className="stacked-labels">
                    <label className='edit-profile-input-label'>Preferred Genres:</label>
                    <label className='edit-profile-input-label'>Max: 7</label>

                </div>
                <SearchableDropdown options={genres} setSelected={handleSelectedGenre}/>
            </div>
            <p className='genres-list'>{displayGenres(selectedGenres)}</p>

            <label className="edit-profile-input-label" id='edit-profile-about-me-label'>About Me:</label>
            <textarea name="edit-profile-biography" id="edit-profile-biography" rows={8} maxLength={400} value={biography} onChange={handleBiographyUpdate}></textarea>
            
            <label htmlFor='profile-picture-upload' className='edit-profile-input-label' id='file-upload-label'>Upload New Profile Picture:</label>
            <div id="profile-upload-background">
                <input type="file" accept='image/*' onChange={handleFileChange} id="profile-picture-upload" name="myfile" />
            </div>

            <button id="edit-profile-submit" onClick={handleSaveChanges}>Save Changes</button>
            { activeDelete? 
                <div id="active-delete">
                    <input type="text" id="active-delete-input" placeholder="Type 'delete' to confirm..." onChange={(event) => setActiveDeleteInput(event.target.value)} />
                    <button id="active-delete-button" onClick={handleDeleteProfile}>Delete</button>
                </div>
                :
                <button id="edit-profile-delete" onClick={() => setActiveDelete(true)}>Delete Profile</button>
            }
            
        </div>
    </dialog>
  )
}

export default EditProfile
