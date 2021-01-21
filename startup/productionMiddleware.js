// all middleware for production
// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/deployment
import helmet from "helmet"; // set appropriate HTTP headers that help protect your app from well-known web vulnerabilities
import compression from "compression"; //  compress the HTTP response sent back to a client, significantly reducing the time required for the client to get and load the page

const productionMiddleware = (app) => {
  // use these deployment middleware
  app.use(helmet());
  app.use(compression());
};

export default productionMiddleware;
