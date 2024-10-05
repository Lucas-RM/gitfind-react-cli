import React from 'react';
import "./styles.css";

function ItemList({ link, title, description }) {
  return (
    <div className="item-list">
        <strong>
          <a href={ link } target="_blank" rel="noopener noreferrer">
            { title }
          </a>
        </strong>
        <p>{ description }</p>
        <hr />
    </div>
  )
}

export default ItemList;