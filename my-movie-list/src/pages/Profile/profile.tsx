import React, { useEffect, useState } from 'react';
import DefaultProfilePic from '../../assets/Images/default-profile.jpg';
import "./profile.css";
import EditProfile from './EditProfile';
import useProfileData, { UseProfileDataReturn } from '../../hooks/useProfileData';
import { decodeToken, userJwt } from '../../utils/jwt';

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

function Profile() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [ownerProfile, setOwnerProfile] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const token = window.localStorage.getItem("token") || '';
  const decoded = decodeToken(token) as userJwt;
  const { data, loading }: UseProfileDataReturn = useProfileData(decoded.userId)

  function displayGenres(preferredGenres: Array<string>):string {
    let genreString = '';
    preferredGenres.map(genre => genreString += `${genre}, `);

    // Removes extra comma formatting at end of string
    if (genreString.slice(-2) == ', ') {
      genreString = genreString.slice(0,-2);
    }

    return genreString;
  }

  useEffect(() => {
    if (data && data.userId) {
      setProfile(data)
      // TODO: Way to request without being profile owner
      // setOwnerProfile(data.userId === decoded.userId);
    }
  }, [data])

  return (
    <div id='profile-view'>
      <div id="profile">
        {loading && <div>Loading...</div>}
        {!loading && (
          <>
            <EditProfile profile={profile} setProfile={setProfile} isOpen={isDialogOpen} onClose={()=>setIsDialogOpen(false)}/>
            <div id="edit-profile">
              {ownerProfile? <button id="edit-profile-button" onClick={() => setIsDialogOpen(true)}>Edit Profile</button>: null}
            </div>
            <img src={profile.signedUrl? profile.signedUrl: DefaultProfilePic} alt="Profile picture" id="profile-picture" />
            <h1>{profile.username}</h1>
            <h3>{profile.email}</h3>
    
            <div id="profile-add-friend">
              {ownerProfile? null: <button id="add-friend-button">Add Friend</button>}
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