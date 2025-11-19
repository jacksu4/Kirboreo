import { groq } from "next-sanity";

export const POSTS_QUERY = groq`*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  "mainImage": mainImage.asset->url,
  "categories": categories[]->title,
  body,
  summary
}`;

export const HOME_LATEST_POSTS_QUERY = groq`*[_type == "post"] | order(publishedAt desc)[0...3] {
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  "categories": categories[]->title,
  summary
}`;

export const STOCKS_LIST_QUERY = groq`*[_type == "stockAnalysis"] | order(ticker asc) {
  ticker,
  companyName,
  kirboreoScore,
  scoreLabel
}`;

export const STOCK_DETAIL_QUERY = groq`*[_type == "stockAnalysis" && ticker == $ticker][0] {
  ticker,
  companyName,
  kirboreoScore,
  scoreLabel,
  metrics
}`;

export const POSTS_BY_CATEGORY_QUERY = groq`*[_type == "post" && count((categories[]->title)[@ in [$ticker, $companyName]]) > 0] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  "categories": categories[]->title,
  summary
}`;
