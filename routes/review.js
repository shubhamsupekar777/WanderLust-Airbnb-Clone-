
const express = require("express");
const router = express.Router({ mergeParams: true });
const {validateReview, isLoggedIn, isReviewAuthor}= require("../middleware.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const wrapAsync =require("../utils/wrapAsync.js")
const reviewController=require("../controllers/reviews.js");
//Reviews 
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview) );
//Delete Reviews Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));
module.exports = router;
