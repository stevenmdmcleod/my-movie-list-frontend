import { useEffect, useState } from 'react';
import DefaultProfilePic from '../../assets/Images/default-profile.jpg';
import "./Profile.css";
import EditProfile from './EditProfile';
import useProfileData, { UseProfileDataReturn } from '../../hooks/useProfileData';
import { decodeToken, isTokenValid, userJwt } from '../../utils/jwt';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const emptyProfile = {
  userId: '1231241234',
  username: 'Profile Not Found',
  email: '',
  biography: '',
  profilePicture: '',
  preferredGenres: [],
  isAdmin: false,
  isBanned: false,
  collaborativeLists: [],
  likedLists: [],
  friends: [],
  recentlyAdded: [],
}

// Can be used in two ways: viewing own profile or another users profile
// To view own profile: Navigate to this component without useNavigate's state. This requires unexpired JWT
// To view another use profile: Navigate to this component with useNavigate's state. State should contain userId of the profile you want to view
// useNavigate example with correct state:
//      const navigate = useNavigate();
//      function handleProfileNavigate() {
//        navigate('/profile', { state: { userId: '35d3a19c-c746-478a-b106-dde155afc98a'}})
//      }
function Profile() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [imageSource, setImageSource] = useState<string>(DefaultProfilePic)
  const [ownerProfile, setOwnerProfile] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const token = window.localStorage.getItem("token") || '';
  const decoded = decodeToken(token) as userJwt;

  // If this route was navigated to with an attached state, the state should contain the userId of the profile you want to view.
  const location = useLocation();
  const navigatedUserId = location.state?.userId;

  let userIdToRetrieve;
  if (navigatedUserId && navigatedUserId.length > 0) {
    userIdToRetrieve = navigatedUserId;
  } else if (isTokenValid(token)){
    userIdToRetrieve = decoded.userId;
  } else {
    userIdToRetrieve = '';
  }

  const { data, loading }: UseProfileDataReturn = useProfileData(userIdToRetrieve)


  function displayGenres(preferredGenres: Array<string>):string {
    let genreString = '';
    preferredGenres.map(genre => genreString += `${genre}, `);

    // Removes extra comma formatting at end of string
    if (genreString.slice(-2) == ', ') {
      genreString = genreString.slice(0,-2);
    }

    return genreString;
  }

  async function handleAddFriend() {
    if (profile.username === 'Profile Not Found') return;
    if (!profile.userId || !decoded.userId) return;
    if (profile.userId === decoded.userId) return;
    if (!profile.username) return;

  
    const friendsIds = profile.friends?.map(friend => friend.userId);

    if(friendsIds?.includes(decoded.userId)) return;
    

    try {
      const response = await axios.patch(`${import.meta.env.VITE_BASE_URL}/users/friends`, {
        username: profile.username
      }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.localStorage.getItem("token")}`
        }
      })
      if (response.status === 200) {
        window.alert("Friend added!");
      }
    } catch (error) { 
      console.log(error);
    }
  }

  useEffect(() => {
    if (data && data.userId) {
      setProfile(data)
      if (!navigatedUserId || navigatedUserId === decoded?.userId) {
        setOwnerProfile(true);
      } else {
        setOwnerProfile(false);
      }
    }
    // Trying to display the default profile picture until the signedUrl is retrieved and loads
    if (data && data.signedUrl) {
      const img = new Image();
      img.src = data.signedUrl;

      img.onload = () => {
        setImageSource(data.signedUrl as string);
      }

      img.onerror = () => {
        console.log('Failed to load profile picture');
        setImageSource(DefaultProfilePic);
      }
    } else {
      setImageSource(DefaultProfilePic);
    }
  }, [data, decoded, navigatedUserId])

  return (
    <div id='profile-view'>
      <div id="profile">
        {loading && <div>Loading...</div>}
        {!loading && (
          <>
            { ownerProfile?
              <> 
                <EditProfile profile={profile} setProfile={setProfile} setImageSource={setImageSource} isOpen={isDialogOpen} onClose={()=>setIsDialogOpen(false)}/>
                <button id="edit-profile-button" onClick={() => setIsDialogOpen(true)}>Edit Profile</button>
              </>
              : 
              null
            }

            <img src={imageSource} alt="Profile picture" id="profile-picture" />
            <h1>{profile.username}</h1>
            <h3>{profile.email}</h3>
    
            <div id="profile-add-friend">
              {ownerProfile? null: <button id="add-friend-button" onClick={handleAddFriend}>Add Friend</button>}
            </div>
    
            <h4 className="strikethrough">Preferred Genres</h4>
            <p className="genres-list">{displayGenres(profile.preferredGenres)}</p>
    
            <h4 className="strikethrough">About Me</h4>
            <p className="biography">{profile.biography}</p>
          </>
        )}
      </div>
    </div>
  );
}  
export default Profile;