import React, { Component } from "react";
Number.prototype.format = function (n, x) {
  var re = "\\d(?=(\\d{" + (x || 3) + "})+" + (n > 0 ? "\\." : "$") + ")";
  return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, "g"), "$&,");
};
export function ResultItem({ id, title, description, link, upvotes }) {
  return (
    <a href={link} target="_blank">
      <article id={id} className="ce-result-item">
        <div className="ce-result-item__title">{title}</div>
        <div className="ce-result-item__description">{description}</div>
        <div className="ce-result-item__upvotes">
          <div className="ce-result-item__upvotes-count">
            <span className="ce-tooltip">Upvote</span>
            <i
              className="fa fa-arrow-up ce-result-item__upvotes-icon"
              aria-hidden="true"
            ></i>
            {(upvotes || 0).format()}
          </div>
        </div>
        {/* <div className="ce-result-item__link">
        <a href={link}>{link}</a>
      </div> */}
      </article>
    </a>
  );
}
