import axios from "axios";
import { BASE_ROUTE } from "./config";


//adds a friend by their username
async function addFriend(username: string) {
    try{
       await axios.patch(`${BASE_ROUTE}/users/friends`, {
        data: { // request body for POST, PUT, PATCH requests
            username: username
          },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then(response => {
        // Handle response.data
         return response;
        });
       } catch (error) {
         console.log(error)
}}

//deletes the current logged in user
async function deleteMe() {
    try{
       await axios.delete(`${BASE_ROUTE}/users/me`, {
        
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then(response => {
        // Handle response.data
         return response;
        });
       } catch (error) {
         console.log(error)
}}

//get user by userId
async function getUserByUserId(userId: string) {
    try{
       await axios.get(`${BASE_ROUTE}/users/userId/${userId}`, {
        
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then(response => {
        // Handle response.data
         return response;
        });
       } catch (error) {
         console.log(error)
}}


//gets a users friendslist
async function getFriends() {
    try{
       await axios.get(`${BASE_ROUTE}/users/friends`, {
        
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then(response => {
        // Handle response.data
         return response;
        });
       } catch (error) {
         console.log(error)
}}

//need to implement updateProfile function


//update ban status of a user
async function updateBanStatus(userId: string, banStatus: string) {
    try{
       await axios.patch(`${BASE_ROUTE}/users/${userId}/ban-status`, {
        data: { // request body for POST, PUT, PATCH requests
            status: banStatus
          },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then(response => {
        // Handle response.data
         return response;
        });
       } catch (error) {
         console.log(error)
}}

//get users for Admins
async function getUsers() {
    try{
       await axios.get(`${BASE_ROUTE}/users/users`, {
        
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then(response => {
        // Handle response.data
         return response;
        });
       } catch (error) {
         console.log(error)
}}

//create watchlist
async function createWatchlist(listName: string) {
  try{
     await axios.post(`${BASE_ROUTE}/watchlist`, {
      data: { // request body for POST, PUT, PATCH requests
          listName: listName
        },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(response => {
      // Handle response.data
       return response;
      });
     } catch (error) {
       console.log(error)
}}

//likes/unlikes watchlist
async function likeWatchlist(listId: string) {
  try{
     await axios.patch(`${BASE_ROUTE}/watchlist/${listId}/likes`, {
      
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(response => {
      // Handle response.data
       return response;
      });
     } catch (error) {
       console.log(error)
}}


//get watchlists for user
async function getUserWatchlists() {
  try{
     await axios.get(`${BASE_ROUTE}/watchlist/my-watchlists`, {
      
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(response => {
      // Handle response.data
       return response;
      });
     } catch (error) {
       console.log(error)
}}


//get collaborative lists for user
async function getUserCollaborativeWatchlists() {
  try{
     await axios.get(`${BASE_ROUTE}/watchlist/collaborative-lists`, {
      
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(response => {
      // Handle response.data
       return response;
      });
     } catch (error) {
       console.log(error)
}}


//gets public watchlists(no authorization token needed)
async function getPublicWatchlists() {
  try{
     await axios.get(`${BASE_ROUTE}/watchlist/public`, {})
    .then(response => {
      // Handle response.data
       return response;
      });
     } catch (error) {
       console.log(error)
}}


//add collaborator to collaborative watchlist
async function addCollaborator(listId: string, userId: string) {
  try{
     await axios.patch(`${BASE_ROUTE}/watchlist/${listId}/collaborators`, {
      data: { // request body for POST, PUT, PATCH requests
        collaborator: userId
      },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(response => {
      // Handle response.data
       return response;
      });
     } catch (error) {
       console.log(error)
}}


//remove collaborator to collaborative watchlist
async function removeCollaborator(listId: string, userId: string) {
  try{
     await axios.delete(`${BASE_ROUTE}/watchlist/${listId}/collaborators`, {
      data: { // request body for POST, PUT, PATCH requests
        collaborator: userId
      },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(response => {
      // Handle response.data
       return response;
      });
     } catch (error) {
       console.log(error)
}}


//update listName and isPublic
async function updateWatchlist(listId: string, listName: string, isPublic: Boolean) {
  try{
     await axios.put(`${BASE_ROUTE}/watchlist/${listId}`, {
      data: { // request body for POST, PUT, PATCH requests
        listName: listName,
        isPublic: isPublic
      },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(response => {
      // Handle response.data
       return response;
      });
     } catch (error) {
       console.log(error)
}}


//add a comment to watchlist
async function addCommentToWatchlist(listId: string, comment: string) {
  try{
     await axios.put(`${BASE_ROUTE}/watchlist/${listId}/comments`, {
      data: { // request body for POST, PUT, PATCH requests
        comment: comment
      },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(response => {
      // Handle response.data
       return response;
      });
     } catch (error) {
       console.log(error)
}}


//get watchlist by id
async function getWatchlistById(listId: string) {
  try{
     await axios.get(`${BASE_ROUTE}/watchlist/${listId}`, {
      
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(response => {
      // Handle response.data
       return response;
      });
     } catch (error) {
       console.log(error)
}}


//delete a comment on watchlist for admin
async function deleteCommentOnWatchlist(listId: string, commentId: string) {
  try{
     await axios.put(`${BASE_ROUTE}/watchlist/${listId}/comments/${commentId}`, {
      
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(response => {
      // Handle response.data
       return response;
      });
     } catch (error) {
       console.log(error)
}}


//add or remove title from watchlist
async function AddRemoveTitleFromWatchlist(listId: string, titleId: string) {
  try{
     await axios.patch(`${BASE_ROUTE}/watchlist/${listId}/titles`, {
      data: { // request body for POST, PUT, PATCH requests
        titleId: titleId
      },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(response => {
      // Handle response.data
       return response;
      });
     } catch (error) {
       console.log(error)
}}


//get all comments for admins
async function getAllWatchlistComments() {
  try{
     await axios.get(`${BASE_ROUTE}/watchlist/comments/all`, {
      
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(response => {
      // Handle response.data
       return response;
      });
     } catch (error) {
       console.log(error)
}}


//get all watchlists for admins only
async function getAllWatchlistsAdmins() {
  try{
     await axios.get(`${BASE_ROUTE}/watchlist`, {
      
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(response => {
      // Handle response.data
       return response;
      });
     } catch (error) {
       console.log(error)
}}