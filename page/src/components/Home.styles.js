import { css } from 'emotion';

export default css`
  .social__link {
    cursor: pointer;
  }

  .social__twitter {
    width: 1rem;
    padding-right: 1rem;
  }

  .social__container {
    display: flex;
    justify-content: right;
    align-items: center;
    flex-direction: row;
    padding: 0.5rem;
  }

  .container {
    margin: 5vh auto 0;
    width: 95vw;
    max-width: 1200px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }

  .title__container {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
  }

  .title {
    font-size: 2rem;
    letter-spacing: 0.1rem;
    text-transform: uppercase;
    font-weight: bold;
    color: white;
    text-align: center;
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

  .description__highlight {
    color: rgb(226, 222, 222);
    font-weight: 300;
    font-size: 1.3rem;
    padding: 1rem;
    margin: 0;
    text-align: center;
    font-style: italic;
  }

  .description__body {
    color: rgb(226, 222, 222);
    font-weight: 300;
    font-size: 1.3rem;
    padding: 1rem;
    margin: 0;
    text-align: center;
  }

  .description__install-container {
    width: 75%;
    position: relative;
    margin-top: 3rem;
  }

  .description__screenshot {
    width: 100%;
    border-radius: 0.5rem;
  }

  .install__overlay {
    position: absolute;
    height: 99.5%;
    width: 100%;
    border-radius: 0.455rem;

    background-color: rgba(63, 41, 93, 0.4);
  }

  .install__button {
    font-family: 'Roboto', sans-serif;
    font-size: 1rem;
    text-transform: uppercase;
    font-weight: bold;

    position: absolute;
    left: 50%;
    top: 30%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);

    user-select: none;

    cursor: pointer;
    border: none;
    outline: none;

    white-space: nowrap;

    color: rgba(63, 41, 93, 0.9);
    border-radius: 4px;
    border: 0.09rem solid rgba(63, 41, 93, 0.9);
    border-bottom: 0.29rem solid rgba(63, 41, 93, 0.9);

    z-index: 10;
  }

  .install__button:hover {
    background-color: rgba(235, 224, 250, 0.9);
  }

  .install__button:active {
    background-color: rgba(195, 186, 206, 0.9);
  }

  .install__title {
    text-transform: none;
    font-size: 2rem;
    font-family: 'Roboto Condensed', sans-serif;
    margin: 0;
    padding: 1rem 0 0;
  }

  .title__logo {
    width: 4rem;
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

  .feature__list {
    list-style: none;
    padding: 0rem 3rem;
  }

  .feature__list-item {
    display: flex;
    justify-content: left;
    align-items: center;
  }

  .feature__list-item {
    display: flex;
    justify-content: left;
    align-items: center;
    padding-bottom: 0.75rem;

    color: rgb(226, 222, 222);
    font-weight: 300;
    font-size: 1.2rem;
  }

  .feature__list-item > span {
    padding-left: 1rem;
  }

  @media (min-width: 900px) {
    .container {
      width: 80vw;
    }
    .title {
      font-size: 3.5rem;
    }

    .title__logo {
      width: 8rem;
    }

    .description__highlight,
    .description__body {
      font-size: 2rem;
    }

    .feature__list-item {
      font-size: 1.75rem;
    }

    .install__button {
      font-size: 1.8rem;
      top: 45%;
    }

    .link--button,
    .link--button:active,
    .link--button:link,
    .link--button:visited {
      padding: 1.8rem;
    }
  }
`;