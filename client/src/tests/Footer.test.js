/**
 * Footer.test.js
 * The following test cases are for the Footer component:
 * 1. Test for basic rendering, to ensure the component renders without crashing
 * 2. Test for the presence of the VerseNetwork logo
 * 3. Test for the presence of the VerseNetwork name
 * 4. Test for the presence of the description
 * 5. Test for copyright information
 * 6. Test for navigation links
 */

import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';


import Footer from "../component/Footer";

describe('Footer', () => {
    beforeEach(() => {
      render(
        <BrowserRouter>
          <Footer />
        </BrowserRouter>
      );
    });
  
    it('renders without crashing', () => {
      expect(screen.getByText('VerseNetwork')).toBeInTheDocument();
    });
  
    // Test for the presence of the VerseNetwork name
    it('contains VerseNetwork name', () => {
      const name = screen.getByText('VerseNetwork');
      expect(name).toBeInTheDocument();
    });

  // Test for the presence of the description
  it('contains description', () => {
    const description = screen.getByText('where gamers unite to share,');
    expect(description).toBeInTheDocument();
    const description2 = screen.getByText('connect, and level up together.');
    expect(description2).toBeInTheDocument();
  });

  // Test for copyright information
  it('contains copyright information', () => {
    const copyright = screen.getByText('© 2024 VerseNetwork. All rights reserved.');
    expect(copyright).toBeInTheDocument();
  });

  // Test for navigation links
  it('contains navigation links', () => {
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Forum')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument(); 
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  //test to check if the links take to the correct page
  it('navigates to the correct page', () => {
    const homeLink = screen.getByText('Home');
    expect(homeLink).toHaveAttribute('href', '/');

    const forumLink = screen.getByText('Forum');
    expect(forumLink).toHaveAttribute('href', '/forum');

    const loginLink = screen.getByText('Login');
    expect(loginLink).toHaveAttribute('href', '/login');

    const registerLink = screen.getByText('Register');
    expect(registerLink).toHaveAttribute('href', '/register');
  });
});