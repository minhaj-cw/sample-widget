# Project Setup

**Prerequisites:**

Node.js and npm (or yarn) installed on your system.

## Installation:

**Clone this repository.**

Navigate to the project directory in your terminal.

## Install dependencies:

```bash
npm install

```
Running the Server
Start the development server:

```bash
node backend/server.js
```

This will start the server on the default port (usually 3000).

Building the Widget
Build the widget bundle:

```bash
npx webpack
```
This will create a widget.js file in the dist directory.

Embedding the Widget
1. Host the widget.js file:

Upload the widget.js file to a web server.
Replace 'widget.js' in the embed script with the actual URL of the hosted file.
2. Add the Embed Script to Your Website:

Copy and paste the following code into your HTML:
HTML
```
<script>
    function embedWidget() {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = 'https://your-domain/widget.js'; // Replace with your actual URL
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(script, s);
    }

    window.businessId = 1; // Replace 1 with your desired business ID
    embedWidget();
</script>
<div id="root"></div>
```

Replace https://your-domain/widget.js with the actual URL of your hosted widget.js file.

The widget will be rendered within the div with the ID root.

Additional Notes:

Configuration: You can customize the widget's behavior by passing additional parameters to the embedWidget function or by modifying the widget.js file.
Security: Ensure that your server is secure and that your widget doesn't introduce vulnerabilities to the websites where it's embedded.
Error Handling: Implement error handling in your backend and frontend code to gracefully handle potential issues.
Optimization: Optimize your widget's performance by minifying and compressing the widget.js file.
By following these steps, you can effectively embed your widget on different websites and customize its behavior to suit your specific needs.