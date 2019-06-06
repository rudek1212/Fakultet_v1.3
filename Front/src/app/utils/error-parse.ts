import { isNil } from 'lodash';

export function parseError(errors: string[]): string {
  if (isNil(errors) || errors.length === 0) {
    return '';
  }

  return `<br>${errors.join('<br>')}`;
}
