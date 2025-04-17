import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Friends from "./friends";


// Mocking the useNavigate hook
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
  }));
  
  // Mocking the database call for getFriends
  jest.mock("../../utils/databaseCalls", () => ({
    getFriends: jest.fn(),
    addFriend: jest.fn(),
  }));
describe("Friends Component", () => {
  
  it("renders the Friends title", () => {
    render(
      <MemoryRouter>
        <Friends />
      </MemoryRouter>
    );

    expect(screen.getByText("Friends")).toBeInTheDocument();
  });

  it("renders friends if the data is available", async () => {
    const mockFriends = [
      { userId: "1", username: "JohnDoe" },
      { userId: "2", username: "JaneDoe" },
    ];
    const { getFriends } = require("../../utils/databaseCalls");
    getFriends.mockResolvedValueOnce({ status: 200, data: mockFriends });

    render(
      <MemoryRouter>
        <Friends />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("JohnDoe")).toBeInTheDocument();
      expect(screen.getByText("JaneDoe")).toBeInTheDocument();
    });
  });

  it("shows 'No friends found' if there are no friends", async () => {
    const { getFriends } = require("../../utils/databaseCalls");
    getFriends.mockResolvedValueOnce({ status: 200, data: [] });

    render(
      <MemoryRouter>
        <Friends />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("No friends found.")).toBeInTheDocument();
    });
  });

  it("handles error in fetching friends", async () => {
    const { getFriends } = require("../../utils/databaseCalls");
    getFriends.mockRejectedValueOnce(new Error("Failed to fetch friends"));

    render(
      <MemoryRouter>
        <Friends />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("No friends found.")).toBeInTheDocument();
    });
  });

  it("calls handleProfileNavigation on clicking a friend", async () => {
    const mockNavigate = jest.fn();
    // Import getFriends from the mocked databaseCalls module
    const { getFriends } = require("../../utils/databaseCalls");

    // Set the mock of useNavigate to return our mockNavigate function
    (require("react-router-dom").useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    // Mock the getFriends call to return a list with JohnDoe as a friend
    getFriends.mockResolvedValueOnce({
      status: 200,
      data: [{ userId: "1", username: "JohnDoe" }],
    });

    render(
      <MemoryRouter>
        <Friends />
      </MemoryRouter>
    );

    // Wait for the friends list to be rendered
    await waitFor(() => {
      expect(screen.getByText("JohnDoe")).toBeInTheDocument();
    });

    const friendButton = screen.getByText("JohnDoe");
    fireEvent.click(friendButton);

    // Ensure that navigate was called with the correct userId
    expect(mockNavigate).toHaveBeenCalledWith("/profile", { state: { userId: "1" } });
  });

  it("adds a friend successfully", async () => {
    const { addFriend } = require("../../utils/databaseCalls");
    addFriend.mockResolvedValueOnce({ status: 200 });

    render(
      <MemoryRouter>
        <Friends />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText("Enter friend's username here");
    const button = screen.getByText("Add Friend");

    fireEvent.change(input, { target: { value: "NewFriend" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Friend added successfully!")).toBeInTheDocument();
    });
  });

  it("shows error when adding a friend fails", async () => {
    const { addFriend } = require("../../utils/databaseCalls");
    addFriend.mockResolvedValueOnce({ status: 400 });

    render(
      <MemoryRouter>
        <Friends />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText("Enter friend's username here");
    const button = screen.getByText("Add Friend");

    fireEvent.change(input, { target: { value: "NonExistentUser" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Failed to add friend. username does not exist")).toBeInTheDocument();
    });
  });

  it("shows generic error when adding a friend fails with unexpected error", async () => {
    const { addFriend } = require("../../utils/databaseCalls");
    addFriend.mockRejectedValueOnce(new Error("Unexpected error"));

    render(
      <MemoryRouter>
        <Friends />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText("Enter friend's username here");
    const button = screen.getByText("Add Friend");

    fireEvent.change(input, { target: { value: "SomeUser" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Failed to add friend, please try again")).toBeInTheDocument();
    });
  });

});