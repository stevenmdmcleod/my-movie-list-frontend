import './SearchResults.css';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { searchWatchlistByName } from '../../utils/databaseCalls';


function SearchResults() {
    const { query } = useParams();
    const navigate = useNavigate();
    const [searchResults, setSearchResults] = useState<any[] | undefined>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchSearchResults = async () => {
        try {
            const response: any = await searchWatchlistByName(query || '');

            if (response.status === 200) {
            setSearchResults(response.data.title_results);

            setLoading(false);
            setError(null);
            } else {
            setLoading(false);
            setError('No results found.');
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
            setError('Could not fetch search results.');
        } finally {
            setLoading(false);
        }
        };
    
        fetchSearchResults();
    }, [query]); // Fetch new results when the query changes
    
    return (
        <div className="search-results-container">
        <h1 className="search-results-title">Search Results for "{query}"</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && !error && (searchResults ?? []).length === 0 && (
            <p>No results found.</p>
        )}
        <div className="search-results-grid">
            {(searchResults ?? []).map((movie) => (
            <button
                key={movie.id}
                className="search-result-card"
                onClick={() => navigate(`/movieinformation/${movie.id}`)}
            >
                <img src={movie.poster} alt={movie.name} className="search-result-poster" />
                <h2 className="search-result-title">{movie.title}</h2>
            </button>
            ))}
        </div>
        </div>
    );
}

export default SearchResults;