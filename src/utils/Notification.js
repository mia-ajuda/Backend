const { Expo } = require('expo-server-sdk');

const notify = async (messages) => {
  const expo = new Expo();
  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];
  (async () => {
    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error(error);
      }
    }
  })();


  const receiptIds = [];
  for (const ticket of tickets) {
    if (ticket.id) {
      receiptIds.push(ticket.id);
    }
  }

  const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  (async () => {
    for (const chunk of receiptIdChunks) {
      try {
        const receipts = await expo.getPushNotificationReceiptsAsync(chunk);

        for (const receiptId in receipts) {
          const { status, message, details } = receipts[receiptId];
          if (status === 'ok') {
            continue;
          } else if (status === 'error') {
            console.error(
              `There was an error sending a notification: ${message}`,
            );
            if (details && details.error) {
              console.error(`The error code is ${details.error}`);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  })();
};

module.exports = notify;
