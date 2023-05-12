const baseUrl = "https://gamehub.olekristianfrontend.no/wp-json/wp/v2/posts";

async function getPosts(urlParameters = "") {
  const response = await fetch(`${baseUrl}?_embed&per_page=100${urlParameters}`);
  const results = await response.json();
  return results;
}

async function getSpecificPost(id) {
  const response = await fetch(`${baseUrl}/${id}?_embed`);
  const data = await response.json();
  return data;
}

async function postComment(commentData) {
  const response = await fetch("https://gamehub.olekristianfrontend.no/wp-json/wp/v2/comments?_embed&per_page=100", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commentData),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  
  const data = await response.json();
  return data;
}

export { getPosts, getSpecificPost, postComment };
