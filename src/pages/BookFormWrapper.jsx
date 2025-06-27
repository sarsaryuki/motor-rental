import React from "react";
import { useLocation, useParams } from "react-router-dom";
import BookForm from "./BookForm";

export default function BookFormWrapper() {
  const { id } = useParams();
  const location = useLocation();
  const bike = location.state?.bike;

  if (!bike) {
    return <p className="text-center mt-10 text-red-600">No bike data found. Please go back and select a bike again.</p>;
  }

  return <BookForm bike={bike} />;
}
