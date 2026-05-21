export async function fetchMovieInfo(title) {
  const apiKey = process.env.REACT_APP_OMDB_API_KEY;
  const url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`;

  const res = await fetch(url); // no method, no headers, no body
  if (!res.ok) throw new Error(`OMDb error: ${res.status}`);

  const data = await res.json();
  if (data.Response === "False") throw new Error(data.Error);

  return data;
}
