import { UnstructuredClient } from "unstructured-client";
import { PartitionResponse } from "unstructured-client/dist/sdk/models/operations";
import * as fs from "fs";
import * as dotenv from 'dotenv';

// ts-node is odd at the moment with Node v20.0.0. Using the following command is a workaround:
// node --no-warnings=ExperimentalWarning --loader ts-node/esm unstructured-js-client.ts
// This will run the script with the ESM loader and suppress the ExperimentalWarning
// Using ts-node file_name will not work as expected and will throw an error not recognizing the .ts extension

dotenv.config();

const key = process.env.UNSTRUCTURED_API_KEY || "";
const serverURL = process.env.UNSTRUCTURED_SERVER_URL || "";

const client = new UnstructuredClient({
    serverURL,
    security: {
        apiKeyAuth: key,
    },
});

const filename = "./eBook-How-to-Build-a-Career-in-AI.pdf";
const data = fs.readFileSync(filename);

client.general.partition({
    // Note that this currently only supports a single file
    files: {
        content: data,
        fileName: filename,
    },
    // Other partition params
    strategy: "fast",
}).then((res: PartitionResponse) => {
    if (res.statusCode == 200) {
        console.log(res.elements);
    }
}).catch((e) => {
    console.log(e.statusCode);
    console.log(e.body);
});

