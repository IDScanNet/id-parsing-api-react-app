## How to Integrate a Web Application using the Idscan.net Web Library with our ID Parsing Web API

This applicaiton will show you how to use our web library (avaiable on NPM) to sumbit data to our ID Parsing Web API. 

In cases where we are able to get the trackString from the PDF417 barcode will submit that to our Parse endpoint which will provide the most accurate parsing avaiable.

In cases where the trackString cannot be captured we will submit an image of the barcode to our ParseImage endpoint and from that image  we will extract the data within the barcode.
