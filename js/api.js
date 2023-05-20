//define base URL for the API endpoints
const baseUrl = "https://gamehub.olekristianfrontend.no/wp-json/wp/v2";

//async function to fetch posts from the API.
async function getPosts(urlParameters = "") { //optional parameters can be passed to add to the URL
  //fetch data from the endpoint, waits untill the request completes
  const response = await fetch(`${baseUrl}/posts?_embed&per_page=12${urlParameters}`); //decided to use per_page12 for this project since we are only working with 12 posts.
  //parses the response data as JSON, waits until the data is parsed
  const results = await response.json();
  //returns parsed data
  return results;
}

//fetches specific post based on ID
async function getSpecificPost(id) {
  const response = await fetch(`${baseUrl}/posts/${id}?_embed`);
  const data = await response.json();
  return data;
}

//function to post comments to the API
async function postComment(commentData) {
  //sends a post request to the API endpoint for comments, waits untill request completes.
  const response = await fetch(`${baseUrl}/comments`, {
    method: "POST",
    headers: {  //header included to tell the server that it contains JSON, so the server knows how to parse it.
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commentData),
    credentials: "include",
  });
  //checks for response status
  if (!response.ok) {
    //if not, throws error
    throw new Error("Network response was not ok");
  }
  //if response, parses the response data as JSON and waits till the data is parsed
  const data = await response.json();
  //returns the parsed data
  return data;
}

//function for fetching the comments
async function getCommentSection(postId) {
  const response = await fetch(`${baseUrl}/comments?post=${postId}`);
  const data = await response.json();
  return data;
}

//exports the functions so they can be imported and used in other scripts
export { getPosts, getSpecificPost, postComment, getCommentSection };
