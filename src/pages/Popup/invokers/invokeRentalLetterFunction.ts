import axios from 'axios';
import { RentLetterForm } from '../components/RentLetterGenerator';

const supabaseKey = process.env.REACT_APP_SUPABASE_API_KEY;

type TenantGroupDetails = {
  tenantDetails: RentLetterForm[];
  tenantRelationship: string;
};

const invokeRentalLetterGenerator = async (tenantGroup: TenantGroupDetails) => {
  try {
    const invoke = await axios.post(
      `https://prodgqjnzxzcmizdqqtc.functions.supabase.co/generate-letter`,
      {
        tenantGroup: tenantGroup,
      },
      {
        headers: {
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = invoke.data;

    console.log(`Rental letter scraper invoked - response = `, data);
    return data;
  } catch (err) {
    console.log(err);
  }
};

export default invokeRentalLetterGenerator;
