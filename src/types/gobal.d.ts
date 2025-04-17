interface Friend {
    userId: string,
    username: string
}

interface Profile {
    userId: string,
    username: string,
    email: string,
    biography: string,
    preferredGenres: Array<string>,
    profilePicture: string,
    signedUrl?: string,
    isAdmin?: boolean,
    isBanned?: boolean,
    collaborativeLists?: Array<string>,
    likedLists?: Array<string>,
    friends?: Array<Friend>,
    recentlyAdded?: Array<string>,
}

interface CommentData {
    commentId: string,
    userId: string,
    username: string,
    comment: string,
    datePosted: string
}

interface Watchlist {
    listId: string,
    userId: string,
    listName: string,
    isPublic: boolean,
    likes: Array<string>,
    titles: Array<string>,
    collaborators: Array<string>,
    comments: Array<CommentData>
}

interface MovieData {
    id: number;
    title: string;
    similar_titles: string[];
    poster: string;
    trailer: string;
    user_rating: string;
    critic_score: string;
    us_rating: string;
    release_date: string;
    type: string;
    plot_overview: string;
    genre_names: string[];
  }
