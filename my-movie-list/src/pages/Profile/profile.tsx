import React, { useState } from 'react';
import DefaultProfilePic from '../../assets/Images/default-profile.jpg';
import "./profile.css";
import EditProfile from './EditProfile';

interface Profile {
  userId: string,
  username: string,
  email: string,
  biography: string,
  profilePicture: string,
  preferredGenres: Array<string>,
  isAdmin?: boolean,
  isBanned?: boolean,
  collaborativeLists?: Array<string>,
  likedLists?: Array<string>,
  friends?: Array<string>,
  recentlyAdded?: Array<string>,
}

const testProfile = {
  userId: '1231241234',
  username: 'TestUser',
  email: 'testuser@test.com',
  biography: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent  vestibulum ex at risus posuere, et consequat purus porttitor. Donec eget libero diam. Quisque eros leo, gravida vitae eleifend eget, tincidunt  eu mi. Donec rutrum mollis diam in varius. Aenean mauris libero, blandit quis feugiat non, bibendum at orci. Cras erat tellus, faucibus tempus  nibh ut, placerat euismod ante. Praesent convallis nulla non enim ornare condimentum. Nulla tempus laoreet eros, a cursus tortor accumsan non.',
  profilePicture: '',
  preferredGenres: ['Horror','Comedy','Documentary'],
  isAdmin: false,
  isBanned: false,
  collaborativeLists: [],
  likedLists: [],
  friends: [],
  recentlyAdded: [],
}

function Profile() {
  const [profile] = useState<Profile>(testProfile);
  // const [profile, setProfile] = useState<Profile>(testProfile);

  const [ownerProfile, setOwnerProfile] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  function displayGenres():string {
    let genreString = '';

    profile?.preferredGenres.map(genre => genreString += `${genre}, `);

    // Removes extra comma formatting at end of string
    if (genreString.slice(-2) == ', ') {
      genreString = genreString.slice(0,-2);
    }

    return genreString;
  }

  return (
    <div id='profile-view'>
      <EditProfile profile={profile} displayGenres={displayGenres} isOpen={isDialogOpen} onClose={()=>setIsDialogOpen(false)}/>
      <div id="profile">
        <div id="edit-profile">
          {ownerProfile? <button id="edit-profile-button" onClick={() => setIsDialogOpen(true)}>Edit Profile</button>: null}
        </div>
        <img src={profile?.profilePicture? profile?.profilePicture: DefaultProfilePic} alt="Profile picture" id="profile-picture" />
        <h1>{profile?.username}</h1>
        <h3>{profile?.email}</h3>

        <div id="profile-add-friend">
          {ownerProfile? null: <button id="add-friend-button">Add Friend</button>}
        </div>

        <h4 className="strikethrough">Preferred Genres</h4>
        <p className="genres-list">{displayGenres()}</p>

        <h4 className="strikethrough">About Me</h4>
        <p className="biography">{profile?.biography}</p>
      </div>
    </div>
  );
}  
export default Profile;