import { useEffect, useRef, useState } from 'react'
import './EditCollaborators.css'

interface EditCollaboratorsProps {
  watchlist: Watchlist,
  isOpen: boolean,
  onClose: () => void
}

function EditCollaborators({watchlist, isOpen, onClose}: EditCollaboratorsProps) {
    const EditCollaboratorsRef = useRef<HTMLDialogElement>(null);
    const [selectedCollaborators, setSelectedCollaborators] = useState(watchlist.collaborators || []);

    useEffect(() => {
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

        // setEditListName(watchlist.listName);
        // setEditIsPublic(watchlist.isPublic);
          setSelectedCollaborators(watchlist.collaborators);
        return () => {
            EditCollaboratorsRef.current?.removeEventListener('click', handleBackdropClick);
        };
    }, [isOpen, onClose, watchlist]);
  return (
    <dialog ref={EditCollaboratorsRef} onClose={onClose} id='edit-collaborators-dialog'>
        <div id="edit-collaborators-dialog-container">
        <button id="edit-collaborators-dialog-close" onClick={() => {onClose()}}>&times;</button>

          Collaborators content
        </div>
    </dialog>
  )
}
export default EditCollaborators