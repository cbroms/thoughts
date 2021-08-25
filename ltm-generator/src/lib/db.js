const ce = 'http://localhost:3000';

const getPage = async (page) => {
	return await (await fetch(ce + page)).json();
};

export default getPage;
