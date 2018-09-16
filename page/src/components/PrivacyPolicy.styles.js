import { css } from 'emotion';

export default css`
  .privacy__body {
    color: rgb(226, 222, 222);
    font-weight: 300;
    font-size: 2rem;
    padding: 1rem;
    margin: 0;
  }

  .privacy__container {
    width: 75vw;
    margin: 2rem auto;
  }

  .title {
    font-size: 2rem;
    letter-spacing: 0.1rem;
    text-transform: uppercase;
    font-weight: bold;
    color: white;
    padding: 1rem;
    margin: 0;
  }

  .title--light {
    font-size: 4rem;
    letter-spacing: 0.1rem;
    text-transform: uppercase;
    font-weight: 300;
    color: white;
    padding: 1rem;
    margin: 0;
  }

  .sub-title {
    font-size: 2rem;
    letter-spacing: 0.1rem;
    text-transform: uppercase;
    font-weight: bold;
    color: white;
    padding: 1rem;
    margin: 0;
  }

   .footer {
    margin: 2rem auto;
    width: 50vw;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .link {
    color: rgba(190, 190, 190, 0.5);
    padding: 0.5rem;
    text-decoration: none;
  }

  .link:hover {
    color: rgba(190, 190, 190, 0.7);
  }

  .link--button,
  .link--button:active,
  .link--button:link,
  .link--button:visited {
    text-decoration: none;
    color: rgba(63, 41, 93, 0.9);
    padding: 0.5rem;
    line-height: 3.4rem;
  }
`;