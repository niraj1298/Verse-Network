import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Register from "../views/Users/Register";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

const mockNavigate = jest.fn();

const existingUser = {
  username: "existingUser",
  password: "password123",
  email: "existing@example.com",
};

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

describe("Register Component", () => {
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
        <Register />
      </BrowserRouter>
    );

    expect(screen.getByText("User Register")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Register" })
    ).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("successfully registers a user and redirects to forum page", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: "fakeToken" }),
    });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    userEvent.type(screen.getByPlaceholderText("Username"), "testuser");
    userEvent.type(screen.getByPlaceholderText("Password"), "password");
    userEvent.type(screen.getByPlaceholderText("Email"), "email@example.com");
    userEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/forum"));
    expect(global.fetch).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          username: "testuser",
          password: "password",
          email: "email@example.com",
        }),
      })
    );
  });

  it("displays an error message when the username already exists", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Username already exists" }),
    });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    userEvent.type(
      screen.getByPlaceholderText("Username"),
      existingUser.username
    );
    userEvent.type(
      screen.getByPlaceholderText("Password"),
      existingUser.password
    );
    userEvent.type(
      screen.getByPlaceholderText("Email"),
      "uniqueemail@example.com"
    );
    userEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() =>
      expect(screen.getByText("Username already exists")).toBeInTheDocument()
    );

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("displays an error message when registration fails due to an existing email", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Email already exists" }),
    });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    userEvent.type(screen.getByPlaceholderText("Username"), "uniqueUsername");
    userEvent.type(
      screen.getByPlaceholderText("Password"),
      existingUser.password
    );
    userEvent.type(screen.getByPlaceholderText("Email"), existingUser.email);
    userEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => screen.getByText("Email already exists"));
    expect(screen.getByText("Email already exists")).toBeInTheDocument();

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("displays an error message when registration fails due to both existing username and email", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Username and email already exist" }),
    });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    userEvent.type(
      screen.getByPlaceholderText("Username"),
      existingUser.username
    );
    userEvent.type(
      screen.getByPlaceholderText("Password"),
      existingUser.password
    );
    userEvent.type(screen.getByPlaceholderText("Email"), existingUser.email);
    userEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => screen.getByText("Username and email already exist"));
    expect(
      screen.getByText("Username and email already exist")
    ).toBeInTheDocument();

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
