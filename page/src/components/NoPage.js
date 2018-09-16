import React from 'react';
import noPageClass from 'components/NoPage.styles';

const NoPage = props => {
  return (
    <div className={noPageClass}>
      <div className="no-page__container">
        <h1 className="title no-page__title">Sorry</h1>
        <h1 className="title--light no-page__title">That page does not exist.</h1>
      </div>
    </div>
  )
}

export default NoPage;