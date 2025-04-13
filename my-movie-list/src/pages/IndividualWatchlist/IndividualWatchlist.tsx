import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router";

import useIndividualWatchlistData, { UseIndividualWatchlistDataReturn } from "../../hooks/useIndividualWatchlistData";
import useProfileData from '../../hooks/useProfileData';
import useMultipleProfiles from '../../hooks/useMultipleProfilesData';

import { TitleInformation } from './TitleCard/TitleCard';
import CommentSection from './CommentSection/CommentSection';
import WatchlistHeaderControls from './WatchlistHeaderControls/WatchlistHeaderControls';
import TitleView from './TitleView/TitleView';

import { decodeToken, isTokenValid, userJwt } from '../../utils/jwt';
import axios from 'axios';
import './IndividualWatchlist.css'

function IndividualWatchlist() {
    const navigate = useNavigate();
    const { listId } = useParams();

    const [likedLists, setLikedLists] = useState<Array<string>>([]);
    const [listName, setListName] = useState<string>('')
    const [isPublic, setIsPublic] = useState<boolean>(false);
    const [collaborators, setCollaborators] = useState<Array<Profile>>([])    
    const [comments, setComments] = useState<Array<Comment>>([]);

    // Test state to avoid API calls while developing
    const [titles, setTitles] = useState<Array<TitleInformation>>([{id: 3173903, title: "Breaking Bad", poster: "https://cdn.watchmode.com/posters/03173903_poster_w185.jpg"},{id: 316213, title: "Boston Legal", poster: "https://cdn.watchmode.com/posters/0316213_poster_w185.jpg"},{id: 3110052, title: "Southland", poster: "https://cdn.watchmode.com/posters/03110052_poster_w185.jpg"}])
    // const [titles, setTitles] = useState<Array<TitleInformation>>([])

    // Retrieve JWT
    const token = window.localStorage.getItem("token") || '';
    let decoded;
    if (isTokenValid(token)){
        decoded = decodeToken(token) as userJwt;
    }

    // Data Retrieval through hooks
    const {data: userProfile } = useProfileData(decoded?.userId || '')

    const { data: watchlistData, loading: watchlistLoading }: UseIndividualWatchlistDataReturn = useIndividualWatchlistData(listId);
    const ownerId = watchlistData?.userId;
    
    const {data: ownerProfile, loading:profileLoading } = useProfileData(ownerId ?? "");
    const { profiles: collaboratorsProfiles } = useMultipleProfiles(watchlistData?.collaborators);

    const userIsOwner = userProfile && userProfile.userId && userProfile?.userId === ownerProfile?.userId || false;
    const userIsCollaborator = userProfile && userProfile.userId && watchlistData && watchlistData.collaborators.includes(userProfile.userId) || false;

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

    // Page Guards: Access Denied, Not Found, Loading
    if (watchlistLoading || profileLoading) return <div className='centered-error-view'>Loading...</div>;
    if (!hasAccess()) return <div className='access-denied-view'>
            <span className='access-denied-view-title'>Access Denied</span>
            <span className="access-denied-view-redirect">
                Please login to an account with valid access: <button className="login-redirect-button" onClick={() => navigate('/login')}>Go To Login</button>
            </span>
        </div>
    
    if (!watchlistData) return <div className='centered-error-view'>NOT FOUND</div>

    return (
        <div id="individual-watchlist-view">
            <div id="individual-watchlist">
                    <WatchlistHeaderControls
                        userIsOwner={userIsOwner}
                        ownerProfile={ownerProfile}
                        userProfile={userProfile}
                        watchlistData={watchlistData}
                        likedLists={likedLists}
                        setLikedLists={setLikedLists}
                        isPublic={isPublic}
                        setIsPublic={setIsPublic}
                        listName={listName}
                        setListName={setListName}
                        collaborators={collaborators}
                        setCollaborators={setCollaborators}
                    />

                    <TitleView 
                        titles={titles}
                        setTitles={setTitles}
                        userIsOwner={userIsOwner}
                        userIsCollaborator={userIsCollaborator}
                        watchlistData={watchlistData}
                    />

                    <CommentSection
                        comments={comments}
                        setComments={setComments}
                        watchlistData={watchlistData}
                    />
            </div>
        </div>
    )
}

export default IndividualWatchlist