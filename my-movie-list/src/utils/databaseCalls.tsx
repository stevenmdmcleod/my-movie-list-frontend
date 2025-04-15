import axios from "axios";
import { BASE_ROUTE } from "./config";


//adds a friend by their username
export async function addFriend(username: string) {
    try{
       const response = await axios.patch(`${BASE_ROUTE}/users/friends`, 
        { // request body for POST, PUT, PATCH requests
            username: username
          },
        {headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }}
      );
      return response; // Properly return the response
       } catch (error) {
         console.log(error);
}}

//deletes the current logged in user
export async function deleteMe() {
    try{
       const response = await axios.delete(`${BASE_ROUTE}/users/me`, {
        
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });
      return response; // Properly return the response
       } catch (error) {
         console.log(error);
}}

//get user by userId
export async function getUserByUserId(userId: string) {
    try{
       const response = await axios.get(`${BASE_ROUTE}/users/userId/${userId}`, {
        
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });
      return response; // Properly return the response
       } catch (error) {
         console.log(error);
}}


//gets a users friendslist
export async function getFriends() {
    try{
       const response = await axios.get(`${BASE_ROUTE}/users/friends`, {
        
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });
      return response; // Properly return the response
       } catch (error) {
         console.log(error);
}}

//need to implement updateProfile function


//update ban status of a user
export async function updateBanStatus(userId: string, banStatus: string) {
    try{
       const response = await axios.patch(`${BASE_ROUTE}/users/${userId}/ban-status`, 
        { // request body for POST, PUT, PATCH requests
            status: banStatus
          },
        {headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }}
      );
      return response; // Properly return the response
       } catch (error) {
         console.log(error);
}}

//get users for Admins
export async function getUsers() {
    try{
       const response = await axios.get(`${BASE_ROUTE}/users/users`, {
        
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });
      return response; // Properly return the response
       } catch (error) {
         console.log(error);
}}

//create watchlist
export async function createWatchlist(listName: string) {
  try{
     const response = await axios.post(`${BASE_ROUTE}/watchlist`, 
      { // request body for POST, PUT, PATCH requests
          listName: listName
        },
      {headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }}
    );
    return response; // Properly return the response
     } catch (error) {
       console.log(error);
       throw error; // Re-throw the error so it can be handled by the caller
}}

//likes/unlikes watchlist
export async function likeWatchlist(listId: string) {
  try{
     const response = await axios.patch(`${BASE_ROUTE}/watchlist/${listId}/likes`, {
      
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    });
    return response; // Properly return the response
     } catch (error) {
       console.log(error);
}}


//get watchlists for user
export async function getUserWatchlists() {
  try {
    const response = await axios.get(`${BASE_ROUTE}/watchlist/my-watchlists`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response; // Properly return the response
  } catch (error) {
    console.error("Error fetching user watchlists:", error);
    throw error; // Re-throw the error so it can be handled by the caller
  }
}


//get collaborative lists for user
export async function getUserCollaborativeWatchlists() {
  try{
     const response = await axios.get(`${BASE_ROUTE}/watchlist/collaborative-lists`, {
      
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    })
    return response; // Properly return the response
     } catch (error) {
       console.log(error);
}}


//gets public watchlists(no authorization token needed)
export async function getPublicWatchlists() {
  try{
     const response = await axios.get(`${BASE_ROUTE}/watchlist/public`, {});
     return response; // Properly return the response
     } catch (error) {
       console.log(error);
}}


//add collaborator to collaborative watchlist
export async function addCollaborator(listId: string, userId: string) {
  try{
      const response = await axios.patch(`${BASE_ROUTE}/watchlist/${listId}/collaborators`, 
      { // request body for POST, PUT, PATCH requests
        collaborator: userId
      },
      {headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    });
    return response; // Properly return the response
     } catch (error) {
       console.log(error);
}}


//remove collaborator to collaborative watchlist --needs to be tested thoroughly
export async function removeCollaborator(listId: string, userId: string) {
  try{
     const response = await axios.delete(`${BASE_ROUTE}/watchlist/${listId}/collaborators`, {
      data: { // request body for POST, PUT, PATCH requests
        collaborator: userId
      },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    });
    return response; // Properly return the response
     } catch (error) {
       console.log(error);
}}


//update listName and isPublic
export async function updateWatchlist(listId: string, listName: string, isPublic: Boolean) {
  try{
     const response = await axios.put(`${BASE_ROUTE}/watchlist/${listId}`, 
      { // request body for POST, PUT, PATCH requests
        listName: listName,
        isPublic: isPublic
      },
      {headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    });
    return response; // Properly return the response
     } catch (error) {
       console.log(error);
}}


//add a comment to watchlist
export async function addCommentToWatchlist(listId: string, comment: string) {
  try{
     const response = await axios.put(`${BASE_ROUTE}/watchlist/${listId}/comments`, 
      { // request body for POST, PUT, PATCH requests
        comment: comment
      },
      {headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    });
    return response; // Properly return the response
     } catch (error) {
       console.log(error);
}}


//get watchlist by id
export async function getWatchlistById(listId: string) {
  try{
     const response = await axios.get(`${BASE_ROUTE}/watchlist/${listId}`, {
      
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    });
    return response; // Properly return the response
     } catch (error) {
       console.log(error);
}}


//delete a comment on watchlist for admin
export async function deleteCommentOnWatchlist(listId: string, commentId: string) {
  try{
     const response = await axios.put(`${BASE_ROUTE}/watchlist/${listId}/comments/${commentId}`, {
      
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    });
    return response; // Properly return the response
     } catch (error) {
       console.log(error);
}}


//add or remove title from watchlist
export async function AddRemoveTitleFromWatchlist(listId: string, titleId: string) {
  if(listId === undefined || listId === null || titleId === undefined || titleId === null || titleId == ""){
    return;

  }
  try{
     const response = await axios.patch(`${BASE_ROUTE}/watchlist/${listId}/titles`, 
      { // request body for POST, PUT, PATCH requests
        titleId: titleId
      },
      {headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    });
    return response; // Properly return the response
     } catch (error) {
       console.log(error);
}}


//get all comments for admins
export async function getAllWatchlistComments() {
  try{
     const response = await axios.get(`${BASE_ROUTE}/watchlist/comments/all`, {
      
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    });
    return response; // Properly return the response
     } catch (error) {
       console.log(error);
}}


//get all watchlists for admins only
export async function getAllWatchlistsAdmins() {
  try{
     const response = await axios.get(`${BASE_ROUTE}/watchlist`, {
      
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    });
    return response; // Properly return the response
     } catch (error) {
       console.log(error);
}}

export async function getWatchmodeTitle(titleId: string | number) {
  try {
    const response = await axios.get(`${BASE_ROUTE}/watchmode/title/${titleId}`)
    return response;
  } catch (error) {
    console.log(error)
  }
}

// Search watchlist using name
// IMPORTANT: name string cannot have spaces. Replace all spaces with %20.
// Example: "Ed wood" --> "Ed%20wood"
export async function searchWatchlistByName(name:string) {
  try {
    const response = await axios.get(`${BASE_ROUTE}/watchmode/search?name=${name}`)
    return response;
  } catch (error) {
    console.log(error)
  }
} 