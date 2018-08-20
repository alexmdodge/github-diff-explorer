import React from 'react';
import 'components/NoPage.css';

const NoPage = props => {
  return (
    <React.Fragment>
      <div className="no-page__container">
        <h1 className="title no-page__title">Sorry</h1>
        <h1 className="title--light no-page__title">That page does not exist.</h1>
      </div>
    </React.Fragment>
  )
}

export default NoPage;