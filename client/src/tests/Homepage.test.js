/**
 * HomePage.test.js
 * The following test cases are for the HomePage component:
 * 1. Test for basic rendering, to ensure the component renders without crashing
 * 2. Render the typed text "VerseNetwork"
 * 3. Render the description text
 * 4. Render the "Register" and "Login" buttons and also navigates to the correct page
 */
import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import HomePage from "../views/Home/Homepage";
import { useNavigate } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("HomePage", () => {
  let mockNavigate;
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate = jest.fn();
    useNavigate.mockImplementation(() => mockNavigate);
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
  });

  it('renders the typed text "VerseNetwork"', async () => {
    const typedText = await screen.findByText(
      "VerseNetwork",
      {},
      { timeout: 3000 }
    );
    expect(typedText).toBeInTheDocument();
  });

  it("renders the description text", () => {
    const descriptionText =
      "Join VerseNetwork — where gamers unite to share, connect, and level up together. Register or log in now!";
    const textElement = screen.getByText(descriptionText);
    expect(textElement).toBeInTheDocument();
  });

  it('renders the "Register" button component', () => {
    const regButton = screen.getByRole("button", { name: "Register" });
    userEvent.click(regButton);

    expect(mockNavigate).toHaveBeenCalledWith("/register");
  });

  it('renders the "Login" button component and when clicked navigates to /login', () => {
    const loginButton = screen.getByRole("button", { name: "Login" });
    userEvent.click(loginButton);

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
