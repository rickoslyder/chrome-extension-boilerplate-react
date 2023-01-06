import React from "react";
import { makeStyles } from "@mui/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Accordion, AccordionActions, Button, AccordionSummary, AccordionDetails, Typography, List, Avatar, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";

import ListingCard from "./ListingCard";

import formatDate from "../utils/formatDate";
import isDateString from "../utils/isDateString";
import { Listing } from '../../../../lib/database.types';
import { useSnackbar } from "notistack";
import { supabase } from "../../../supabaseClient";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

const handleAvailable = (datestring: string | null) => {
  if (datestring == null || datestring === 'null') {
    return (<i>No date provided - contact agent</i>)
  }
  else if (isDateString(datestring)) {
    return formatDate(datestring)
  }
  else {
    return datestring
  }
}

const ListingsList = ({ listings }: { listings: Listing[] }) => {
  const classes = useStyles();
  const isMobile = useMediaQuery("(max-width:585px)")
  const isMini = useMediaQuery("(max-width:375px)")

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const handleClickDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteContinue = (id: number) => {
    setDeleteDialogOpen(false);
    deleteSingleListing(id)
  };

  const { enqueueSnackbar } = useSnackbar();

  const handleClickPlaceholder = () => {
    enqueueSnackbar('Coming soon!', { variant: 'info' })
  }

  const deleteSingleListing = async (id: number) => {
    try {
      await supabase.from('listings').delete().eq('listing_id', id)

      enqueueSnackbar('Listing deleted!', { variant: 'success' })
      window.location.reload()
    } catch (error) {
      console.error(error);
      enqueueSnackbar(`Error deleting listing - ${error}`, { variant: 'error' })
    }
  }

  const deleteMultipleListings = async (ids: number[]) => {
    try {
      await supabase.from('listings').delete().in('listing_id', ids)
      enqueueSnackbar('Listing deleted!', { variant: 'success' })
    } catch (error) {
      console.error(error);
      enqueueSnackbar(`Error deleting listing - ${error}`, { variant: 'error' })
    }
  }

  const widthRenderer = (normal: string, mobile: string, mini?: string) => {
    if (mini && isMini) {
      return mini
    } else if (mobile && isMobile) {
      return mobile
    } else {
      return normal
    }
  }

  const componentRenderer = (normal: boolean, mobile: boolean, mini?: boolean) => {
    if (isMini) {
      return mini
    } else if (isMobile) {
      return mobile
    } else {
      return normal
    }
  }

  // if (isMobile) {
  //   return <h1>test</h1>
  // }

  return (
    <div className={classes.root}>
      <List>
        {listings.map((listing) => (
          <>
            <Dialog
              open={deleteDialogOpen}
              onClose={handleDeleteCancel}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {listing.property_address}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this listing? This action cannot be undone and will permanently remove this listing from your account.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDeleteCancel}>Cancel</Button>
                <Button onClick={() => handleDeleteContinue(listing.listing_id as number)} autoFocus>
                  Continue
                </Button>
              </DialogActions>
            </Dialog>
            <Accordion key={listing.listing_id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                {/* show avatar if screen isn't mini */}

                <Avatar
                  src={listing?.property_images ? listing.property_images[0] : ''}
                  variant="rounded"
                  sx={{ mr: 2, width: "10%" }}
                />

                {/* first column - Address if normal, Address + Details if mobile*/}
                <Typography sx={{ width: widthRenderer("20%", "42.5%", "50%"), flexShrink: 0, px: 1 }}>
                  <b>{listing.property_address}</b>
                  {isMobile && <><br /><br />{listing.details}</>}
                </Typography>

                {/* second column - Details if normal, hidden if mobile*/}
                {!isMobile && <Typography sx={{ width: widthRenderer("27.5%", "30%", "50%"), flexShrink: 0, px: 1 }}>
                  {listing.details}
                </Typography>}

                {/* third column - Cost if normal, Cost + Available if mobile*/}
                <Typography sx={{ width: widthRenderer("15%", "42.5%", "45%"), flexShrink: 0, color: "text.secondary", px: 1 }}>
                  <b>Cost:</b>{" "}<br />{listing.cost}
                  {isMobile && <><br /><br /><b>Available: </b>{handleAvailable(listing.available)}</>}
                </Typography>

                {/* fourth column - Available if normal, hidden if mobile*/}
                {!isMobile && (<Typography sx={{ width: "27.5%", flexShrink: 0, color: "text.secondary", px: 1 }}>
                  <b>Available:</b><br />
                  {handleAvailable(listing.available)}
                </Typography>)}
              </AccordionSummary>
              <AccordionDetails>
                <AccordionActions>
                  <Button onClick={handleClickPlaceholder}>Book Viewing</Button>
                  <Button onClick={handleClickPlaceholder}>Share Listing</Button>
                  <Button onClick={handleClickDelete}>Delete Listing</Button>
                </AccordionActions>
                <ListingCard listing={listing} />
              </AccordionDetails>
            </Accordion></>
        ))}
      </List>
    </div>
  );
};

export default ListingsList;
