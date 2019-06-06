import { FileType } from 'src/app/models/api.model';

export const FileTypeTranslate = {
  [FileType.Proposal]: 'Wniosek',
  [FileType.Decision]: 'Decyzja',
  [FileType.Complaint]: 'Skarga',
  [FileType.Claim]: 'Zażalenie',
}