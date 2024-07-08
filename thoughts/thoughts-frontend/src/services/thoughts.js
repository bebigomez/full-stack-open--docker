import axios from '../util/apiClient'

const getAll = async () => {
  const { data } = await axios.get('/thoughts');
  return data;
};

const getOne = async (id) => {
  const { data } = await axios.get(`/thoughts/${id}`);
  return data;
};

const create = async (newObject) => {
  const { data } = await axios.post(newObject);
  return data;
};

export default {
  getAll,
  getOne,
  create,
};
