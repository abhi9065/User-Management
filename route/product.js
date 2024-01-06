const express = require("express");
const router = express.Router();
const User = require("../models/user")
const Movie = require("../models/movie")


const {
    GetAllProducts,
     GetAllProductsTesting } = 
    require("../controller/product")

router.route("/").get(GetAllProducts);
router.route("/Testing").get(GetAllProductsTesting)


async function signup(userDetails) {
    try {
      const user = new User(userDetails);
      const newUser = await user.save();
      return newUser
    } catch (error) {
      throw error;
    }
  }
  
  router.post('/signup', async (req, res) => {
    try {
      const savedUser = await signup(req.body);
      res.json(savedUser);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create user account' });
    }
  });
  


  async function login(email, password) {
    try {
      const user = await User.findOne({ email });
      if (user && user.password === password) {
        console.log("Logged in user:", user);
        return user;
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      throw error;
    }
  }
  
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await login(email, password);
      res.json(user);
    } catch (error) {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });


  async function changePassword(email, currentPassword, newPassword) {
    try {
      const user = await User.findOne({ email });
      if (user && user.password === currentPassword) {
        user.password = newPassword;
        const updatedUser = await user.save();
        return updatedUser;
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      throw error;
    }
  }
  
  router.post('/change-password', async (req, res) => {
    try {
      const { email, currentPassword, newPassword } = req.body;
      const updatedUser = await changePassword(email, currentPassword, newPassword);
      res.json(updatedUser);
    } catch (error) {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });



  async function updateProfilePicture(email, newProfilePictureUrl) {
    try {
      const user = await User.findOne({ email });
      if (user) {
        user.profilePictureUrl = newProfilePictureUrl;
        const updatedUser = await user.save();
        return updatedUser;
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      throw error;
    }
  }
  
  router.post('/update-profile-picture', async (req, res) => {
    try {
      const { email, newProfilePictureUrl } = req.body;
      const updatedUser = await updateProfilePicture(email, newProfilePictureUrl);
      res.json(updatedUser);
    } catch (error) {
      res.status(404).json({ error: 'User not found' });
    }
  });




  async function updateContactDetails(email, updatedContactDetails) {
    try {
      const user = await User.findOne({ email });
      if (user) {
        Object.assign(user, updatedContactDetails);
        const updatedUser = await user.save();
        return updatedUser;
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      throw error;
    }
  }
  
  router.post('/update-contact/:email', async (req, res) => {
    try {
      const email = req.params.email;
      console.log({ email })
      const updatedContactDetails = req.body;
      const updatedUser = await updateContactDetails(email, updatedContactDetails);
      res.json(updatedUser);
    } catch (error) {
      res.status(404).json({ error: 'User not found' });
    }
  });
  
  
  async function findUserByPhoneNumber(phoneNumber) {
    try {
      const userByPhoneNumber = await User.findOne({ phoneNumber });
      if (userByPhoneNumber) {
        return userByPhoneNumber;
      } else {
        throw new Error("User not found")
      }
    } catch (error) {
      throw error;
    }
  }
  
  router.get('/users/phone/:phoneNumber', async (req, res) => {
    try {
      const phoneNumber = req.params.phoneNumber;
      const user = await findUserByPhoneNumber(Number(phoneNumber));
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  });




  async function addRatingAndReview(movieId, userId, reviewText, rating) {
    try {
      const movie = await Movie.findById(movieId);
  
      const newReview = {
        user: userId,
        text: reviewText,
        rating: rating,
      };
  
     movie.reviews.push(newReview);
  
      const totalRating = movie.reviews.reduce((sum, review) => sum + review.ratings, 0);
      movie.averageRating = totalRating / movie.reviews.length;
  
      
      const movieWithReview = await movie.save();
  
      console.log("Added Review and Rating to Movie:", movieWithReview);
      return movieWithReview;
    } catch (error) {
      throw error;
    }
  }
  
  router.post('/movies/:movieId/rating', async (req, res) => {
    try {
      const movieId = req.params.movieId;
      const { userId, review, rating } = req.body;
  
      const updatedMovie = await addRatingAndReview(movieId, userId, review, rating);
      res.status(201).json({ message: 'Review added successfully', movie: updatedMovie });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to add review and rating' });
    }
  });
  


  async function getMovieReviewsWithUserDetails(movieId) {
    try {
      const movie = await Movie.findById(movieId).populate({
        path: 'reviews',
        populate: {
  
          path: 'user', select: 'username profilePictureUrl'
        },
      });
      const reviewsWithUserDetails = movie.reviews.slice(0, 3).map(review => ({
        reviewText: review.text,
        user: review.user,
      }));
      return reviewsWithUserDetails;
    } catch (error) {
      throw error;
    }
  }
  
  router.get('/movies/:movieId/reviews', async (req, res) => {
    try {
      const movieId = req.params.movieId;
      const reviewsWithUserDetails = await getMovieReviewsWithUserDetails(movieId);
      res.json(reviewsWithUserDetails);
    } catch (error) {
      res.status(404).json({ error: 'Movie not found' });
    }
  });



module.exports = router;