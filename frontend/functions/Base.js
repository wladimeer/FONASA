const Base = (domain) => async (resource) => {
  const url = `${domain}/${resource}`;

  try {
    const response = await fetch(url);
    return await response.json();
  } catch (response) {
    return response;
  }
};

export default Base;
