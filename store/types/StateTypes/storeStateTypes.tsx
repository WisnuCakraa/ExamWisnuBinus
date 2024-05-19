export type stateStoreType = {
    result?: stateResponse;
    loading?: boolean;
    error?: boolean | string;
};

export type stateResponse = {
    data?: stateData[];
};

export type stateData = {
    "ImageURL"?: string | undefined;
    "ID State": string;
    "State": string;
    "ID Year": number;
    "Year": string;
    "Population": number;
    "Slug State": string;
};
