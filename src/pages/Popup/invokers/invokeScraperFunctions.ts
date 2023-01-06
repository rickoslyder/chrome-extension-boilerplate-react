import axios from 'axios';

const supabaseKey = process.env.REACT_APP_SUPABASE_API_KEY;

type HomeLoggerSupportedSite = 'rightmove' | 'zoopla' | 'onthemarket' | 'daft';

const invokeScraper = async (site: HomeLoggerSupportedSite, url: string) => {
  try {
    const invoke = await axios.post(
      `https://prodgqjnzxzcmizdqqtc.functions.supabase.co/${site}-scraper`,
      {
        url: url,
      },
      {
        headers: {
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = invoke.data;

    console.log(`${site} scraper invoked - response = `, data);
    return data;
  } catch (err) {
    console.log(err);
  }
};

export default invokeScraper;
