import { FileState } from 'src/app/models/api.model';

export const FileStateTranslate = {
  [FileState.Created]: 'Do rozpatrzenia',
  [FileState.Confirmed]: 'Zatwierdzone',
  [FileState.Rejected]: 'Odrzucone',
  [FileState.Sent]: 'Udostępniony',
  [FileState.Signed]: 'Podpisany'
}