/**
 * A replacer function for JSON.stringify. Will remove any empty objects in root of object
 *
 */
function removeEmpty(key, value) {
  if (typeof value !== 'object') return value;
  return Object.keys(value).length === 0 ? undefined : value;
}

module.exports = {
  removeEmpty,
};
