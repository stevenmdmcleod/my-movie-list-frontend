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

    const collaboratorsUsernames = collaboratorsProfiles.map(profile => profile.username);
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
    },[watchlistData])

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
                                <span>{watchlistData?.isPublic? "Public": "Private"}</span>
                                <h1>{watchlistData?.listName}</h1>
                            </div>
                            <span id='individual-watchlist-header-author'>by <a href="#" onClick={(e) => {e.preventDefault(); handleProfileNavigation(watchlistData?.userId);}}>{ownerProfile?.username}</a></span>
                        </div>
                        <div id="individual-watchlist-header-center">
                            <span>Collaborators:</span>
                            <select name="collaborators" id="individual-watchlist-view-collaborators" defaultValue="">
                                <option value="" disabled hidden>-- View Users --</option>
                                {collaboratorsUsernames.map(username => {
                                    return <option key={`collaborator-${username}`} value={username}>{username}</option>
                                })}
                            </select>
                            {userIsOwner? <span id="individual-watchlist-collaborator-icon" title='Edit Collaborators'></span>: null}
                            
                        </div>
                        <div id="individual-watchlist-header-right">
                            <span>Likes:</span>
                            {getLikeIcon()}
                            {/* <span className="individual-watchlist-likes-icon"></span> */}
                            <span>{watchlistData?.likes.length}</span>
                        </div>
                    </div>
                    <hr id='individual-watchlist-header-hr'/>
                </>
            </div>
        </div>
    )
}

export default IndividualWatchlist