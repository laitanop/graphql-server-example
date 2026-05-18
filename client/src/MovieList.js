import React, { useState } from "react";

import { Typography, Input, Space } from "antd";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import CardMovie from "./common/CardMovie";

const { Title, Text } = Typography;

const GET_MOVIES_LIST = gql`
  query GetMovies {
    movies {
      id
      name
      yearOfPublication
      isInTheaters
      image
      description
      director
      genre
      rating
      likes
    }
  }
`;
const GET_MOVIE = gql`
  query GetMovie($name: String!) {
    movie(name: $name) {
      id
      name
      yearOfPublication
      isInTheaters
      image
      description
      director
      genre
      rating
      likes
    }
  }
`;

const MovieList = () => {
  const [name, setName] = useState("");
  const { data } = useQuery(GET_MOVIES_LIST);
  const { data: movieData } = useQuery(GET_MOVIE, {
    variables: { name },
  });
  console.log(movieData?.movie?.image);

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, color: "#1a1f3c" }}>
          Movies
        </Title>

        <Text type="secondary">
          {data?.movies?.length} movie{data?.movies?.length !== 1 ? "s" : ""}{" "}
          found
        </Text>
      </div>

      <div style={{ marginBottom: 20 }}>
        <Space.Compact>
          <Input
            placeholder="Movie name to search"
            onChange={(e) => setName(e.target.value)}
          />
        </Space.Compact>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {movieData ? (
          <CardMovie key={movieData?.movie?.id} movie={movieData?.movie} />
        ) : (
          data?.movies?.map((movie) => (
            <CardMovie key={movie.name} movie={movie} />
          ))
        )}
      </div>
    </div>
  );
};
export default MovieList;
