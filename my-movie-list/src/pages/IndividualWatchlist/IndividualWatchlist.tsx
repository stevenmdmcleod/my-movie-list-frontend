import React, { ChangeEvent, useEffect, useState } from 'react';
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
import TitleCard, { TitleInformation } from './TitleCard/TitleCard';
import Comment from './Comment/Comment';

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
    const [comment, setComment] = useState<string>("");
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

    function handleCommentUpdate(event: ChangeEvent<HTMLTextAreaElement>) {
        setComment(event.target.value);
    }

    async function handleSubmitComment() {
        if (!watchlistData) return;
        const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/watchlist/${watchlistData.listId}/comments`, { comment },{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.localStorage.getItem("token")}`
            }
        })

        if (response.status === 200) {
            const unsorted = [...comments, response.data.comment];
            const sorted = sortComments(unsorted);
            setComments(sorted);
            setComment("");
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

        if (watchlistData && watchlistData.comments) {
            const sorted = sortComments(watchlistData.comments);
            setComments(sorted);
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

                    <div id="individual-watchlist-titles-view">
                        {titles.map((title, index) => {
                            return <TitleCard key={title.id + index} titleInfo={title} handleDelete={handleDelete} userCanDelete={userIsOwner || userIsCollaborator}/>
                        })}
                    </div>

                    <div id="individual-watchlist-comment-section">
                        <h2>Comments</h2>
                        <hr id='individual-watchlist-header-hr'/>
                        
                        <div id="individual-watchlist-create-comment">
                            <textarea name="add-comment" id="individual-watchlist-comment-textarea" rows={5} maxLength={400} value={comment} onChange={handleCommentUpdate}></textarea>
                            <button id="individual-watchlist-post-comment" onClick={handleSubmitComment}>Post</button>
                        </div>

                        <div id="individual-watchlist-comment-section">
                            {comments.map(comment => {
                                return <React.Fragment key={comment.commentId}>
                                    <Comment  comment={comment} />
                                    <hr id='individual-watchlist-header-hr-light'/>
                                </React.Fragment>
                            })}
                        </div>
                    </div>
                </>
            </div>
        </div>
    )
}

export default IndividualWatchlist