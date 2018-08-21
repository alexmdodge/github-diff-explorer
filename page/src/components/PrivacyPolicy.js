import React from 'react';
import ReactGA from 'react-ga';
import { Link } from 'react-router-dom';
import 'components/PrivacyPolicy.css';

const PrivacyPolicy = props => {
  ReactGA.pageview('/privacy-policy');

  const titleStyles = {
    marginBottom: 0,
    paddingBottom: 0,
  };

  const subTitleStyles = {
    marginTop: 0,
    marginBottom: '4rem',
    paddingTop: 0,
  };

  const bodyStyles = {
    marginBottom: '1rem',
  }

  return (
    <div className="privacy__container">
      <h1 className="title" style={titleStyles}>GitHub Diff Explorer</h1>
      <h1 className="title--light" style={subTitleStyles}>Privacy Policy</h1>

      <h1 className="sub-title">What Information do we Collect?</h1>
      <p className="privacy__body" style={bodyStyles}>
        The GitHub Diff Explorer collects the titles of files and folders included
        in pull requests. It only does this temporarily when creating the necessary
        visual elements. This information is not persisted or stored anywhere.
        It does not collect, store, or manage any other information.
      </p>

      <h1 className="sub-title">How do we use the Information?</h1 >
      <p className="privacy__body" style={bodyStyles}>
        The GitHub Diff Explorer uses the titles of the files and folders located
        in a pull request to generate any interactive components the extension uses.
        It does not use information in any other way.
      </p>

      <h1 className="sub-title">What Information we Share?</h1 >
      <p className="privacy__body" style={bodyStyles}>
        The GitHub Diff Explorer does not share your information.
      </p>

      <footer className="footer">
        <div>
          <Link to="/" className="link">Home</Link>
          <a href="https://www.alexdodge.ca" className="link">About</a>
        </div>
      </footer>
    </div>
  )
}

export default PrivacyPolicy;