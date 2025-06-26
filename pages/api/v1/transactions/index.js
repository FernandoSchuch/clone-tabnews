async function transactions(request, response) {
  response.setHeader("Content-Type", "text/html");
  response.status(200).send(`
    <html>
      <head><title>Transaction Page</title></head>
      <body>
        
      </body>
    </html>
  `);
}

export default transactions;
