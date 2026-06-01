import React from "react";
import { Button } from "antd";
import { LikeOutlined, LikeFilled } from "@ant-design/icons";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

const UPDATE_LIKE_MOVIE = gql`
  mutation UpdateLikeMovie($id: BigInt!, $likes: Int!) {
    updatemoviesCollection(
      filter: { id: { eq: $id } }
      set: { likes: $likes }
    ) {
      records {
        id
        likes
      }
    }
  }
`;

const UpdateLikeMovie = ({ id, likes }) => {
  const [updateLikeMovie, { loading }] = useMutation(UPDATE_LIKE_MOVIE, {
    refetchQueries: ["GetMovies"],
  });
  console.log("loading", loading);
  const handleUpdateLikeMovie = () => {
    console.log("update like movie");
    updateLikeMovie({ variables: { id, likes: likes + 1 } });
  };
  return (
    <>
      <Button
        color="primary"
        variant="text"
        onClick={() => handleUpdateLikeMovie()}
      >
        {loading ? (
          <LikeFilled style={{ fontSize: "18px" }} />
        ) : (
          <LikeOutlined />
        )}
        {likes}
      </Button>
    </>
  );
};
export default UpdateLikeMovie;
