import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase/firebase-config';
import { getFirestore, doc, getDoc, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import './my-page.css';

const db = getFirestore();

function MyPage() {
  const [user, setUser] = useState(null);
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [userPic, setUserPic] = useState('');
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserProfile(currentUser.uid);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const fetchUserProfile = async (userId) => {
    const userDoc = doc(db, 'users', userId);
    const userSnapshot = await getDoc(userDoc);
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      setNickname(userData.name);
      setBio(userData.bio);
      setUserPic(userData.userPic || '');
    }
  };

  const fetchUserPic = async (userId) => {
    const userDoc = doc(db, 'users', userId);
    const userSnapshot = await getDoc(userDoc);
    if (userSnapshot.exists()) {
      return userSnapshot.data().userPic || '';
    }
    return '';
  };

  useEffect(() => {
    const postsQuery = query(
      collection(db, 'posts'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(postsQuery, async (snapshot) => {
      const postsData = await Promise.all(snapshot.docs.map(async (doc) => {
        const postData = doc.data();
        const userPic = await fetchUserPic(postData.userId);
        return { id: doc.id, ...postData, userPic };
      }));
      setPosts(postsData);
    });

    return () => unsubscribe();
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (newPost.trim() === '') return;

    await addDoc(collection(db, 'posts'), {
      username: nickname,
      content: newPost,
      timestamp: serverTimestamp(),
      userId: user?.uid,
      userPic: userPic, // Add userPic to the post
    });

    setNewPost('');
  };

  return (
    <div className="page-layout">
      <div className="my-page-container">
        <ProfileCard userPic={userPic} nickname={nickname} bio={bio} />
      </div>
      <div className="content-container">
        {user && <PostForm newPost={newPost} setNewPost={setNewPost} handlePostSubmit={handlePostSubmit} />}
        <PostsList posts={posts} />
      </div>
    </div>
  );
}

const ProfileCard = ({ userPic, nickname, bio }) => (
  <div className="profile-card">
    <div className="profile-pic">
      <img src={userPic} alt="User Avatar" className="avatar-image" />
    </div>
    <div className="profile-info">
      <h2>{nickname}</h2>
      <p>{bio}</p>
    </div>
  </div>
);

const PostForm = ({ newPost, setNewPost, handlePostSubmit }) => {
  const handleInputChange = (e) => {
    setNewPost(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <form className="post-form" onSubmit={handlePostSubmit}>
      <textarea
        value={newPost}
        onChange={handleInputChange}
        placeholder="Write something..."
        className="post-input"
        style={{ overflow: 'hidden', resize: 'none' }} // Disable resizing
      ></textarea>
      <button type="submit" className="post-button">Post</button>
    </form>
  );
};

const PostsList = ({ posts }) => (
  <div className="posts-list">
    {posts.length > 0 ? (
      posts.slice(0, 10).map(post => ( // Show only the latest 10 posts
        <div key={post.id} className="post">
          <div className="post-image-container">
            {post.imageUrl && <img src={post.imageUrl} alt="Post" className="post-image" />}
          </div>
          <div className="post-content">
            <div className="post-header">
              <img src={post.userPic} alt="User Avatar" className="post-avatar" /> {/* Display userPic */}
              <p><strong>{post.username}</strong></p>
            </div>
            <p className='post-description'>{post.content}</p>
          </div>
        </div>
      ))
    ) : (
      <p>No posts available.</p>
    )}
  </div>
);

export default MyPage;
