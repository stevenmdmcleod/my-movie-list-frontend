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
