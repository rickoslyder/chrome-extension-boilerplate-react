import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    position: "absolute",
    width: "80%",
    height: "80%",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: "none",
  },
  galleryContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: "100%",
    overflowX: "scroll",
  },
  image: {
    width: "50%",
    height: "auto",
    margin: "0 1%",
  },
}));

const ImageGallery = (props: { images: string[] }) => {
  const classes = useStyles();
  const { images } = props;
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button onClick={handleOpen}>Open Image Gallery</Button>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
        className={classes.modal}
      >
        <div className={classes.paper}>
          <div className={classes.galleryContainer}>
            {images.map((image: string, index: number) => (
              <img
                src={image}
                key={index}
                alt={image}
                className={classes.image}
              />
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ImageGallery;
