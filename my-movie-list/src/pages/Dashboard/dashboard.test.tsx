import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "./dashboard";
import * as db from "../../utils/databaseCalls";
import * as jwtUtils from "../../utils/jwt";
import { BrowserRouter, MemoryRouter } from "react-router-dom";

// Mock API calls
jest.mock("../../utils/databaseCalls", () => ({
  getUsers: jest.fn().mockResolvedValue({
    data: [
      {
        username: "testuser",
        email: "test@example.com",
        biography: "Just a test user",
        preferredGenres: [],
        friends: [],
        signedUrl: "",
        userId: "123",
        isBanned: false,
        isAdmin: false,
      },
    ],
  }),
  getAllWatchlistsAdmins: jest.fn().mockResolvedValue({
    data: [
      {
        listId: "wl1",
        listName: "New Watchlist",
        userId: "123",
        username: "newuser1",
        comments: [],
        likes: [],
        titles: [],
        collaborators: [],
        isPublic: true,
      },
    ],
  }),
  getAllWatchlistComments: jest.fn().mockResolvedValue({
    data: [
      {
        commentId: "c1",
        comment: "Nice watchlist!",
        datePosted: "2024-04-10",
        userId: "123",
        username: "Commenter",
        watchlistId: "wl1",
        watchlistName: "Test Watchlist",
      },
    ],
  }),
  updateBanStatus: jest.fn(() => Promise.resolve()),
  deleteCommentOnWatchlist: jest.fn(() => Promise.resolve()),
}));

// Mock the decodeToken function
jest.mock("../../utils/jwt", () => ({
  ...jest.requireActual("../../utils/jwt"),
  decodeToken: jest.fn(() => ({
    userId: "admin123",
    username: "admin123",
    isAdmin: true,
  })),
}));

// Helper to wrap in router
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Dashboard Component", () => {
  beforeEach(() => {
    // (db.getUsers as jest.Mock).mockResolvedValue({ data: [] });
    // (db.getAllWatchlistComments as jest.Mock).mockResolvedValue({ data: [] });
    // (db.getAllWatchlistsAdmins as jest.Mock).mockResolvedValue({ data: [] });
  });  

  it("renders the dashboard sidebar", async () => {
    renderWithRouter(<Dashboard />);

    expect(screen.getByText(/My Movie List/i)).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-dashboard")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-users")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-watchlists")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-comments")).toBeInTheDocument();

  });

  it("renders the dashboard main content", async () => {
    renderWithRouter(<Dashboard />);

    expect(screen.getByTestId("dashboard-users")).toBeInTheDocument();
    expect(screen.getByTestId("dashboard-watchlists")).toBeInTheDocument();
    expect(screen.getByTestId("dashboard-comments")).toBeInTheDocument();

  });

  test("renders header title as 'Dashboard'", () => {
    renderWithRouter(<Dashboard />);

    const headerTitle = screen.getByTestId("header-title");
    expect(headerTitle).toHaveTextContent("Dashboard");
  });

  it("renders the dashboard profile", async () => {
    renderWithRouter(<Dashboard />);

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("admin123")).toBeInTheDocument();
  });

  it("displays users in dashboard section", async () => {
    renderWithRouter(<Dashboard />);

     // Wait for users to be loaded
     await waitFor(() =>
      expect(screen.getByTestId("dashboard-users")).toBeInTheDocument()
    );

    // Check if the mocked username is displayed
    expect(screen.getByText("testuser")).toBeInTheDocument();
    
  });

  it("displays watchlists in dashboard section", async () => {
    renderWithRouter(<Dashboard />);

     // Wait for watchlists to be loaded
     await waitFor(() =>
      expect(screen.getByTestId("dashboard-watchlists")).toBeInTheDocument()
    );

    // Check if the mocked watchlist is displayed
    expect(screen.getByText("newuser1")).toBeInTheDocument();
    expect(screen.getByText("New Watchlist")).toBeInTheDocument();
    
  });

  it("displays the comments in dashboard section", async () => {
    renderWithRouter(<Dashboard />);

    // Wait for comments to be loaded
    await waitFor(() =>
      expect(screen.getByTestId("dashboard-comments")).toBeInTheDocument()
    );
    
    expect(screen.getByText("Test Watchlist")).toBeInTheDocument();
    expect(screen.getByText("Commenter")).toBeInTheDocument();
    expect(screen.getByText("Nice watchlist!")).toBeInTheDocument();
  });
});
