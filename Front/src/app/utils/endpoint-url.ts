import { environment } from 'src/environments/environment';

export function getEndpointUrl(path: string): string {
  return `${environment.apiHost}${path}`;
}
