import { ChangeEvent, useEffect, useRef, useState } from 'react';
import './EditWatchlist.css';
import axios from 'axios';

interface EditWatchlistProps {
  watchlist: Watchlist,
  listName: string,
  setListName: (listName: string) => void,
  setIsPublic: (option: boolean) => void,
  isOpen: boolean,
  onClose: () => void
}

function EditWatchlist({watchlist, listName, setListName, setIsPublic, isOpen, onClose}:EditWatchlistProps) {
    const EditWatchlistRef = useRef<HTMLDialogElement>(null);
    const [editListName, setEditListName] = useState<string>(watchlist.listName || '');
    const [editIsPublic, setEditIsPublic] = useState<boolean>(watchlist.isPublic || false);

    async function handleSaveChanges() {
        const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/watchlist/${watchlist.listId}`, {
            listName: editListName,
            isPublic: editIsPublic
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })

        if (response.status === 200) {
            setListName(editListName);
            setIsPublic(editIsPublic);
            onClose();
        }
    }

    function handleListNameChange(event: ChangeEvent<HTMLInputElement>) {
        setEditListName(event.target.value);
    }

    useEffect(() => {
        function handleBackdropClick(event: MouseEvent) {
            if (EditWatchlistRef.current && event.target === EditWatchlistRef.current) {
                onClose();
            }
        };

        if (isOpen) {
            const dialog = EditWatchlistRef.current;
            if (dialog && !dialog.open) {
                dialog.showModal();
            }
            dialog?.addEventListener('click', handleBackdropClick);
        } else {
            EditWatchlistRef.current?.close();
        }

        setEditListName(listName);
        setEditIsPublic(watchlist.isPublic);
        return () => {
            EditWatchlistRef.current?.removeEventListener('click', handleBackdropClick);
        };
    }, [isOpen, onClose, watchlist]);
  return (
    <dialog ref={EditWatchlistRef} onClose={onClose} id='edit-watchlist-dialog'>
        <div id="edit-watchlist-dialog-container">
            <button id="edit-watchlist-dialog-close" onClick={() => {onClose()}}>&times;</button>

            <h1>Edit Watchlist</h1>
            <div id="edit-watchlist-name">
                <span className='edit-watchlist-label'>Watchlist Name: </span>
                <input type="text" name='edit-watchlist-name-input' id='edit-watchlist-name-input' value={editListName} onChange={handleListNameChange}/>
            </div>
            
            <div id="edit-watchlist-visibility">
                <span className='edit-watchlist-label'>Visibility:</span>
                <div id="edit-watchlist-visibility-options">
                    <label>
                        <input type="radio" name="edit-watchlist-public" value="true" onClick={() => setEditIsPublic(true)} defaultChecked={editIsPublic === true}/>
                        Public
                    </label>
                    <label>
                        <input type="radio" name="edit-watchlist-public" value="false" onClick={() => setEditIsPublic(false)} defaultChecked={editIsPublic === false}/>
                        Private
                    </label>
                </div>
            </div>

            <button id="edit-watchlist-submit" onClick={handleSaveChanges}>Save Changes</button>
        </div>
    </dialog>
  )
}

export default EditWatchlist