import { ChangeEvent, useState, Fragment } from 'react';
import './CommentSection.css';
import Comment from '../Comment/Comment';
import { Pagination } from 'react-bootstrap';
import axios from 'axios';
import { BASE_ROUTE } from '../../../utils/config';

const COMMENTS_PER_PAGE = 5;

interface CommentSectionProps {
    comments: Array<Comment>,
    setComments: (newComments: Array<Comment>) => void,
    watchlistData: Watchlist | null
}

function CommentSection({comments,setComments, watchlistData}:CommentSectionProps) {
    const [comment, setComment] = useState<string>("");
    
    // Used for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(comments.length / COMMENTS_PER_PAGE);
    const indexOfLastComment = currentPage * COMMENTS_PER_PAGE;
    const indexOfFirstComment = indexOfLastComment - COMMENTS_PER_PAGE;
    const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);

    function handleCommentUpdate(event: ChangeEvent<HTMLTextAreaElement>) {
        setComment(event.target.value);
    }

    async function handleSubmitComment() {
        if (!watchlistData) return;
        const response = await axios.put(`${BASE_ROUTE}/watchlist/${watchlistData.listId}/comments`, { comment },{
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
  return (
    <div id="individual-watchlist-comment-section">
    <h2>Comments</h2>
    <hr id='individual-watchlist-header-comments-hr'/>
    
    <div id="individual-watchlist-create-comment">
        <textarea name="add-comment" id="individual-watchlist-comment-textarea" rows={5} maxLength={400} value={comment} onChange={handleCommentUpdate}></textarea>
        <button id="individual-watchlist-post-comment" onClick={handleSubmitComment}>Post</button>
    </div>

    <div id="individual-watchlist-comments">
        {currentComments.map(comment => {
            return <Fragment key={comment.commentId}>
                <Comment  comment={comment} />
                <hr id='individual-watchlist-header-hr-light'/>
            </Fragment>
        })}

        <Pagination style={{ width: '100%' }}  className="mt-3 justify-content-center">
                <Pagination.Prev
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                />
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                >
                    {page}
                </Pagination.Item>
                ))}
                <Pagination.Next
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                />
            </Pagination>
    </div>
</div>
  )
}

export default CommentSection