import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";
import { CircularProgress, Input, InputAdornment, Button, Typography, Divider } from '@mui/material';
import invokeScraper from "../invokers/invokeScraperFunctions";
import ListingCard from "./ListingCard";
import HomeIcon from "@mui/icons-material/Home";

import { useSnackbar } from 'notistack';

import { UserResponse, Session } from '@supabase/supabase-js';
import { Listing } from '../../../../lib/database.types';
import SignInRequired from "./SignInRequired";
import Title from "./Title";

const CreateNewListing = ({ session }: { session: Session }) => {
  const [url, setUrl] = useState("");
  // const [listing, setListing] = useState({
  //   agency_name: "Hamptons - Clapham Lettings",
  //   agency_address: "27-31 The Pavement, Clapham, London",
  //   agency_phone: "020 3542 2764",
  //   available: "2022-12-19T12:00:00",
  //   cost: "£3,300 pcm",
  //   deposit: "£5,305",
  //   details: "1 bedroom, 1 bathroom, 1 living room, flat",
  //   epc: "https://lid.zoocdn.com/u/2400/1800/a54b5a08dd01e2b9f849aaf3a7d003498244d758.jpg",
  //   floorplan:
  //     "https://lid.zoocdn.com/u/2400/1800/f092b20eb623820e4645117a6abae9f4e7b8e10a.jpg",
  //   furnished: "Furnished",
  //   property_address: "Wingate Square, London SW4",
  //   property_images: [
  //     "https://lid.zoocdn.com/u/2400/1800/10e5234f6c6f7ef433f3ecb39ad39f88bbc36e28.jpg",
  //     "https://lid.zoocdn.com/u/2400/1800/66a2b5f2356eb1e92bf59e4372f73675810cb55e.jpg",
  //     "https://lid.zoocdn.com/u/2400/1800/5d31c9147ff392523f26815aee4db0c095a88485.jpg",
  //     "https://lid.zoocdn.com/u/2400/1800/d8c16958e2e596bb49a6bb6b201b43d85e319950.jpg",
  //     "https://lid.zoocdn.com/u/2400/1800/12327ac4589d0f34d288772ee0ebaf58b5e3832e.jpg",
  //     "https://lid.zoocdn.com/u/2400/1800/cc03441699e7bcb356c4497531506a19ac3aa686.jpg",
  //   ],
  //   property_url: "https://www.zoopla.co.uk/to-rent/details/63302024/",
  //   size: "69 m²",
  // });
  const [listing, setListing] = useState<Listing | null>(null);

  const [listingLoaded, setListingLoaded] = useState(false);
  const [currentUserUuid, setCurrentUserUuid] = useState("");
  const [loading, setLoading] = useState(false);
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

  const getSite = async (url: string) => {
    if (url.includes("rightmove")) {
      const property = await invokeScraper("rightmove", url);
      return property;
    } else if (url.includes("zoopla")) {
      const property = await invokeScraper("zoopla", url);
      return property;
    } else if (url.includes("onthemarket")) {
      const property = await invokeScraper("onthemarket", url);
      return property;
    } else {
      alert("Site not supported yet / Invalid URL");
      return null;
    }
  };

  const isPropertyListing = (url: string) => {
    if (url.includes("rightmove")) {
      return url.includes("properties");
    } else if (url.includes("zoopla")) {
      return url.includes("to-rent");
    } else if (url.includes("onthemarket")) {
      return url.includes("details");
    } else {
      return false;
    }
  };

  const scrapeProperty = async (url: string) => {
    if (isPropertyListing(url)) {
      setLoading(true);
      const property = await getSite(url);
      console.log("property = ", property);
      setListing(property);
      setLoading(false);
      setListingLoaded(true);
      enqueueSnackbar('Listing successfully loaded!', { variant: 'success' });
      return property;
    } else {
      return {
        error:
          "Invalid URL - active tab must be using Rightmove, Zoopla or OnTheMarket",
      };
    }
  };

  const saveProperty = async () => {
    if (listing) {
      try {
        await supabase.from("listings").upsert({
          ...listing,
          user_id: currentUserId
        });

        const action = (snackbarId: any) => (
          <>
            <Button variant="outlined" color="inherit" onClick={async () => {
              await supabase.from("listings").delete().order('last_modified', { ascending: false }).limit(1).single
              enqueueSnackbar('Undo complete', { variant: 'success' })
            }}>
              Undo
            </Button>
            <Button variant="outlined" color="inherit" onClick={() => { window.location = `${window.location.origin}/listings/saved` as (string & Location) }}>
              View Saved Listings
            </Button>
          </>
        )

        enqueueSnackbar('Listing successfully saved!', { variant: 'success', action });
      } catch (error) {
        console.error(error);
        enqueueSnackbar(`Error saving listing - ${error}`, { variant: 'error' });
      }
    }
  };

  return (
    <div>
      <Title title={"Create New Listing"} />

      <Typography><b>Welcome to the Create New Listing page!</b></Typography>
      <Typography>To get started, fill out the form below with all the relevant details about the property. </Typography>
      <Typography>Once you've completed the form, hit "Save Property" and your property will be added to our database. Happy listing!</Typography>
      {/* <br />
      <Divider /> */}
      <br />
      <Typography><b>Supported Sites:</b> <a href="https://www.rightmove.co.uk/" target="_blank" rel="noreferrer">Rightmove</a>, <a href="https://www.zoopla.co.uk/" target="_blank" rel="noreferrer">Zoopla</a>, <a href="https://onthemarket.com/" target="_blank" rel="noreferrer">OnTheMarket</a></Typography>
      <br />
      <Typography><details><summary><i>Upcoming sites: (click here)</i></summary> <ul>
        <li>Idealista</li>
        <li>Zillow</li>
        <li>Trulia.com</li>
        <li>Realtor.com</li>
        <li>Redfin</li>
        <li>Daft.ie</li>
        <li>Apartments.com</li>
        <li>realestate.com.au</li>
      </ul></details></Typography>
      <br />
      <Divider />
      <br />
      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="url">Property URL: </label>
        <Input
          id="url"
          value={url}
          disabled={!session}
          onChange={(e) => setUrl(e.target.value)}
          style={{ width: "50%" }}
          autoFocus={true}
          fullWidth={true}
          required
          startAdornment={
            <InputAdornment position="start">
              <HomeIcon />
            </InputAdornment>
          }
        />
        <br />
        <br />
        <button disabled={!session} onClick={() => scrapeProperty(url)}>
          {loading ? <CircularProgress size={24} /> : "Load Property Details"}
        </button>{" "}
        <button disabled={!session} onClick={saveProperty}>Save Property to HomeLogger</button>
      </form>
      {/* <p>Current user UUID: {currentUserUuid}</p>
      <p>Current user ID: {currentUserId}</p> */}
      {!session ? <SignInRequired /> :
        <div>
          {(listing && listingLoaded) && (
            <ListingCard key={listing.property_url} listing={listing} userId={currentUserId} />
          )}
        </div>}
    </div>
  );
};

export default CreateNewListing;
