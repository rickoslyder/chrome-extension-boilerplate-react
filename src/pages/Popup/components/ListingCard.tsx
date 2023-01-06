/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import ImageGallery from "./ImageGallery";
import makeStyles from "@mui/styles/makeStyles";
import { Card, CardMedia, CardContent, IconButton, Grid, CardActions, Typography, Divider, Button, TextField } from "@mui/material";
import HTMLReactParser from "html-react-parser";
import formatDate from "../utils/formatDate";
import isDateString from "../utils/isDateString";
import { Listing, ListingUpdate } from '../../../../lib/database.types';
import { supabase } from "../../../supabaseClient";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { Add } from '@mui/icons-material';
import { useSnackbar } from "notistack";
import { UserResponse } from "@supabase/supabase-js";

const useStyles = makeStyles({
  root: {
    minWidth: 200,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  pros_cons_root: {
    flexGrow: 1,
  },
  pros_cons_columns: {
    marginBottom: '16px',
  },
  pros_cons_columnTitle: {
    marginBottom: '8px',
  },
  pros_cons_addButton: {
    marginTop: '8px',
  },
});

const ListingCard = (props: { listing: Listing, userId?: number, }) => {
  const classes = useStyles();
  const {
    listing: {
      property_address,
      details,
      cost,
      deposit,
      description,
      furnished,
      agency_name,
      agency_address,
      agency_number,
      property_url,
      size,
      available,
      floorplan,
      epc,
      property_images,
      listing_id,
      // positives,
      // concerns,
      // notes
    },
  } = props;
  const [floorplanOpen, setFloorplanOpen] = useState(false);
  const [epcOpen, setEpcOpen] = useState(false);
  const [descriptionOpen, setDescriptionOpen] = useState(false);

  const [displayedListing, setDisplayedListing] = useState<ListingUpdate>(props.listing)

  const [currentUserUuid, setCurrentUserUuid] = useState("");
  const [currentUserId, setCurrentUserId] = useState(0);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const getUserIds = async () => {
      let userUuidObj: UserResponse = await supabase.auth.getUser();
      if (userUuidObj) {
        try {
          let userUuid: string = userUuidObj.data.user!.id;
          setCurrentUserUuid(userUuid);
          let userIdObj = await supabase
            .from("users")
            .select("user_id")
            .eq("user_uuid", currentUserUuid);
          console.log("userIdObj", userIdObj);
          if (userIdObj.data) {
            let userId: number = userIdObj.data[0].user_id
            setCurrentUserId(userId);
          }

        } catch (e) {
          console.error('Error finding user IDs -', e)
        }
      }
    }
    getUserIds();
  }, [currentUserUuid]);

  // const [pros, setPros] = useState<Array<string>>([]);
  // const [cons, setCons] = useState<Array<string>>([]);
  // const [generalNotes, setGeneralNotes] = useState<string | null>(notes as string);

  // setPros(positives as string[])
  // setCons(concerns as string[])

  // const addPro = () => {
  //   // setEditedPros([...editedPros, '']);
  //   console.log('editedPros', - editedPros)
  //   console.log('pros', - pros)
  // };

  // const addCon = () => {
  //   // setEditedCons([...editedCons, '']);
  //   console.log('editedCons', - editedCons)
  //   console.log('cons', - cons)
  // };

  // const handleProChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
  //   const newPros = [...editedPros];
  //   newPros[index] = e.target.value;
  //   setEditedPros(newPros);
  // };

  // const handleConChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, index: number) => {
  //   const newCons = [...editedCons];
  //   newCons[index] = e.target.value;
  //   setEditedCons(newCons);
  // };

  const [editing, setEditing] = useState(false)
  const [editedAddress, setEditedAddress] = useState(property_address)
  const [editedDetails, setEditedDetails] = useState(details)
  const [editedCost, setEditedCost] = useState(cost)
  const [editedDeposit, setEditedDeposit] = useState(deposit)
  const [editedDescription, setEditedDescription] = useState(description)
  const [editedFurnished, setEditedFurnished] = useState(furnished)
  const [editedAgencyName, setEditedAgencyName] = useState(agency_name)
  const [editedAgencyAddress, setEditedAgencyAddress] = useState(agency_address)
  const [editedAgencyNumber, setEditedAgencyNumber] = useState(agency_number)
  const [editedPropertyUrl, setEditedPropertyUrl] = useState(property_url)
  const [editedSize, setEditedSize] = useState(size)
  const [editedAvailable, setEditedAvailable] = useState(available)
  const [editedFloorplan, setEditedFloorplan] = useState(floorplan)
  const [editedEpc, setEditedEpc] = useState(epc)
  // const [editedPros, setEditedPros] = useState<string[]>(positives)
  // const [editedCons, setEditedCons] = useState<string[]>(concerns)
  // const [editedNotes, setEditedNotes] = useState(generalNotes)


  const editedListing: ListingUpdate = {
    listing_id,
    property_address: editedAddress as string,
    details: editedDetails,
    cost: editedCost,
    deposit: editedDeposit,
    description: editedDescription,
    furnished: editedFurnished,
    agency_name: editedAgencyName,
    agency_address: editedAgencyAddress,
    agency_number: editedAgencyNumber,
    property_url: editedPropertyUrl,
    size: editedSize,
    available: editedAvailable,
    floorplan: editedFloorplan,
    epc: editedEpc,
    property_images,
    // positives: editedPros,
    // concerns: editedCons,
    // notes: editedNotes
  }


  const handleEditListing = () => {
    setEditing(!editing)
  }

  const handleSaveListing = async () => {
    // Update the listing data using the new state variables
    if (editedListing !== props.listing) {
      try {
        editedListing.user_id = currentUserId as number
        // @ts-ignore
        const { data } = await supabase.from("listings").upsert(editedListing).select();

        if (data) {
          setDisplayedListing(editedListing)
          enqueueSnackbar('Listing details updated!', { variant: 'success' })
        }
      } catch (error) {
        console.error(error);
        enqueueSnackbar(`Error updating listing details - ${error}`, { variant: 'error' })
      }
    };
    // Toggle isEditing back to false
    setEditing(!editing)
  }

  const handleNa = (prop: string) => {
    if (prop) {
      return prop.startsWith("http") ? (
        <>
          <br />
          <a href={prop} target="_blank" rel="noreferrer">
            <img src={prop} alt={prop} height="350px" />
          </a>
          <i><h5>Click the image for full-screen view</h5></i>
        </>
      ) : (
        prop
      );
    }
  };

  const handleAvailable = (datestring: string | null) => {
    console.log('formatting datestring for listing card -', datestring)
    console.log('type -', typeof datestring)
    if (datestring == null || datestring === 'null') {
      return (<i>No date provided - contact agent</i>)
    }
    else if (isDateString(datestring)) {
      return formatDate(datestring)
    }
    else {
      console.log('handled datestring -', datestring)
      return datestring
    }
  }

  const renderDeposit = () => displayedListing.deposit ? displayedListing.deposit : <i>No deposit provided - Contact agent for more details</i>

  const renderPropertyUrl = () => displayedListing.property_url ? (
    <a href={displayedListing.property_url} target="_blank" rel="noreferrer">
      Click here
    </a>
  ) : (
    "n/a"
  )

  const renderSize = () => displayedListing.size ? displayedListing.size : "n/a"

  const renderDescription = () => {
    return (
      <>
        {descriptionOpen &&
          (displayedListing.description ? (
            HTMLReactParser(displayedListing.description)
          ) : (
            <i>No description provided - check listing or contact agent</i>
          ))}
        {descriptionOpen && (
          <>
            <br /> <br />
          </>
        )}
      </>
    );
  }

  return (
    <Card className={classes.root}>
      <CardContent>
        {displayedListing.property_images && (
          <>
            <CardMedia
              sx={{ height: 250 }}
              image={displayedListing.property_images[0]}
              title={displayedListing.property_address}
            />
            <ImageGallery images={displayedListing.property_images} />
          </>
        )}
        <br />
        <br />
        <Typography variant="h5" component="h2" gutterBottom>
          {editing ? <TextField fullWidth={true} value={editedAddress} onChange={(e) => setEditedAddress(e.target.value)} /> : displayedListing.property_address}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {editing ? <TextField fullWidth={true} value={editedDetails} onChange={(e) => setEditedDetails(e.target.value)} /> : displayedListing.details}
        </Typography>
        <Divider />
        <CardActions>
          {editing && <Button size="small" onClick={handleEditListing}>Cancel</Button>}
          {editing ? <Button size="small" onClick={handleSaveListing}>Save Listing</Button> :
            <Button size="small" onClick={handleEditListing}>Edit Listing</Button>
          }
        </CardActions>
        <Typography variant="h6" component="h3">
          <b>Cost:</b> {editing ? <TextField sx={{ width: 300, mb: 1 }} size="small" value={editedCost} onChange={(e) => setEditedCost(e.target.value)} /> : displayedListing.cost}
        </Typography>
        <Typography variant="h6" component="h3">
          <b>Deposit:</b>{" "}
          {editing ? <TextField sx={{ width: 300, mb: 1 }} size="small" value={editedDeposit as string} onChange={(e) => setEditedDeposit(e.target.value)} /> : renderDeposit()}
        </Typography>
        <Typography variant="h6" component="h3">
          <b>Furnished:</b> {editing ? <TextField sx={{ width: 300, mb: 1 }} size="small" value={editedFurnished} onChange={(e) => setEditedFurnished(e.target.value)} /> : displayedListing.furnished}
        </Typography>
        <Typography variant="h6" component="h3">
          <b>Agency:</b>{" "}
          <ul>
            <li>
              <b>Name:</b> {editing ? <TextField sx={{ width: 400 }} size="small" value={editedAgencyName} onChange={(e) => setEditedAgencyName(e.target.value)} /> : displayedListing.agency_name}
            </li>
            <li>
              <b>Phone:</b> {editing ? <TextField sx={{ width: 400 }} size="small" value={editedAgencyNumber as string | number} onChange={(e) => setEditedAgencyNumber(e.target.value)} /> : displayedListing.agency_number}
            </li>
            <li>
              <b>Address:</b> {editing ? <TextField sx={{ width: 400, mb: 3 }} size="small" value={editedAgencyAddress as string} onChange={(e) => setEditedAgencyAddress(e.target.value)} /> : displayedListing.agency_address}
            </li>
          </ul>
        </Typography>
        <Typography variant="h6" component="h3">
          <b>Property URL:</b>{" "}
          {editing ? <TextField sx={{ width: 450, mb: 1 }} size="small" value={editedPropertyUrl as string} onChange={(e) => setEditedPropertyUrl(e.target.value)} /> : renderPropertyUrl()}
        </Typography>
        <Typography variant="h6" component="h3">
          <b>Size:</b> {editing ? <TextField sx={{ width: 300, mb: 1 }} size="small" value={editedSize as string | number} onChange={(e) => setEditedSize(e.target.value)} /> : renderSize()}
        </Typography>
        <Typography variant="h6" component="h3">
          <b>Available from:</b>{" "}
          {/* {editing ? <TextField sx={{ width: 300, mb: 1 }} size="small" value={available} onChange={(e) => setEditedAvailable(e.target.value)} /> : handleAvailable(available)} */}
          {editing ? <DesktopDatePicker
            label="Available from"
            // inputFormat="DD/MM/YYYY"
            value={editedAvailable}
            onChange={(newValue) => setEditedAvailable(newValue as string)}
            renderInput={(params) => <TextField sx={{ width: 300, mb: 1 }} size="small" {...params} />}
          /> : handleAvailable(displayedListing.available as string)}
        </Typography>
        <Typography variant="h6" component="h3">
          <b>Description:</b>{" "}
          {!editing && (<><a onClick={() => setDescriptionOpen(!descriptionOpen)} >
            {descriptionOpen ? "Close description" : "View description"}
          </a>
            <br />
            <br />
          </>)}

          {editing ? <><br /><TextField sx={{ width: 600, mb: 3 }} multiline={true} minRows={4} maxRows={10} value={editedDescription as string} onChange={(e) => setEditedDescription(e.target.value)} /></> : renderDescription()}

        </Typography>
        <Typography variant="h6" component="h3">
          <b>Floorplan:</b>{" "}
          {!editing && (<><a onClick={() => setFloorplanOpen(!floorplanOpen)}>
            {floorplanOpen ? "Close floorplan" : "View floorplan"}
          </a>
            <br /></>)}
          {editing ? <TextField sx={{ width: 450 }} size="small" value={editedFloorplan} onChange={(e) => setEditedFloorplan(e.target.value)} /> : (floorplanOpen && handleNa(displayedListing.floorplan as string))}
        </Typography>
        <Typography variant="h6" component="h3">
          <b>EPC:</b>{" "}
          {!editing && (<><a onClick={() => setEpcOpen(!epcOpen)}>
            {epcOpen ? "Close EPC" : "View EPC"}
          </a>
            <br /></>)}
          {editing ? <TextField sx={{ width: 450 }} size="small" value={editedEpc} onChange={(e) => setEditedEpc(e.target.value)} /> : (epcOpen && handleNa(displayedListing.epc as string))}
        </Typography><br />
        {/* <div className={classes.pros_cons_root}>
          <Grid container spacing={3}>
            <Grid item xs={6} className={classes.pros_cons_columns}>
              <Typography variant="h6" component="h4" className={classes.pros_cons_columnTitle}>
                Pros
              </Typography>
              {pros?.map((pro, index) => (
                <TextField
                  key={index}
                  fullWidth
                  value={pro}
                  onChange={(e) => handleProChange(e, index)}
                  placeholder="Enter a pro"
                />
              ))}
              <IconButton className={classes.pros_cons_addButton} onClick={addPro}>
                <Add />
              </IconButton>
            </Grid>
            <Grid item xs={6} className={classes.pros_cons_columns}>
              <Typography variant="h6" component="h4" className={classes.pros_cons_columnTitle}>
                Cons
              </Typography>
              {cons?.map((con, index) => (
                <TextField
                  key={index}
                  fullWidth
                  value={con}
                  onChange={(e) => handleConChange(e, index)}
                  placeholder="Enter a con"
                />
              ))}
              <IconButton className={classes.pros_cons_addButton} onClick={addCon} >
                <Add />
              </IconButton>
            </Grid>
          </Grid>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={generalNotes ? generalNotes : ""}
            onChange={(e) => setGeneralNotes(e.target.value)}
            placeholder="Enter any general notes or observations about the listing"
          />
        </div> */}
      </CardContent>
      <CardActions>
        {editing && <Button size="small" onClick={handleEditListing}>Cancel</Button>}
        {editing ? <Button size="small" onClick={handleSaveListing}>Save Listing</Button> :
          <Button size="small" onClick={handleEditListing}>Edit Listing</Button>
        }
      </CardActions>
    </Card>
  );
};

export default ListingCard;
