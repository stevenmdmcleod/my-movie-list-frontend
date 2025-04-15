import React, { useState } from 'react';
import './WatchlistHeaderControls.css';
import { useNavigate } from 'react-router';
import EditWatchlist from '../EditWatchlist/EditWatchlist';
import EditCollaborators from '../EditCollaborators/EditCollaborators';
import axios from 'axios';
import { BASE_ROUTE } from '../../../utils/config';

interface WatchlistHeaderControlsProps {
    userIsOwner: boolean,
    ownerProfile: Profile | null,
    userProfile: Profile | null,
    watchlistData: Watchlist,
    likedLists: Array<string>,
    setLikedLists: (newLikedList: Array<string>) => void,
    isPublic: boolean,
    setIsPublic: (newIsPublic: boolean) => void,
    listName: string,
    setListName: (newListName: string) => void,
    collaborators: Array<Profile>,
    setCollaborators: (newCollaborators: Array<Profile>) => void
}

function WatchlistHeaderControls({userIsOwner, ownerProfile, userProfile, watchlistData, likedLists, setLikedLists, isPublic, setIsPublic, listName, setListName, collaborators, setCollaborators}:WatchlistHeaderControlsProps) {
    const navigate = useNavigate();
    const [isWatchlistDialogOpen, setIsWatchlistDialogOpen] = useState<boolean>(false);
    const [isCollaboratorDialogOpen, setIsCollaboratorDialogOpen] = useState<boolean>(false);

    function handleProfileNavigation(userId:string | undefined): void {
        if (!userId) return;
        navigate('/profile', { state: { userId }})
    }

    async function handleListLIke() {
        if (!userProfile) return;
        if (!watchlistData) return;
        const response = await axios.patch(`${BASE_ROUTE}/watchlist/${watchlistData.listId}/likes`,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.localStorage.getItem("token")}`
            }
        })

        if (response.status !== 200) return;

        if ( likedLists.includes(userProfile.userId)) {
            setLikedLists(likedLists.filter(id => id !== userProfile.userId));
        } else {
            setLikedLists([...likedLists, userProfile.userId])
        }
    }

    function getLikeIcon() {
        if (userIsOwner) {
            return null;
        }

        // Profile from JWT required for likes
        if (!userProfile || !(userProfile.userId)) {
            return null;
        }

        if (likedLists.includes(userProfile.userId)) {
            return <span className="individual-watchlist-likes-icon liked-icon" onClick={handleListLIke}></span>
        }

        return <span className="individual-watchlist-likes-icon unliked-icon" onClick={handleListLIke}></span>

    }
    
  return (
    <>
        <div id="individual-watchlist-header">
            <div id="individual-watchlist-header-left">
                <div id="individual-watchlist-header-name-visibility">
                    
                    
                    { isPublic? 
                        <span id="individual-watchlist-header-name-visibility-public">Public</span>
                        :
                        <span id="individual-watchlist-header-name-visibility-private">Private</span>
                    }
                    <h1>{listName}</h1>
                </div>
                <span id='individual-watchlist-header-author'>by <a href="#" onClick={(e) => {e.preventDefault(); handleProfileNavigation(watchlistData?.userId);}}>{ownerProfile?.username}</a></span>
                { userIsOwner? 
                    <>
                        <span data-testid='edit-watchlist-icon' id='individual-watchlist-edit-icon' title='Edit Watchlist' onClick={() => setIsWatchlistDialogOpen(true)}></span>
                        <EditWatchlist watchlist={watchlistData} listName={listName} setListName={setListName} setIsPublic={setIsPublic} isOpen={isWatchlistDialogOpen} onClose={() => setIsWatchlistDialogOpen(false)} />
                    </>
                    :null
                }
            </div>
            <div id="individual-watchlist-header-center">
                <span>Collaborators:</span>
                <select name="collaborators" id="individual-watchlist-view-collaborators" defaultValue="">
                    <option value="" disabled hidden>-- View Users --</option>
                    {collaborators.map(profile => {
                        return <option key={`collaborator-${profile.username}`} value={profile.username}>{profile.username}</option>
                    })}
                </select>
                { userIsOwner? 
                    <>
                        <span id="individual-watchlist-collaborator-icon" title='Edit Collaborators' onClick={() => {setIsCollaboratorDialogOpen(true)}}></span>
                        <EditCollaborators ownerProfile={ownerProfile} watchlist={watchlistData} collaborators={collaborators} setCollaborators={setCollaborators} isOpen={isCollaboratorDialogOpen} onClose={() => setIsCollaboratorDialogOpen(false)}/>
                    </>
                    : 
                    null
                }
                
            </div>
            <div id="individual-watchlist-header-right">
                <span>Likes:</span>
                {getLikeIcon()}
                <span>{likedLists.length}</span>
            </div>
        </div>
        <hr id='individual-watchlist-header-hr'/>
    </>
  )
}

export default WatchlistHeaderControls