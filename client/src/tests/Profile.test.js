import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import Profile from "../views/Users/Profile";
import { AuthProvider } from "../context/AuthContext";
import "@testing-library/jest-dom";

const existingUser = {
  username: "existingUser",
  email: "existing@example.com",
  userBio: "bio",
  profileImage: "image.png",
};

const auth = {
  token: "fake-token",
  userDetails: existingUser,
};

const AuthContext = ({ children }) => {
  return <AuthProvider value={{ auth }}>{children}</AuthProvider>;
};

// Mock fetch
const mockFetch = () => {
  global.fetch = jest.fn();
};

describe("Profile", () => {
  beforeEach(() => {
    mockFetch();
    window.alert = jest.fn();
  });

  it("renders the component and its elements", () => {
    render(
      <AuthContext>
        <BrowserRouter>
          <Profile />
        </BrowserRouter>
      </AuthContext>
    );

    expect(screen.getByText(/Welcome,/i)).toBeInTheDocument();
    expect(screen.getByAltText("Profile")).toBeInTheDocument();
    expect(screen.getByText(/Member since:/i)).toBeInTheDocument();
    expect(screen.getByText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByText("Edit Profile")).toBeInTheDocument();
    expect(screen.getByText("Update Profile")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Bio")).toBeInTheDocument();
  });

  it("updates profile successfully", async () => {
    const updatedUser = {
      username: "updatedUser",
      email: "updated@email.com",
      userBio: "updated bio",
    };

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...updatedUser }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Profile updated successfully" }),
      });
    window.alert = jest.fn();
    render(
      <AuthContext>
        <BrowserRouter>
          <Profile />
        </BrowserRouter>
      </AuthContext>
    );

    await userEvent.type(
      screen.getByPlaceholderText("Name"),
      updatedUser.username
    );
    await userEvent.type(
      screen.getByPlaceholderText("Email"),
      updatedUser.email
    );
    await userEvent.type(
      screen.getByPlaceholderText("Bio"),
      updatedUser.userBio
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Update Profile" })
    );

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

    expect(fetch.mock.calls[0][0]).toMatch("http://localhost:5000/getUser");
    expect(fetch.mock.calls[1][0]).toMatch("http://localhost:5000/updateUser");
    expect(fetch.mock.calls[1][1].method).toBe("PUT");
    expect(fetch.mock.calls[1][1].body).toEqual(JSON.stringify(updatedUser));
    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith("Profile updated successfully")
    );
  });

  it("fails to update profile with existing username", async () => {
    const updatedUser = {
      username: "existingUser",
      email: "",
      userBio: "",
    };

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...existingUser }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: "Username already exists." }),
      });

    render(
      <AuthContext>
        <BrowserRouter>
          <Profile />
        </BrowserRouter>
      </AuthContext>
    );

    await userEvent.type(
      screen.getByPlaceholderText("Name"),
      updatedUser.username
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Update Profile" })
    );

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

    expect(fetch.mock.calls[1][0]).toMatch("http://localhost:5000/updateUser");
    expect(fetch.mock.calls[1][1].method).toBe("PUT");
    expect(fetch.mock.calls[1][1].body).toEqual(JSON.stringify(updatedUser));

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith("Username already exists.")
    );
  });

  it("fails to update profile with existing email", async () => {
    const updatedUser = {
      username: "",
      email: "existing@example.com",
      userBio: "",
    };

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...existingUser }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: "Email already exists." }),
      });

    render(
      <AuthContext>
        <BrowserRouter>
          <Profile />
        </BrowserRouter>
      </AuthContext>
    );

    await userEvent.type(
      screen.getByPlaceholderText("Email"),
      updatedUser.email
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Update Profile" })
    );

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

    expect(fetch.mock.calls[0][0]).toMatch("http://localhost:5000/getUser");
    expect(fetch.mock.calls[1][0]).toMatch("http://localhost:5000/updateUser");
    expect(fetch.mock.calls[1][1].method).toBe("PUT");
    expect(fetch.mock.calls[1][1].body).toEqual(JSON.stringify(updatedUser));

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith("Email already exists.")
    );
  });

  it("uploads profile image successfully", async () => {
    const image = new File(["(⌐□_□)"], "chucknorris.png", {
      type: "image/png",
    });

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Image uploaded successfully" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ profileImage: "chucknorris.png" }),
      });

    render(
      <AuthContext>
        <BrowserRouter>
          <Profile />
        </BrowserRouter>
      </AuthContext>
    );

    await userEvent.upload(screen.getByTestId("image-upload-input"), image);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

    expect(fetch.mock.calls[1][0]).toMatch("http://localhost:5000/upload");
    expect(fetch.mock.calls[1][1].method).toBe("POST");
    expect(fetch.mock.calls[1][1].body instanceof FormData).toBeTruthy();

    await waitFor(() =>
      expect(screen.getByAltText("Profile").src).toContain("chucknorris.png")
    );

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith("Image uploaded successfully")
    );
  });

  it("fails to upload profile image wrong file type", async () => {
    const image = new File(["(⌐□_□)"], "chucknorris.pdf", {
      type: "application/pdf",
    });

    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        message: "Unsupported file type. Only JPG, PNG, and GIF are allowed.",
      }),
    });

    render(
      <AuthContext>
        <BrowserRouter>
          <Profile />
        </BrowserRouter>
      </AuthContext>
    );

    await userEvent.upload(screen.getByTestId("image-upload-input"), image);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith(
        "Unsupported file type. Only JPG, PNG, and GIF are allowed."
      )
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
