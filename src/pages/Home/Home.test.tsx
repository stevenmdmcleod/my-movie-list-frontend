import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home";

// Mock JSON data
jest.mock("./newreleases.json", () => ({
  default: [
    {
      id: 1,
      title: "Movie One",
      poster: "poster1.jpg"
    }
  ]
}));

jest.mock("./action.json", () => ({
  default: [
    {
      id: 2,
      title: "Action Movie",
      poster: "poster2.jpg"
    }
  ]
}));

jest.mock("./comedy.json", () => ({
  default: [
    {
      id: 3,
      title: "Funny Movie",
      poster: "poster3.jpg"
    }
  ]
}));

// Mock the useNavigate hook globally
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("Home Component", () => {
  // Mock navigate function before each test
  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Reset the mock to ensure it's clean for each test
    mockNavigate.mockClear();
    require("react-router-dom").useNavigate.mockReturnValue(mockNavigate);
  });

  it("renders welcome message and section titles", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText("Welcome to My Movie List!")).toBeInTheDocument();
    expect(screen.getByText("New Releases")).toBeInTheDocument();
    expect(screen.getByText("Action Movies")).toBeInTheDocument();
    expect(screen.getByText("Comedies")).toBeInTheDocument();
  });

  it("renders movie cards from all categories", async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Movie One")).toBeInTheDocument();
      expect(screen.getByText("Action Movie")).toBeInTheDocument();
      expect(screen.getByText("Funny Movie")).toBeInTheDocument();
    });
    expect(screen.getAllByRole("img")).toHaveLength(3);
  });

  it("navigates to movie info page on click", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const movieButton = screen.getByText("Movie One");
    fireEvent.click(movieButton);

    // Ensure that navigate was called with the correct URL
    expect(mockNavigate).toHaveBeenCalledWith("/movieinformation/1");
  });
});
