const baseUrl = "https://gamehub.olekristianfrontend.no/wp-json/wp/v2";

async function getPosts(urlParameters = "") {
  const response = await fetch(`${baseUrl}/posts?_embed&per_page=100${urlParameters}`);
  const results = await response.json();
  return results;
}

async function getSpecificPost(id) {
  const response = await fetch(`${baseUrl}/posts/${id}?_embed`);
  const data = await response.json();
  return data;
}

async function postComment(commentData) {
  const response = await fetch(`${baseUrl}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commentData),
    credentials: "include", 
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  
  const data = await response.json();
  return data;
}

async function getCommentSection(postId) {
  const response = await fetch(`${baseUrl}/comments?post=${postId}`);
  const data = await response.json();
  return data;
}

export { getPosts, getSpecificPost, postComment, getCommentSection };

