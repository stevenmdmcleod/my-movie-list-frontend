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
import { decodeToken, userJwt } from '../../utils/jwt';

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
    const navigate = useNavigate();
    // const [watchlist, setWatchlist] = useState<Watchlist>(emptyWatchlist);
    const { listId } = useParams();
    const token = window.localStorage.getItem("token") || '';
    const decoded = decodeToken(token) as userJwt;

    console.log(decoded)
    const { data: watchlistData, loading: watchlistLoading }: UseIndividualWatchlistDataReturn = useIndividualWatchlistData(listId);
  
    const ownerId = watchlistData?.userId;
    
    const {data: ownerProfile, loading:profileLoading } = useProfileData(ownerId ?? "");

    const { profiles: collaboratorsProfiles, loading: collaboratorsLoading } = useMultipleProfiles(watchlistData?.collaborators);

    const collaboratorsUsernames = collaboratorsProfiles.map(profile => profile.username);

    function handleProfileNavigation(userId:string | undefined): void {
        if (!userId) return;
        navigate('/profile', { state: { userId }})
    }

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
                            <span id='individual-watchlist-header-author'>by <a href="javascript:;" onClick={() => handleProfileNavigation(watchlistData?.userId)}>{ownerProfile?.username}</a></span>
                        </div>
                        <div id="individual-watchlist-header-center">
                            <span>Collaborators:</span>
                            <select name="collaborators" id="individual-watchlist-view-collaborators" defaultValue="">
                                <option value="" disabled hidden>-- View Users --</option>
                                {collaboratorsUsernames.map(username => {
                                    return <option key={`collaborator-${username}`} value={username}>{username}</option>
                                })}
                            </select>
                            <span id="individual-watchlist-collaborator-icon" title='Edit Collaborators'></span>
                        </div>
                        <div id="individual-watchlist-header-right">
                            <span>Likes:</span>
                            <span id="individual-watchlist-likes-icon"></span>
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