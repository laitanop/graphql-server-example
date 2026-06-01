import React from "react";
import { Popconfirm, Tooltip, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

const DELETE_MOVIE = gql`
  mutation DeleteMovie($id: BigInt!) {
    deleteFrommoviesCollection(filter: { id: { eq: $id } }) {
      records {
        id
        name
      }
    }
  }
`;

const DeleteMovie = ({ id }) => {
  const [deleteMovie] = useMutation(DELETE_MOVIE, {
    refetchQueries: ["GetMovies"],
  });

  const confirm = (e) => {
    deleteMovie({ variables: { id } });
  };

  const cancel = (e) => {
    console.log(e);
  };
  return (
    <>
      <Popconfirm
        title="Delete the task"
        description="Are you sure to delete this Movie?"
        onConfirm={confirm}
        onCancel={cancel}
        okText="Yes"
        cancelText="No"
      >
        <Tooltip title="Delete movie">
          <Button color="danger" variant="text">
            <DeleteOutlined />
          </Button>
        </Tooltip>
      </Popconfirm>
    </>
  );
};
export default DeleteMovie;
