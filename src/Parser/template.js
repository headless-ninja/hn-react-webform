const regex = /{{(\w+)}}/g;

function parseTemplate(formStore, text) {
  // First check if it is really a string
  if(typeof text !== 'string' || typeof text.replace !== 'function') {
    console.info('Tried to template', text, 'but it doesn\'t have a replace function');
    return text;
  }

  return text.replace(regex, (found, variable) => formStore.tokens[variable]);
}

export default parseTemplate;
