const { google } = require("googleapis");
require("dotenv").config();

const youtube = google.youtube({
  version: "v3",
  auth: process.env.API_KEY,
});

async function getChannelDetailsByHandle(channelHandle) {
  // Renamed for clarity
  // No try-catch here, let the caller handle it via .catch()
  const response = await youtube.channels.list({
    forHandle: channelHandle,
    part: "snippet,contentDetails,statistics",
  });
  return response;
}

// Usage with .then() and .catch()
getChannelDetailsByHandle("@RainKoyi")
  .then((channelDataResponse) => {
    if (
      channelDataResponse &&
      channelDataResponse.data &&
      channelDataResponse.data.items
    ) {
      console.log("API Response Status:", channelDataResponse.status);
      console.log(
        "Channel Data:",
        JSON.stringify(channelDataResponse.data, null, 2)
      );

      if (channelDataResponse.data.items.length > 0) {
        const channel = channelDataResponse.data.items[0];
        console.log("\n--- Specific Channel Info ---");
        console.log("Channel Title:", channel.snippet.title);
        console.log("Channel ID:", channel.id);
        console.log("Subscriber Count:", channel.statistics.subscriberCount);
      } else {
        console.log("No channel found for that handle.");
      }
    } else {
      console.log("No data received or unexpected response structure.");
    }
  })
  .catch((error) => {
    console.error("Failed to get channel details:", error.message);
    if (error.response && error.response.data && error.response.data.error) {
      console.error(
        "API Error Details:",
        JSON.stringify(error.response.data.error, null, 2)
      );
    }
  });
