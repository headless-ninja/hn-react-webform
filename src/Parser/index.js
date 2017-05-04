import Parser from 'react-html-parser';
import { Html5Entities } from 'html-entities';

const entities = new Html5Entities();

export default function (string) {
  const decoded = entities.decode(string);
  return Parser(decoded);
}
