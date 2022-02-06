const toDateString = (date) => {
	return new Date(date).toLocaleDateString('en-US', {
		timeZone: 'UTC',
		weekday: 'short',
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
};

export default toDateString;
