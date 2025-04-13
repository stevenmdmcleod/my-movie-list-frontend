import './TitleView.css';
import TitleCard, { TitleInformation } from '../TitleCard/TitleCard';
import axios from 'axios';

interface TitleViewProps {
    titles: Array<TitleInformation>,
    setTitles: (newTitle: Array<TitleInformation>) => void,
    userIsOwner: boolean,
    userIsCollaborator: boolean,
    watchlistData: Watchlist
}

function TitleView({titles, setTitles, userIsOwner, userIsCollaborator, watchlistData}: TitleViewProps) {
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

    return (
        <div id="individual-watchlist-titles-view">
            {titles.map((title, index) => {
                return <TitleCard key={title.id + index} titleInfo={title} handleDelete={handleDelete} userCanDelete={userIsOwner || userIsCollaborator}/>
            })}
        </div>
    )
}

export default TitleView