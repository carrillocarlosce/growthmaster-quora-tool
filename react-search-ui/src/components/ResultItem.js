import React from "react";
import numeral from "numeral";

export function ResultItem({ id, title, description, link, types, upvotes }) {
  const votes = numeral(upvotes || 0);
  return (
    <a href={link} target="_blank">
      <article id={id} className="ce-result-item">
        <div className="ce-result-item__title">{title}</div>
        <div className="ce-result-item__description">{description}</div>
        <div className="ce-result-item__types">
          {(types || []).map((item, index) => {
            return <span key={`type_${index}`}>{item}</span>;
          })}
        </div>

        <div className="ce-result-item__upvotes">
          <div className="ce-result-item__upvotes-count">
            <span className="ce-tooltip">Upvote</span>
            <i
              className="fa fa-arrow-up ce-result-item__upvotes-icon"
              aria-hidden="true"
            ></i>
            {votes.format("0,0")}
          </div>
        </div>
        {/* <div className="ce-result-item__link">
        <a href={link}>{link}</a>
      </div> */}
      </article>
    </a>
  );
}
