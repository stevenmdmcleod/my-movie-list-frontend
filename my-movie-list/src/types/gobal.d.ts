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


  interface Watchlist {
    listId: string;
    collaborators: string[];
    comments: [];
    isPublic: boolean;
    likes: [];
    listName: string;
    titles: [];
    userId: string;
  }
