export interface DriveOwner {
  displayName?: string;
  kind?: string;
  me?: boolean;
  permissionId?: string;
  emailAddress?: string;
  photoLink?: string;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
  createdTime?: string;
  owners?: DriveOwner[];
  shared?: boolean;
  starred?: boolean;
  trashed?: boolean;
  parents?: string[];
  webViewLink?: string;
  webContentLink?: string;
  iconLink?: string;
  thumbnailLink?: string;
  hasThumbnail?: boolean;
  description?: string;
}

export interface StorageQuota {
  limit?: string;
  usage?: string;
  usageInDrive?: string;
  usageInDriveTrash?: string;
}

export interface DriveAbout {
  user?: {
    displayName?: string;
    emailAddress?: string;
    photoLink?: string;
    me?: boolean;
  };
  storageQuota?: StorageQuota;
}

export type DriveViewSection =
  | 'my-drive'
  | 'shared-with-me'
  | 'starred'
  | 'trash'
  | 'type-filter'
  | 'search'
  | 'nizam-report';

export type FileFilterType =
  | 'all'
  | 'folders'
  | 'documents'
  | 'spreadsheets'
  | 'presentations'
  | 'pdfs'
  | 'images'
  | 'videos'
  | 'audio'
  | 'archives';

export type SortField = 'name' | 'modifiedTime' | 'size';
export type SortOrder = 'asc' | 'desc';

export type OwnerFilterType = 'any' | 'me' | 'not-me' | 'custom';
export type DatePresetType = 'any' | 'today' | '7days' | '30days' | '90days' | 'this_year' | 'custom';
export type DateTargetField = 'modifiedTime' | 'createdTime';

export interface AdvancedSearchFilters {
  query: string;
  ownerType: OwnerFilterType;
  ownerEmail: string;
  datePreset: DatePresetType;
  dateField: DateTargetField;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  fileType: FileFilterType;
}

export interface FolderBreadcrumb {
  id: string;
  name: string;
}

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  errorMessage?: string;
}
