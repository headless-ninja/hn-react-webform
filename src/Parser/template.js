import getNested from 'get-nested';

const regex = /{{(\w+)}}/g;

function parseTemplate(formStore, text) {
  // First check if it is really a string
  if(typeof text !== 'string' || typeof text.replace !== 'function') {
    console.info('Tried to template', text, 'but it doesn\'t have a replace function');
    return text;
  }

  return text.replace(regex, (found, variable) => getNested(() => formStore.getField(variable).value || ''));
}

export default parseTemplate;
