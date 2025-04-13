import React, { useEffect, useState } from 'react';
import defaultTitleImage from '../../../assets/Images/default-movie-cover.jpg';
import './TitleCard.css';
import { useNavigate } from 'react-router';

export interface TitleInformation {
    id: number,
    title: string,
    poster: string,
}

interface TitleCardProps {
    titleInfo: TitleInformation
    handleDelete: (id: number, titleName: string) => void,
    userCanDelete: boolean
}

function TitleCard({ titleInfo, handleDelete, userCanDelete } :TitleCardProps) {
    const navigate = useNavigate();
    const [title, setTitle] = useState<TitleInformation>(titleInfo || {});

    function handleNavigate(id: number) {
        navigate(`/movieinformation/${id}`)
    }



    useEffect(() => {
        if (titleInfo && titleInfo.id) {
            if (titleInfo.id !== title.id) {
                setTitle(titleInfo);
            }
        }
    }, [titleInfo, title])

  return (
    <div className='title-card'>
        { userCanDelete? <span className="title-card-delete" onClick={() => handleDelete(title.id, title.title)}></span>: null}
        <img className='title-card-poster' onClick={() => handleNavigate(title.id)} src={title.poster || defaultTitleImage} alt="Title Poster" />
        <div className="title-card-name" onClick={() => handleNavigate(title.id)}>{title.title}</div>
    </div>
  )
}

export default TitleCard