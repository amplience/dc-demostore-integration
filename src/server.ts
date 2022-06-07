import express, { Request, Response } from 'express';
import { middleware } from '.';
import 'isomorphic-unfetch'

const app = express();
const port = 8080; // default port to listen

const wrappedMiddleware = async (req: Request, res: Response, next: any) => {
    try {
        await middleware(req, res)
    } catch (e) {
        next(e)
    }
}

// define a route handler for the default home page
app.post("/api", wrappedMiddleware);
app.get("/api", wrappedMiddleware);

// start the express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});