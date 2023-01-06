import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import {
  FormGroup,
  FormControlLabel,
  Switch,
} from "@mui/material";
import ListingsList from "./ListingsList";
import { supabase } from "../../../supabaseClient";
import formatDate from "../utils/formatDate";
import isDateString from "../utils/isDateString";
// import stripHtml from "../utils/stripHtml";
import { Listing } from '../../../../lib/database.types';
import ListingsTable from "./ListingsTable";

import { Session } from '@supabase/supabase-js';
import SignInRequired from "./SignInRequired";
import Title from './Title';

const handleAvailable = (datestring: string | null) => {
  console.log('formatting datestring for listing card -', datestring)
  console.log('type -', typeof datestring)
  if (datestring == null || datestring == 'null') {
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

const handleNa = (prop: string) => {
  if (prop) {
    return prop.startsWith("http") ? (
      <>
        <a href={prop} target="_blank" rel="noreferrer">
          <img src={prop} alt={prop} width="100%" />
        </a>
      </>
    ) : (
      prop
    );
  }
};

const SavedListings = ({ session }: { session: Session }) => {
  const [listings, setListings] = useState<Listing[] | null>(null);
  const [currentUserId, setCurrentUserId] = useState(0);
  const [currentUserUuid, setCurrentUserUuid] = useState<string | undefined>('');
  const [tableView, setTableView] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUserIds = async () => {
      let userUuidObj = await supabase.auth.getUser();
      let userUuid = userUuidObj?.data?.user?.id;
      setCurrentUserUuid(userUuid);
      let userIdObj = await supabase
        .from("users")
        .select("user_id")
        .eq("user_uuid", currentUserUuid);
      console.log("userIdObj", userIdObj);
      if (userIdObj.data) {
        let userId = userIdObj.data[0].user_id;

        setCurrentUserId(userId)
      }
    };
    getUserIds();
  }, [currentUserUuid]);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("listings")
        .select("*")
        .eq("user_id", currentUserId);
      if (data) {
        setListings(data);
        setLoading(false);
        console.log("Listings found -", data);
      }
    };
    fetchListings();
  }, [currentUserId]);

  return (
    <div>
      <Title title={"Your Saved Listings"} />
      <p>You have saved the following listings:</p>
      {session ? (
        <>
          <FormGroup>
            <FormControlLabel
              control={<Switch defaultChecked />}
              onChange={() => setTableView(!tableView)}
              label={tableView ? "Table view" : "List view"}
            />
          </FormGroup>
          <div style={{ height: "50%", width: "100%" }}>
            <div style={{ flexGrow: 3 }}>
              {tableView && (listings ? <ListingsTable listings={listings} loadedState={!loading} /> : <p>Loading...</p>)}
            </div>
            {!tableView &&
              (listings ? <ListingsList listings={listings} /> : <p>Loading...</p>)}
          </div></>) : <SignInRequired />}
    </div>
  );
};

export default SavedListings;
