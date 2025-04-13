import { useNavigate } from 'react-router';
import defaultProfilePicture from '../../../assets/Images/default-profile.jpg';
import useProfileData from '../../../hooks/useProfileData';
import './Comment.css';

interface CommentProps {
    comment: Comment
}

function Comment({ comment }: CommentProps) {
    const navigate = useNavigate();
    const { data } = useProfileData(comment.userId);

    function handleProfileNavigation(userId: string) {
        if (!userId) return;
        navigate('/profile', { state: { userId }})
    }

    return (
        <div className="individual-comment">
            <div className="individual-comment-profile">
                <img src={data?.signedUrl || defaultProfilePicture} alt="" className="individual-comment-profile-picture" />
                <a href="#" onClick={(e) => {e.preventDefault(); handleProfileNavigation(comment.userId);}}>{comment.username}</a>

            </div>
            <div className="individual-comment-content">
                {comment.comment}
            </div>
        </div>
    )
}

export default Comment