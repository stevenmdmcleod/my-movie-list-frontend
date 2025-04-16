// __tests__/Watchlists.test.tsx
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Watchlists from "./watchlists"; 
import * as db from "../../utils/databaseCalls";
// import * as jwtUtils from "../../utils/jwt";
// import axios from "axios";

// Mock React Router
jest.mock("react-router", () => ({
  Link: ({ to, children }: any) => <a href={to}>{children}</a>,
}));

// Mock databaseCalls and jwt
jest.mock("../../utils/databaseCalls");
// jest.mock("../../utils/jwt");

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

    (db.getPublicWatchlists as jest.Mock).mockResolvedValue({ data: mockWatchlist });  

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

  // test("shows Add Friend button when user is not already a friend", async () => {
  //   (db.getFriends as jest.Mock).mockResolvedValue({ data: [] }); // No friends

  //   render(<Watchlists />);
  //   await waitFor(() => {
  //     expect(screen.getByText(/Add Friend/i)).toBeInTheDocument();
  //   });
  // });
});
