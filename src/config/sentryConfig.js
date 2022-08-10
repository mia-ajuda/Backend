const Sentry = require('@sentry/node');

const sentryInit = async () => {
  const sentryDSN = process.env.SENTRY_DSN || null;
  if (sentryDSN === null) {
    console.log('Sentry não configurado. Os logs de erros não serão salvos na núvem.');
  } else {
    Sentry.init({
      dsn: sentryDSN,
    });
  }
};

module.exports = sentryInit;
