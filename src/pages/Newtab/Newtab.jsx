import React, { useState, useEffect } from 'react';
import logo from '../../assets/img/logo.svg';
import './Newtab.css';
import './Newtab.scss';

const checkForExistingListings = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('homelogger-scraped-listings', (result) => {
      console.log(result);
      resolve(result['homelogger-scraped-listings']);
    });
  });
};

const retrieveLatestListing = async () => {
  const listings = await checkForExistingListings();
  console.log('listings', listings);
  const latestProperty = listings[listings.length - 1];
  console.log('latest property retrieved - ', latestProperty);
  return latestProperty;
};

const checkForExistingTenantGroup = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['rentletter-tenant-group'], (result) => {
      console.log(result);
      resolve(result['rentletter-tenant-group']);
    });
  });
};

const saveTenant = async (tenant) => {
  checkForExistingTenantGroup().then((response) => {
    if (response) {
      const data = response;
      chrome.storage.local.set(
        { 'rentletter-tenant-group': [...data, tenant] },
        () => {
          document.getElementById('tenants_needed').style.display = 'none';
          document.getElementById('tenants_entered').style.display = 'block';
        }
      );
    } else {
      // Save to google storage
      chrome.storage.local.set({ 'rentletter-tenant-group': [tenant] }, () => {
        document.getElementById('tenants_needed').style.display = 'none';
        document.getElementById('no_tenants_yet').style.display = 'none';
        document.getElementById('tenants_entered').style.display = 'block';
      });

      console.log('Tenant saved');
    }
  });
};

const Newtab = () => {
  const [keyEntered, setKeyEntered] = useState(false);
  const [tenantDetails, setTenantDetails] = useState({});
  const [scrapedListings, setScrapedListings] = useState([]);

  useEffect(() => {
    setScrapedListings(checkForExistingListings());
    setTenantDetails(checkForExistingTenantGroup());
  }, []);

  const handleSaveKey = () => {
    // Add logic to save the key
    setKeyEntered(true);
  };

  const handleChangeKey = () => {
    // Add logic to change the key
    setKeyEntered(false);
  };

  const handleSaveTenant = (event) => {
    event.preventDefault();
    // Add logic to save the tenant details
    const formData = new FormData(event.target);
    const tenant = Object.fromEntries(formData);
    saveTenant(tenant);
  };

  return (
    <div>
      {!keyEntered && (
        <div id="key_needed">
          <p>To get started, add your OpenAI API Key!</p>
          <input id="key_input" />
          <button id="save_key_button" onClick={handleSaveKey}>
            Add key
          </button>
        </div>
      )}
      {keyEntered && (
        <div id="key_entered">
          <p>You entered your OpenAI API Key.</p>
          <button id="change_key_button" onClick={handleChangeKey}>
            Change key
          </button>
        </div>
      )}
      {Object.keys(scrapedListings).length > 0 && (
        <div id="listings_saved">
          <p>You have saved the following property details:</p>
          <ul>
            {Object.entries(scrapedListings).map(([key, value]) => (
              <li key={key}>
                {key}: {value}
              </li>
            ))}
          </ul>
        </div>
      )}
      {Object.keys(tenantDetails).length === 0 && (
        <div id="tenants_needed">
          <p id="no_tenants_yet">
            It looks like you haven't saved any tenant details yet - let's
            change that!
          </p>
          <form
            className="tenantInputForm"
            id="tenantInputForm"
            color="white"
            onSubmit={handleSaveTenant}
          >
            <div>
              <h3>Tenant Details</h3>
              <div>
                <label htmlFor="name">
                  Name:
                  <input type="text" id="name" name="name" defaultValue="" />
                </label>
              </div>
              <div>
                <label htmlFor="age">
                  Age:
                  <input type="number" id="age" name="age" defaultValue="" />
                </label>
              </div>
              <div>
                <label htmlFor="gender">
                  Gender:
                  <select name="gender" id="gender" defaultValue="">
                    <option></option>
                    <option defaultValue="male">Male</option>
                    <option defaultValue="female">Female</option>
                    <option defaultValue="other">Non-binary</option>
                  </select>
                </label>
              </div>
              <br />
              <div>
                <label htmlFor="smoker">
                  Do you smoke?
                  <select name="smoker" id="smoker" defaultValue="">
                    <option></option>
                    <option defaultValue="yes">Yes</option>
                    <option defaultValue="no">No</option>
                  </select>
                </label>
              </div>
              <div>
                <label htmlFor="pets">
                  How many pets?
                  <input type="number" id="pets" name="pets" defaultValue="" />
                </label>
              </div>
              <div>
                <label htmlFor="kids">
                  How many kids?
                  <input type="number" id="kids" name="kids" defaultValue="" />
                </label>
              </div>
              <div>
                <label htmlFor="pregnant">
                  Pregnant?
                  <select name="pregnant" id="pregnant" defaultValue="">
                    <option></option>
                    <option defaultValue="yes">Yes</option>
                    <option defaultValue="no">No</option>
                  </select>
                </label>
              </div>
              <br />
              <div>
                <label htmlFor="occupation">
                  Occupation:
                  <select name="occupation" id="occupation" defaultValue="">
                    <option></option>
                    <option defaultValue="student">Student</option>
                    <option defaultValue="employed">Employed</option>
                    <option defaultValue="unemployed">Unemployed</option>
                  </select>
                </label>
              </div>
              <div>
                <label htmlFor="employer">
                  Employer name:
                  <input
                    type="text"
                    id="employer"
                    name="employer"
                    defaultValue=""
                    placeholder="N/A if none"
                  />
                </label>
              </div>
              <div>
                <label htmlFor="jobTitle">
                  Job title:
                  <input
                    type="text"
                    placeholder="N/A if none"
                    id="jobTitle"
                    name="jobTitle"
                    defaultValue=""
                  />
                </label>
              </div>
              <div>
                <label htmlFor="income">
                  Yearly income (£):
                  <input
                    type="number"
                    id="income"
                    name="income"
                    defaultValue=""
                  />
                </label>
              </div>
              <br />
              <button id="save_tenant_button" type="submit">
                Save Tenant
              </button>
            </div>
          </form>
        </div>
      )}
      {Object.keys(tenantDetails).length > 0 && (
        <div id="tenants_saved">
          <p>You have saved the following tenant details:</p>
          <ul>
            {Object.entries(tenantDetails).map(([key, value]) => (
              <li key={key}>
                {key}: {value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Newtab;
