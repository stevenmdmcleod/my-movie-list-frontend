import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router";
// import collaboratorCogwheelIcon from "../../assets/icons/person-cogwheel.png";
// import redHeartIcon from "../../assets/icons/red-heart.png";
// import greyHeartIcon from "../../assets/icons/grey-heart.png";
// import removeIcon from "../../assets/icons/remove.png";

import './IndividualWatchlist.css'
import useIndividualWatchlistData, { UseIndividualWatchlistDataReturn } from "../../hooks/useIndividualWatchlistData";
import useProfileData from '../../hooks/useProfileData';
import useMultipleProfiles from '../../hooks/useMultipleProfilesData';
import { decodeToken, isTokenValid, userJwt } from '../../utils/jwt';
import axios from 'axios';
import EditWatchlist from './EditWatchlist/EditWatchlist';
import EditCollaborators from './EditCollaborators/EditCollaborators';

const emptyWatchlist = {
    listId: "",
    userId: "",
    listName: "",
    isPublic: true,
    likes: [],
    titles: [],
    comments: []
}
function IndividualWatchlist() {
    const [likedLists, setLikedLists] = useState<Array<string>>([]);
    const [listName, setListName] = useState<string>('')
    const [isPublic, setIsPublic] = useState<boolean>(false);
    const [collaborators, setCollaborators] = useState<Array<Profile>>([])

    const [isWatchlistDialogOpen, setIsWatchlistDialogOpen] = useState<boolean>(false);
    const [isCollaboratorDialogOpen, setIsCollaboratorDialogOpen] = useState<boolean>(false);

    const navigate = useNavigate();
    // const [watchlist, setWatchlist] = useState<Watchlist>(emptyWatchlist);
    const { listId } = useParams();
    const token = window.localStorage.getItem("token") || '';
    let decoded;
    if (isTokenValid(token)){
        decoded = decodeToken(token) as userJwt;
    }
    const {data: userProfile, loading: userLoading } = useProfileData(decoded?.userId || '')

    const { data: watchlistData, loading: watchlistLoading }: UseIndividualWatchlistDataReturn = useIndividualWatchlistData(listId);

    const ownerId = watchlistData?.userId;
    
    const {data: ownerProfile, loading:profileLoading } = useProfileData(ownerId ?? "");

    
    const { profiles: collaboratorsProfiles, loading: collaboratorsLoading } = useMultipleProfiles(watchlistData?.collaborators);

    // const collaboratorsUsernames = collaboratorsProfiles.map(profile => profile.username);
    const userIsOwner = userProfile && userProfile.userId && userProfile?.userId === ownerProfile?.userId;

    function handleProfileNavigation(userId:string | undefined): void {
        if (!userId) return;
        navigate('/profile', { state: { userId }})
    }

    async function handleListLIke() {
        if (!userProfile) return;
        if (!watchlistData) return;
        const response = await axios.patch(`${import.meta.env.VITE_BASE_URL}/watchlist/${watchlistData.listId}/likes`,{
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

    function hasAccess(){
        if (watchlistData?.isPublic) {
            return true;
        }
        
        // Profile from JWT required for private lists
        if (!userProfile || !(userProfile.userId)) {
            return false;
        }
        // User is owner
        if (userProfile.userId === watchlistData?.userId) {
            return true;
        }

        // User is collaborator
        if (watchlistData?.collaborators.includes(userProfile.userId)) {
            return true;
        }

        return false
    }

    useEffect(() => {
        if (watchlistData && watchlistData.likes) {
            setLikedLists(watchlistData.likes);
        }

        if (watchlistData && watchlistData.listName) {
            setListName(watchlistData.listName)
        }

        if (watchlistData && watchlistData.isPublic) {
            setIsPublic(watchlistData.isPublic);
        }

        if (collaboratorsProfiles) {
            setCollaborators(collaboratorsProfiles);
        }

    },[watchlistData, collaboratorsProfiles])

    if (!hasAccess()) return <div>Access Denied</div>
    if (watchlistLoading || profileLoading) return <div>Loading...</div>;
    if (!watchlistData) return <div>NOT FOUND</div>

    return (
        <div id="individual-watchlist-view">
            <div id="individual-watchlist">
                <>
                    <div id="individual-watchlist-header">
                        <div id="individual-watchlist-header-left">
                            <div id="individual-watchlist-header-name-visibility">
                                <span>{isPublic? "Public": "Private"}</span>
                                <h1>{listName}</h1>
                            </div>
                            <span id='individual-watchlist-header-author'>by <a href="#" onClick={(e) => {e.preventDefault(); handleProfileNavigation(watchlistData?.userId);}}>{ownerProfile?.username}</a></span>
                            { userIsOwner? 
                                <>
                                    <span id='individual-watchlist-edit-icon' title='Edit Watchlist' onClick={() => setIsWatchlistDialogOpen(true)}></span>
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
            </div>
        </div>
    )
}

export default IndividualWatchlist