import serverless from 'serverless-http';
import app from '../../server/app.js';

const handle = serverless(app);

export const handler = (event, context) => {
  const path = event.path.replace(/^\/\.netlify\/functions\/api(?=\/|$)/, '/api');
  return handle({ ...event, path }, context);
};
