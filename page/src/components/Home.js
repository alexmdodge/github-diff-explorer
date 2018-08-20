import React from 'react';
import { Link } from "react-router-dom";
import 'components/Home.css';

import logo from 'assets/gde-banner.png';
import Check from 'assets/icons/Check.js';
import Twitter from 'assets/icons/Twitter.js';


const Home = props => {
  return (
    <React.Fragment>
      <div className="container">
        <div className="title__container">
          <img src={logo} className="title__logo" alt="Diff Explorer Logo" />
          <h1 className="title">Diff Explorer</h1>
        </div>
        <div className="social__container">
          <div className="social__twitter">
            <a href="https://twitter.com/alexmdodge" className="social__link">
              <Twitter />
            </a>
          </div>
          <a
            className="github-button"
            href="https://github.com/alexmdodge/github-diff-explorer"
            data-size="small" 
            data-show-count="true" 
            aria-label="Star alexmdodge/github-diff-explorer on GitHub"
          >
            Star
          </a>
        </div>
        <p className="description__highlight">
          Tired of reviewing long and cumbersome pull requests using
          the default GitHub interface?
        </p>

        <p className="description__body">
          The <b>GitHub Diff Explorer</b> is a Chrome extension 
          which generates a file explorer similar to that of BitBucket
          with a minimalist focus. This extension provides:
        </p>

        <ul className="feature__list">
          <li className="feature__list-item">
            <Check />
            <span> More screen real estate with a full width view and a resizable explorer</span>
          </li>
          <li className="feature__list-item">
            <Check />
            <span> Improved review management and organization with collapsible folder views</span>
          </li>
          <li className="feature__list-item">
            <Check />
            <span> Deep links to line references and review comments</span>
          </li>
        </ul>
      </div>

      <footer className="footer">
        <div>
          <Link to="/privacy-policy" className="link">Privacy Policy</Link>
          <a href="https://www.alexdodge.ca" className="link">About</a>
        </div>
      </footer>
    </React.Fragment>
  )
}

export default Home;