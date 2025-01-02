export default function handleRating(value: number) {
  const fullStar = "★";
  const halfStar = "⯪";
  const emptyStar = "☆";

  const rating = Number(value);

  if (isNaN(rating) || rating < 0 || rating > 5) {
    return "";
  }

  const floorValue = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  let starRating = '';


  if (hasHalfStar) {
    starRating = fullStar.repeat(floorValue) + halfStar + emptyStar.repeat(5 - floorValue - 1);
  } else {
    starRating = fullStar.repeat(floorValue) + emptyStar.repeat(5 - floorValue);
  }

  return starRating;
}