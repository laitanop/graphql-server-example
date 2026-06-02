import React from "react";

import { Card, Typography } from "antd";
import DeleteMovie from "../DeleteMovie";
import UpdateLikeMovie from "../UpdateLikeMovie";

const { Meta } = Card;
const { Text } = Typography;

const CardMovie = ({ movie }) => {
  return (
    <Card
      style={{ width: 400, marginBottom: 20 }}
      cover={
        <img
          draggable={false}
          alt={movie.name.toUpperCase() + " IMAGE"}
          src={movie.image}
          height={400}
          width={300}
          style={{ objectFit: "cover" }}
        />
      }
      actions={[
        <span key="like" style={{ cursor: "pointer", color: "blue" }}>
          <UpdateLikeMovie id={movie.id} likes={movie.likes} />
        </span>,
        <span key="delete" style={{ cursor: "pointer", color: "red" }}>
          <DeleteMovie id={movie.id} />
        </span>,
      ]}
    >
      <Meta
        style={{ height: 300 }}
        title={movie.name.toUpperCase()}
        description={
          <div>
            <div style={{ display: "flex", gap: 10 }}>
              <Text strong>Year of Publication:</Text>
              <Text mark>{movie.year_of_publication}</Text>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Text strong>Director:</Text>
              <Text mark>{movie.director}</Text>
            </div>

            <br />
            <div style={{ display: "flex", gap: 10 }}>
              <Text strong>Genre:</Text>
              <Text mark>{movie.genre.join(", ")}</Text>
            </div>
            <br />
            <div style={{ display: "flex", gap: 10 }}>
              <Text strong>Rating:</Text>
              <Text type={Number(movie.rating) >= 8 ? "success" : "warning"}>
                {Number(movie.rating).toFixed(1)}
              </Text>
            </div>
            <br />
            <Text> {movie.description}</Text>
          </div>
        }
      />
    </Card>
  );
};
export default CardMovie;
