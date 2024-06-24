import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import Login from "../views/Users/Login";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

describe("Login Component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    global.fetch = jest.fn();

    require("../context/AuthContext").useAuth.mockImplementation(() => ({
      auth: { token: null, userDetails: {} },
      login: jest.fn(),
      logout: jest.fn(),
      updateUserDetails: jest.fn(),
    }));
  });

  it("renders the component and its elements", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByText("User Login")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Register" })).toBeInTheDocument();
  });

  it("successfully logs in the user and redirects to /forum", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: "fake_token" }),
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    userEvent.type(screen.getByPlaceholderText("Username"), "testuser");
    userEvent.type(screen.getByPlaceholderText("Password"), "password");
    userEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/forum"));
    expect(global.fetch).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({ username: "testuser", password: "password" }),
      })
    );
  });

  it("displays an error message when login fails", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Invalid username or password" }),
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    userEvent.type(screen.getByPlaceholderText("Username"), "wronguser");
    userEvent.type(screen.getByPlaceholderText("Password"), "wrongpassword");
    userEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() =>
      expect(screen.getByText("Login failed")).toBeInTheDocument()
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
