import React, { Component } from "react";

export function ResultItem({ title, description, link, key }) {
  return (
    <article key={key} className="ce-result-item">
      <div className="ce-result-item__title">{title}</div>
      <div className="ce-result-item__description">{description}</div>
      <div className="ce-result-item__link">
        <a href={link}>{link}</a>
      </div>
    </article>
  );
}
