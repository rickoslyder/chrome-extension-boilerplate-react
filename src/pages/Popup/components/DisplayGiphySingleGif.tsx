import React, { useState } from "react";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { IGif } from "@giphy/js-types";
import { useAsync } from "react-async-hook";

import { Gif } from "@giphy/react-components"

const giphyKey = process.env.REACT_APP_GIPHY_API_KEY;

const giphyFetch = new GiphyFetch(giphyKey as string);

function DisplayGiphySingleGif({ gifKey, width }: { gifKey: string, width?: number, height?: string }) {
    const [gif, setGif] = useState<IGif | null>(null);
    useAsync(async () => {
        const { data } = await giphyFetch.search(gifKey, { limit: 1 });
        setGif(data[0]);
    }, []);
    console.log('displaying gif at width -', width)
    return gif && <Gif gif={gif} noLink width={width ? width : 200} />;
}

export default DisplayGiphySingleGif