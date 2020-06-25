const Sentry = require('@sentry/node');

const saveError = async (incomingError) => {
  console.log(incomingError);
  try {
    Sentry.captureException(incomingError);
  } catch (err) {
    console.log('Não foi possível salvar o erro. Sentry não está configurado.');
    console.log(err);
  }
};

module.exports = saveError;
