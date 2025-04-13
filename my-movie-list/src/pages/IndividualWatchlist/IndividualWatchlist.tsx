import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router";
import useIndividualWatchlistData, { UseIndividualWatchlistDataReturn } from "../../hooks/useIndividualWatchlistData";
import useProfileData from '../../hooks/useProfileData';
import useMultipleProfiles from '../../hooks/useMultipleProfilesData';
import { decodeToken, isTokenValid, userJwt } from '../../utils/jwt';
import axios from 'axios';
import EditWatchlist from './EditWatchlist/EditWatchlist';
import EditCollaborators from './EditCollaborators/EditCollaborators';
import TitleCard, { TitleInformation } from './TitleCard/TitleCard';
import CommentSection from './CommentSection/CommentSection';
import './IndividualWatchlist.css'

function IndividualWatchlist() {
    const [likedLists, setLikedLists] = useState<Array<string>>([]);
    const [listName, setListName] = useState<string>('')
    const [isPublic, setIsPublic] = useState<boolean>(false);
    const [collaborators, setCollaborators] = useState<Array<Profile>>([])
    // Test state to avoid API calls while developing
    const [titles, setTitles] = useState<Array<TitleInformation>>([{id: 3173903, title: "Breaking Bad", poster: "https://cdn.watchmode.com/posters/03173903_poster_w185.jpg"},{id: 316213, title: "Boston Legal", poster: "https://cdn.watchmode.com/posters/0316213_poster_w185.jpg"},{id: 3110052, title: "Southland", poster: "https://cdn.watchmode.com/posters/03110052_poster_w185.jpg"}])
    // const [titles, setTitles] = useState<Array<TitleInformation>>([])
    const [isWatchlistDialogOpen, setIsWatchlistDialogOpen] = useState<boolean>(false);
    const [isCollaboratorDialogOpen, setIsCollaboratorDialogOpen] = useState<boolean>(false);
    const [comments, setComments] = useState<Array<Comment>>([]);

    const navigate = useNavigate();
    const { listId } = useParams();
    const token = window.localStorage.getItem("token") || '';
    let decoded;
    if (isTokenValid(token)){
        decoded = decodeToken(token) as userJwt;
    }
    const {data: userProfile } = useProfileData(decoded?.userId || '')

    const { data: watchlistData, loading: watchlistLoading }: UseIndividualWatchlistDataReturn = useIndividualWatchlistData(listId);

    const ownerId = watchlistData?.userId;
    
    const {data: ownerProfile, loading:profileLoading } = useProfileData(ownerId ?? "");

    
    const { profiles: collaboratorsProfiles } = useMultipleProfiles(watchlistData?.collaborators);

    const userIsOwner = userProfile && userProfile.userId && userProfile?.userId === ownerProfile?.userId || false;

    const userIsCollaborator = userProfile && userProfile.userId && watchlistData && watchlistData.collaborators.includes(userProfile.userId) || false;

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

    async function handleDelete(titleId:number, titleName:string) {
        if (!watchlistData) return;
        if (window.confirm(`Delete ${titleName}?`)) {
            const response = await axios.patch(`${import.meta.env.VITE_BASE_URL}/watchlist/${watchlistData.listId}/titles`, { titleId: `${titleId}` },{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.localStorage.getItem("token")}`
                }
            })

            if (response.status === 200) {
                setTitles(titles.filter(title => title.id !== titleId));
            }
        }
    }

    function sortComments(comments:Array<Comment>){
        const sorted = [...comments];

        sorted.sort((a, b) => {
            if (a.datePosted < b.datePosted) {
                return -1;
            }

            if (a.datePosted > b.datePosted) {
                return 1;
            }

            return 0;
        })

        return sorted;
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

    async function getTitles(titleIds: Array<string>) {
        const retrievedTitles = [];
        for (const title of titleIds) {
            try {
                const response = await axios.get(`https://api.watchmode.com/v1/title/${title}/details/?apiKey=${import.meta.env.VITE_WATCHMODE_API_KEY}`)
                if (response.status === 200) {
                    retrievedTitles.push(response.data);
                }
            } catch (error) {
                console.log(error);
            }
        }
        setTitles(retrievedTitles);
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

        if (watchlistData && watchlistData.titles) {
            // getTitles(watchlistData.titles);
        }
        
        // Comment out this section to avoid Watchmode API calls, can use dummy state to simulate titles.
        if (watchlistData && watchlistData.comments) {
            const sorted = sortComments(watchlistData.comments);
            setComments(sorted);
        }

        if (collaboratorsProfiles) {
            setCollaborators(collaboratorsProfiles);
        }
    },[watchlistData, collaboratorsProfiles])

    if (!hasAccess()) return <div className='access-denied-view'>
            <span className='access-denied-view-title'>Access Denied</span>
            <span className="access-denied-view-redirect">
                Please login to an account with valid access: <button className="login-redirect-button" onClick={() => navigate('/login')}>Go To Login</button>
            </span>
        </div>
    
    if (watchlistLoading || profileLoading) return <div className='centered-error-view'>Loading...</div>;
    if (!watchlistData) return <div className='centered-error-view'>NOT FOUND</div>

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

                    <div id="individual-watchlist-titles-view">
                        {titles.map((title, index) => {
                            return <TitleCard key={title.id + index} titleInfo={title} handleDelete={handleDelete} userCanDelete={userIsOwner || userIsCollaborator}/>
                        })}
                    </div>
                    <CommentSection comments={comments} setComments={setComments} watchlistData={watchlistData} />
                </>
            </div>
        </div>
    )
}

export default IndividualWatchlist