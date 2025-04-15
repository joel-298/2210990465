const express = require("express") ; 
const app = express() ;
const cors = require("cors") ; 
const axios = require("axios") ;  

app.use(cors()) ; 
app.use(express.urlencoded({extended:false})) ; 
app.use(express.json()) ; 



// Base URL of the social media server
const baseUrl = 'http://20.244.56.144/evaluation-service';


// FETCH USERS
const fetchUsers = async () => {
  try {
    const response = await axios.get(`${baseUrl}/users` , 
      { timeout: 500,
        headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ0NzAzNzY4LCJpYXQiOjE3NDQ3MDM0NjgsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjkzYjAyM2I5LTczYTEtNDFlZS1iYzg0LTI2MjkyOTg0MmUyOSIsInN1YiI6ImpvZWw0NjUuYmUyMkBjaGl0a2FyYS5lZHUuaW4ifSwiZW1haWwiOiJqb2VsNDY1LmJlMjJAY2hpdGthcmEuZWR1LmluIiwibmFtZSI6ImpvZWwgbWF0dGhldyIsInJvbGxObyI6IjIyMTA5OTA0NjUiLCJhY2Nlc3NDb2RlIjoiUHd6dWZHIiwiY2xpZW50SUQiOiI5M2IwMjNiOS03M2ExLTQxZWUtYmM4NC0yNjI5Mjk4NDJlMjkiLCJjbGllbnRTZWNyZXQiOiJyWlNlcnBoRldrVmRScGFhIn0.mfy9z8wzAmtmiMFd4QEmikzT3BavpBYAp3k9AYuD01E` }
      });
    return response.data.users;
  } catch (error) {
    console.error('Error fetching users:', error.message);
    return null;
  }
};

// Fetch POSTS
const fetchPosts = async (userId) => {
  try {
    const response = await axios.get(`${baseUrl}/users/${userId}/posts`, 
      { timeout: 500,
        headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ0NzAzNzY4LCJpYXQiOjE3NDQ3MDM0NjgsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjkzYjAyM2I5LTczYTEtNDFlZS1iYzg0LTI2MjkyOTg0MmUyOSIsInN1YiI6ImpvZWw0NjUuYmUyMkBjaGl0a2FyYS5lZHUuaW4ifSwiZW1haWwiOiJqb2VsNDY1LmJlMjJAY2hpdGthcmEuZWR1LmluIiwibmFtZSI6ImpvZWwgbWF0dGhldyIsInJvbGxObyI6IjIyMTA5OTA0NjUiLCJhY2Nlc3NDb2RlIjoiUHd6dWZHIiwiY2xpZW50SUQiOiI5M2IwMjNiOS03M2ExLTQxZWUtYmM4NC0yNjI5Mjk4NDJlMjkiLCJjbGllbnRTZWNyZXQiOiJyWlNlcnBoRldrVmRScGFhIn0.mfy9z8wzAmtmiMFd4QEmikzT3BavpBYAp3k9AYuD01E` }
      }
    );
    return response.data.posts;
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error.message);
    return [];
  }
};

// Fetch COMMENTS
const fetchComments = async (postId) => {
  try {
    const response = await axios.get(`${baseUrl}/posts/${postId}/comments`,
      { timeout: 500,
        headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ0NzAzNzY4LCJpYXQiOjE3NDQ3MDM0NjgsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjkzYjAyM2I5LTczYTEtNDFlZS1iYzg0LTI2MjkyOTg0MmUyOSIsInN1YiI6ImpvZWw0NjUuYmUyMkBjaGl0a2FyYS5lZHUuaW4ifSwiZW1haWwiOiJqb2VsNDY1LmJlMjJAY2hpdGthcmEuZWR1LmluIiwibmFtZSI6ImpvZWwgbWF0dGhldyIsInJvbGxObyI6IjIyMTA5OTA0NjUiLCJhY2Nlc3NDb2RlIjoiUHd6dWZHIiwiY2xpZW50SUQiOiI5M2IwMjNiOS03M2ExLTQxZWUtYmM4NC0yNjI5Mjk4NDJlMjkiLCJjbGllbnRTZWNyZXQiOiJyWlNlcnBoRldrVmRScGFhIn0.mfy9z8wzAmtmiMFd4QEmikzT3BavpBYAp3k9AYuD01E` }
      }
    );
    return response.data.comments;
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error.message);
    return [];
  }
};

// API: Get Top Users based on comment count
app.get('/users', async (req, res) => {
  try {
    const users = await fetchUsers();
    if (!users) {
      return res.status(500).json({ error: 'Failed to fetch users' });
    }

    // Fetch posts for each user and count comments
    const userComments = [];
    for (let userId in users) {
      const posts = await fetchPosts(userId);
      let commentCount = 0;

      for (let post of posts) {
        const comments = await fetchComments(post.id);
        commentCount += comments.length;
      }

      userComments.push({ user: users[userId], commentCount });
    }

    // Sort users by comment count and get top 5
    userComments.sort((a, b) => b.commentCount - a.commentCount);
    const topUsers = userComments.slice(0, 5);

    res.json(topUsers);
  } catch (error) {
    console.error('Error fetching top users:', error.message);
    res.status(500).json({ error: 'Failed to fetch top users' });
  }
});

// API: Get Posts (Latest or Popular)
app.get('/posts', async (req, res) => {
  const type = req.query.type;

  try {
    if (type === 'popular') {
      // Fetch posts from all users
      const postsData = [];
      const users = await fetchUsers();

      for (let userId in users) {
        const posts = await fetchPosts(userId);
        for (let post of posts) {
          const comments = await fetchComments(post.id);
          postsData.push({ post, commentsCount: comments.length });
        }
      }

      // Sort posts by commentsCount
      postsData.sort((a, b) => b.commentsCount - a.commentsCount);

      // Return the post(s) with the most comments
      const maxComments = postsData[0]?.commentsCount || 0;
      const mostCommentedPosts = postsData.filter(post => post.commentsCount === maxComments);

      res.json(mostCommentedPosts.map(post => post.post));
    } else if (type === 'latest') {
      // Fetch the latest 5 posts in real-time
      const postsData = [];
      const users = await fetchUsers();

      for (let userId in users) {
        const posts = await fetchPosts(userId);
        for (let post of posts) {
          postsData.push(post);
        }
      }

      // Sort posts by their ID (assuming the higher the ID, the more recent the post)
      postsData.sort((a, b) => b.id - a.id);

      // Return the latest 5 posts
      res.json(postsData.slice(0, 5));
    } else {
      res.status(400).json({ error: 'Invalid type parameter. Use "popular" or "latest".' });
    }
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});
  

const PORT = 9876 ; 
app.listen(PORT,(err)=>{
    if(err) console.log(err) ; 
    else {
        console.log(`Server running on Port : ${PORT}`) ; 
    }
});




// {
//     "token_type": "Bearer",
//     "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ0NzAxNDg2LCJpYXQiOjE3NDQ3MDExODYsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjkzYjAyM2I5LTczYTEtNDFlZS1iYzg0LTI2MjkyOTg0MmUyOSIsInN1YiI6ImpvZWw0NjUuYmUyMkBjaGl0a2FyYS5lZHUuaW4ifSwiZW1haWwiOiJqb2VsNDY1LmJlMjJAY2hpdGthcmEuZWR1LmluIiwibmFtZSI6ImpvZWwgbWF0dGhldyIsInJvbGxObyI6IjIyMTA5OTA0NjUiLCJhY2Nlc3NDb2RlIjoiUHd6dWZHIiwiY2xpZW50SUQiOiI5M2IwMjNiOS03M2ExLTQxZWUtYmM4NC0yNjI5Mjk4NDJlMjkiLCJjbGllbnRTZWNyZXQiOiJyWlNlcnBoRldrVmRScGFhIn0.EYbmniNDUcv_pVx_o4CWheDOOn26S6jrYREv3UgwMX0",
//     "expires_in": 1744700344
// }