const { Expo } = require('expo-server-sdk');

const notify = async (messages) => {
  const expo = new Expo();
  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];
  (async () => {
    chunks.forEach(async (chunk) => {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error(error);
      }
    });
  })();

  const receiptIds = [];
  tickets.forEach((ticket) => {
    if (ticket.id) {
      receiptIds.push(ticket.id);
    }
  });

  const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  (async () => {
    receiptIdChunks.forEach(async (chunk) => {
      try {
        const receipts = await expo.getPushNotificationReceiptsAsync(chunk);

        receipts.forEach((receiptId) => {
          const { status, message, details } = receipts[receiptId];
          if (status === 'error') {
            console.error(
              `There was an error sending a notification: ${message}`,
            );
            if (details && details.error) {
              console.error(`The error code is ${details.error}`);
            }
          }
        });
      } catch (error) {
        console.error(error);
      }
    });
  })();
};

module.exports = notify;
