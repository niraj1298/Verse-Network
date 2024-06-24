import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Forum from "../views/Forum/Forum";
import General from "../views/Forum/General";
import Gaming from "../views/Forum/Gaming";
import QA from "../views/Forum/QA";
import { AuthProvider } from "../context/AuthContext";
import { BrowserRouter } from "react-router-dom";


describe("Forum", () => {

  //Main Forum Page
  it("Renders the forum page, and all its UI elements", () => {

    render(
      <BrowserRouter>
        <AuthProvider>
          <Forum />
        </AuthProvider>
      </BrowserRouter>
    );
    const forumPage = screen.getByText("Forum Page");
    expect(forumPage).toBeInTheDocument();
    const generalCategory = screen.getByText("General");
    expect(generalCategory).toBeInTheDocument();
    const gamingCategory = screen.getByText("Gaming");
    expect(gamingCategory).toBeInTheDocument();
    const qaCategory = screen.getByText("Q&A");
    expect(qaCategory).toBeInTheDocument();
  });


  it("Renders the floating action button", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Forum />
        </AuthProvider>
      </BrowserRouter>
    );
    const floatingActionButton = screen.getByRole("button");
    expect(floatingActionButton).toBeInTheDocument();
  });

  it("Renders the general category, and it's elements", async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <General />
        </AuthProvider>
      </BrowserRouter>
    );
   
    const loading = await screen.findByText("Loading...");
    expect(loading).toBeInTheDocument();
    const generalCategory = await screen.findByText(
      "Welcome to the General Threads"
    );
    expect(generalCategory).toBeInTheDocument();

    const createPostButton = await screen.findByText("Create Post");
    expect(createPostButton).toBeInTheDocument();
    
  });

  it("Renders the gaming category, and it's elements", async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Gaming />
        </AuthProvider>
      </BrowserRouter>
    );

    const loading = await screen.findByText("Loading...");
    expect(loading).toBeInTheDocument();
    const gamingCategory = await screen.findByText(
      "Welcome to the Gaming Content Threads"
    );
    expect(gamingCategory).toBeInTheDocument();
    const createPostButton = await screen.findByText("Create Post");
    expect(createPostButton).toBeInTheDocument();
  }
  );

  it("Renders the qa category, and it's elements", async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <QA />
        </AuthProvider>
      </BrowserRouter>
    );

    const loading = await screen.findByText("Loading...");
    expect(loading).toBeInTheDocument();
    const qaCategory = await screen.findByText("Welcome to the Questions and Answer Threads");
    expect(qaCategory).toBeInTheDocument();
    const createPostButton = await screen.findByText("Create Post");
    expect(createPostButton).toBeInTheDocument();
  }
  );
});
