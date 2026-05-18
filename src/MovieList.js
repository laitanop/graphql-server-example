import React, { useState } from "react";

import { Typography, Input, Space } from "antd";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import CardMovie from "./common/CardMovie";

const { Title, Text } = Typography;

const GET_MOVIES_LIST = gql`
  query GetMovies {
    moviesCollection {
      edges {
        node {
          id
          name
          year_of_publication
          is_in_theaters
          image
          description
          director
          genre
          rating
          likes
        }
      }
    }
  }
`;
const GET_MOVIE = gql`
  query GetMovie($name: String!) {
    moviesCollection(filter: { name: { eq: $name } }, first: 1) {
      edges {
        node {
          id
          name
          year_of_publication
          is_in_theaters
          image
          description
          director
          genre
          rating
          likes
        }
      }
    }
  }
`;

const MovieList = () => {
  const [name, setName] = useState("");
  const { data } = useQuery(GET_MOVIES_LIST);
  const { data: movieData } = useQuery(GET_MOVIE, {
    variables: { name },
    skip: !name,
  });

  const movies = data?.moviesCollection?.edges?.map((e) => e.node) ?? [];
  const searchedMovie = movieData?.moviesCollection?.edges?.[0]?.node ?? null;

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, color: "#1a1f3c" }}>
          Movies
        </Title>

        <Text type="secondary">
          {movies.length} movie{movies.length !== 1 ? "s" : ""} found
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
        {searchedMovie ? (
          <CardMovie key={searchedMovie.id} movie={searchedMovie} />
        ) : (
          movies.map((movie) => <CardMovie key={movie.id} movie={movie} />)
        )}
      </div>
    </div>
  );
};
export default MovieList;
