import { useEffect, useMemo, useRef, useState } from 'react'
import './EditCollaborators.css'
import SearchableDropdown from '../../../components/SearchableDropdown/SearchableDropdown';
import useMultipleProfiles from '../../../hooks/useMultipleProfilesData';
import axios from 'axios';

interface EditCollaboratorsProps {
  ownerProfile: Profile | null,
  watchlist: Watchlist,
  collaborators: Array<Profile>,
  setCollaborators: (profiles: Array<Profile>) => void, 
  isOpen: boolean,
  onClose: () => void
}

function EditCollaborators({ownerProfile, watchlist, collaborators, setCollaborators, isOpen, onClose}: EditCollaboratorsProps) {
    const EditCollaboratorsRef = useRef<HTMLDialogElement>(null);
    const [selectedCollaborators, setSelectedCollaborators] = useState<Array<Profile>>(collaborators || []);
    const [friendProfiles, setFriendProfiles] = useState<Array<Profile>>([]);
    
    // Memoized to prevent infinite loops on re-render
    const friendIds = useMemo(() => {
      return ownerProfile?.friends?.map(friend => friend.userId) || [];
    }, [ownerProfile?.friends]);

    const { profiles } = useMultipleProfiles(friendIds);

    function displayCollaborators(selectedCollaborators: Array<Profile>): string {
      let collaboratorString = '';
      selectedCollaborators.map(collaborator => collaboratorString += `${collaborator.username}, `);

      if (collaboratorString.slice(-2) == ', ') {
        collaboratorString = collaboratorString.slice(0,-2);
      }

      return collaboratorString
    }

    function handleAddCollaborator(username: string) {
      const friend = friendProfiles.filter(profile => profile.username === username)[0];
      
      const searchResult = selectedCollaborators.filter(profile => profile.username === username);

      if (searchResult.length === 0) {
        setSelectedCollaborators([...selectedCollaborators, friend])
      }
    }

    function handleRemoveCollaborator(username: string) {
      setSelectedCollaborators(selectedCollaborators.filter(profile => profile.username !== username));
    }

    async function handleSaveChanges() {
      const removedCollaborators = collaborators.filter(current => !selectedCollaborators.includes(current));
      const addedCollaborators = selectedCollaborators.filter(current => !collaborators.includes(current))

      // Adding missing selected profiles
      for (const profile of addedCollaborators) {
        try {
          await axios.patch(`${import.meta.env.VITE_BASE_URL}/watchlist/${watchlist.listId}/collaborators`, { "collaborator": profile.userId }, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          })
          console.log(`Added ${profile.userId}`);
        } catch (err) {
          console.error(`Failed to add ${profile.userId}:`, err);
        }
      }

      // Removing unselected profiles
      for (const profile of removedCollaborators) {
        try {
          await axios.delete(`${import.meta.env.VITE_BASE_URL}/watchlist/${watchlist.listId}/collaborators`, {
            data: { "collaborator": profile.userId },
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          })
          console.log(`Removed ${profile.userId}`);
        } catch (err) {
          console.error(`Failed to remove ${profile.userId}:`, err);
        }
      }

      setCollaborators(selectedCollaborators);
    }

    useEffect(() => {
        if (profiles) {
          setFriendProfiles(profiles);
        }

        function handleBackdropClick(event: MouseEvent) {
            if (EditCollaboratorsRef.current && event.target === EditCollaboratorsRef.current) {
                onClose();
            }
        };

        if (isOpen) {
            const dialog = EditCollaboratorsRef.current;
            if (dialog && !dialog.open) {
                dialog.showModal();
            }
            dialog?.addEventListener('click', handleBackdropClick);
        } else {
            EditCollaboratorsRef.current?.close();
        }

          setSelectedCollaborators(collaborators);
        return () => {
            EditCollaboratorsRef.current?.removeEventListener('click', handleBackdropClick);
        };
    }, [isOpen, onClose, watchlist, collaborators, profiles]);

  return (
    <dialog ref={EditCollaboratorsRef} onClose={onClose} id='edit-collaborators-dialog'>
        <div id="edit-collaborators-dialog-container">
          <button id="edit-collaborators-dialog-close" onClick={() => {onClose()}}>&times;</button>

          <h1>Edit Collaborators</h1>

          <div id="edit-collaborators-add">
            <span className="edit-collaborators-label">Add From Friends:</span>
            <SearchableDropdown options={profiles.map(profile => profile.username)} setSelected={handleAddCollaborator}/>
          </div>

          <div id="edit-collaborators-remove">
            <span className="edit-collaborators-label">Remove Collaborator:</span>
            <SearchableDropdown options={selectedCollaborators.map(profile => profile.username)} setSelected={handleRemoveCollaborator}/>
          </div>

          <div id="edit-collaborators-display">
            <span className="edit-collaborators-label">Collaborators:</span>
            <p id="edit-collaborators-display-list">{displayCollaborators(selectedCollaborators)}</p>
          </div>

          <button id="edit-collaborators-submit" onClick={handleSaveChanges}>Save Changes</button>

        </div>
    </dialog>
  )
}
export default EditCollaborators