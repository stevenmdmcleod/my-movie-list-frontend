// __tests__/Watchlists.test.tsx
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Watchlists from "./watchlists"; 
import * as db from "../../utils/databaseCalls";
import axios from 'axios';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock React Router
jest.mock("react-router", () => ({
  Link: ({ to, children }: any) => <a href={to}>{children}</a>,
}));

// Mock databaseCalls and jwt
jest.mock("../../utils/databaseCalls");

describe("Watchlists Component", () => {
  const mockWatchlist = [
    {
      listId: "1",
      listName: "My Watchlist",
      userId: "user123",
      username: "testUser",
      comments: [],
      likes: ["a", "b"],
      titles: ["tt123", "tt456"],
      collaborators: [],
    },
  ];

  beforeEach(() => {
    // Mock the getPublicWatchlists call
    (db.getPublicWatchlists as jest.Mock).mockResolvedValue({ data: mockWatchlist });
  
    // Mock the per-title movie data API call
    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes('/watchmode/title/')) {
        return Promise.resolve({
          data: {
            title: 'Mock Movie Title',
            poster: 'mock-poster.jpg',
          },
        });
      }
  
      // Optional: Fail fast if unexpected URL is hit (good for catching mistakes)
      return Promise.reject(new Error(`Unhandled request: ${url}`));
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  
  });

  test("renders public watchlists", async () => {
    render(<Watchlists />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText("My Watchlist")).toBeInTheDocument();
      expect(screen.getByText("testUser")).toBeInTheDocument();
    });

    
  });

  test("filters watchlists by search", async () => {
    render(<Watchlists />);

    await waitFor(() => {
      expect(screen.getByText("My Watchlist")).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText("Search watchlists...");
    fireEvent.change(input, { target: { value: "not-found" } });

    expect(screen.getByText("No watchlists found.")).toBeInTheDocument();
  });

});
