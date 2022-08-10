const Sentry = require('@sentry/node');

const sentryInit = async () => {
  const sentryDSN = process.env.SENTRY_DSN || null;
  if (sentryDSN === null) {
    console.log('Sentry nÃ£o configurado. Os logs de erros nÃ£o serÃ£o salvos na nÃºvem.');
  } else {
    Sentry.init({
      dsn: sentryDSN,
    });
  }
};

module.exports = sentryInit;
