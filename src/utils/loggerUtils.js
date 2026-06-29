const LOG_LEVELS = {
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR'
};

const formatMessage = (level, message, data) => {
    const timestamp = new Date().toISOString();
    let dataStr = '';
    try {
        dataStr = data ? JSON.stringify(data) : '';
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
        dataStr = '[unserializable data]';
    }
    return `[${timestamp}] ${level}: ${message} ${dataStr}`.trim();
};

const logger = {
    debug: ({message="", stack={}}, context) => {
            console.debug(formatMessage(LOG_LEVELS.DEBUG, context ? `${context}: ${message}` : message, stack));
    },
    info: ({message="", stack={}}, context) => {
        console.log(formatMessage(LOG_LEVELS.INFO, context ? `${context}: ${message}` : message, stack));
    },

    warn: ({ message = '', stack = {} }, context) => {
        console.warn(formatMessage(LOG_LEVELS.WARN, context ? `${context}: ${message}` : message, stack));
    },

    error: ({ message = '', stack = {} }, context) => {
        console.error(formatMessage(LOG_LEVELS.ERROR, context ? `${context}: ${message}` : message, stack));
    }
};

export default logger;
