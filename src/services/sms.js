import errors from 'feathers-errors';
import twilio from 'twilio';

class Service {
	constructor (options = {}) {
		if (!options.accountSid) {
			throw new Error('Twilio `accountSid` needs to be provided');
		}

		if (!options.authToken) {
			throw new Error('Twilio `authToken` needs to be provided');
		}

		if (!options.phoneNumber) {
			throw new Error('Twilio `phoneNumber` needs to be provided');
		}

		this.phoneNumber = options.phoneNumber || null;
		this.paginate    = options.paginate || {};
		this.twilio      = twilio(options.accountSid, options.authToken);
	}

	find (params) {
		params = params || {};

		// TODO (EK): Do something with params and pagination
		return new Promise((resolve, reject) => {
			return this.twilio.messages.get().then(resolve).catch(reject);
		});
	}

	get (id) {
		return new Promise((resolve, reject) => {
			if (!id) {
				return reject(new errors.BadRequest('`id` needs to be provided'));
			}

			return this.twilio.messages(id).get().then(resolve).catch(reject);
		});
	}

	create (data) {
		return new Promise((resolve, reject) => {

			data.from = data.from || this.phoneNumber;

			if (!data.from) { return reject(new errors.BadRequest('`from` must be specified')); }
			if (!data.to) { return reject(new errors.BadRequest('`to` must be specified')); }
			if (!data.body && !data.mediaUrl) {	return reject(new errors.BadRequest('`body` or `mediaUrl` must be specified')); }

			return this.twilio.messages.create(data).then(resolve).catch(reject);

		});
	}
}

export default function init (options) {
	return new Service(options);
}

init.Service = Service;
