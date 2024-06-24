/**
 * NavBar.test.js
 * The following test cases are for the Navbar component:
 * 1. Test for basic rendering, to ensure the component renders without crashing
 * 2. Test for the presence of the VerseNetwork logo
 * 3. Test for the presence of Home link
 * 4. Test for the presence of Forum link
 */

import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import NavBar from "../component/NavBar";

describe('NavBar', () => {
    beforeEach(() => {
        render(
        <BrowserRouter>
            <NavBar />
        </BrowserRouter>
        );
    });
    
    // Test for the presence of the VerseNetwork logo
    it('contains VerseNetwork logo', () => {
        const img = screen.getByAltText('Logo');
        expect(img).toBeInTheDocument();
    });
    
    // Test for the presence of Home link
    it('contains Home link', () => {
        const homeLink = screen.getByText('Home');
        expect(homeLink).toBeInTheDocument();
    });
    
    // Test for the presence of Forum link
    it('contains Forum link', () => {
        const forumLink = screen.getByText('Forum');
        expect(forumLink).toBeInTheDocument();
    });
});
