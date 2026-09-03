import {
  DriveAbout,
  DriveFile,
  DriveViewSection,
  FileFilterType,
  AdvancedSearchFilters,
} from '../types';

const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_BASE = 'https://www.googleapis.com/upload/drive/v3';

export const MIME_TYPES = {
  FOLDER: 'application/vnd.google-apps.folder',
  DOCUMENT: 'application/vnd.google-apps.document',
  SPREADSHEET: 'application/vnd.google-apps.spreadsheet',
  PRESENTATION: 'application/vnd.google-apps.presentation',
  FORM: 'application/vnd.google-apps.form',
  PDF: 'application/pdf',
};

export async function getDriveAbout(token: string): Promise<DriveAbout> {
  const res = await fetch(`${DRIVE_API_BASE}/about?fields=user,storageQuota`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`خطأ في جلب بيانات التخزين: ${res.status} ${errorText}`);
  }

  return res.json();
}

export interface ListFilesOptions {
  folderId?: string;
  section?: DriveViewSection;
  typeFilter?: FileFilterType;
  searchQuery?: string;
  advancedFilters?: Partial<AdvancedSearchFilters>;
  pageToken?: string;
  pageSize?: number;
  orderBy?: string;
}

export async function listDriveFiles(
  token: string,
  options: ListFilesOptions = {}
): Promise<{ files: DriveFile[]; nextPageToken?: string }> {
  const {
    folderId = 'root',
    section = 'my-drive',
    typeFilter = 'all',
    searchQuery = '',
    advancedFilters,
    pageToken,
    pageSize = 60,
    orderBy = 'folder,modifiedTime desc',
  } = options;

  const queryParts: string[] = [];

  const hasAdvancedFilters = Boolean(
    advancedFilters &&
      ((advancedFilters.ownerType && advancedFilters.ownerType !== 'any') ||
        (advancedFilters.datePreset && advancedFilters.datePreset !== 'any') ||
        (advancedFilters.startDate && advancedFilters.startDate.trim()) ||
        (advancedFilters.endDate && advancedFilters.endDate.trim()) ||
        (advancedFilters.query && advancedFilters.query.trim()) ||
        (advancedFilters.fileType && advancedFilters.fileType !== 'all'))
  );

  const isSearchMode = section === 'search' || Boolean(searchQuery.trim()) || hasAdvancedFilters;

  if (section === 'trash') {
    queryParts.push('trashed = true');
  } else {
    queryParts.push('trashed = false');

    if (section === 'starred') {
      queryParts.push('starred = true');
    } else if (section === 'shared-with-me') {
      queryParts.push('sharedWithMe = true');
    } else if (section === 'my-drive' && !isSearchMode && typeFilter === 'all') {
      // In specific folder view only when not in search or special filtered mode
      queryParts.push(`'${folderId}' in parents`);
    }
  }

  // Determine search query
  const effectiveSearchQuery = (advancedFilters?.query || searchQuery || '').trim();
  if (effectiveSearchQuery) {
    const cleanQuery = effectiveSearchQuery.replace(/'/g, "\\'");
    queryParts.push(`name contains '${cleanQuery}'`);
  }

  // Owner filter
  if (advancedFilters?.ownerType) {
    if (advancedFilters.ownerType === 'me') {
      queryParts.push("'me' in owners");
    } else if (advancedFilters.ownerType === 'not-me') {
      queryParts.push("not 'me' in owners");
    } else if (advancedFilters.ownerType === 'custom' && advancedFilters.ownerEmail?.trim()) {
      const email = advancedFilters.ownerEmail.trim();
      if (email.includes('@')) {
        const cleanEmail = email.replace(/'/g, "\\'");
        queryParts.push(`'${cleanEmail}' in owners`);
      }
    }
  }

  // Date range filter
  if (advancedFilters) {
    const dateField = advancedFilters.dateField === 'createdTime' ? 'createdTime' : 'modifiedTime';
    const now = new Date();

    if (advancedFilters.datePreset === 'today') {
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      queryParts.push(`${dateField} >= '${todayStart.toISOString()}'`);
    } else if (advancedFilters.datePreset === '7days') {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      queryParts.push(`${dateField} >= '${sevenDaysAgo.toISOString()}'`);
    } else if (advancedFilters.datePreset === '30days') {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      queryParts.push(`${dateField} >= '${thirtyDaysAgo.toISOString()}'`);
    } else if (advancedFilters.datePreset === '90days') {
      const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      queryParts.push(`${dateField} >= '${ninetyDaysAgo.toISOString()}'`);
    } else if (advancedFilters.datePreset === 'this_year') {
      const startOfYear = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
      queryParts.push(`${dateField} >= '${startOfYear.toISOString()}'`);
    } else if (advancedFilters.datePreset === 'custom') {
      if (advancedFilters.startDate) {
        try {
          const startIso = new Date(`${advancedFilters.startDate}T00:00:00`).toISOString();
          queryParts.push(`${dateField} >= '${startIso}'`);
        } catch (e) {
          console.warn('Invalid startDate format:', advancedFilters.startDate);
        }
      }
      if (advancedFilters.endDate) {
        try {
          const endIso = new Date(`${advancedFilters.endDate}T23:59:59`).toISOString();
          queryParts.push(`${dateField} <= '${endIso}'`);
        } catch (e) {
          console.warn('Invalid endDate format:', advancedFilters.endDate);
        }
      }
    }
  }

  // Effective Type filter
  const effectiveType = advancedFilters?.fileType || typeFilter;
  if (effectiveType && effectiveType !== 'all') {
    switch (effectiveType) {
      case 'folders':
        queryParts.push(`mimeType = '${MIME_TYPES.FOLDER}'`);
        break;
      case 'documents':
        queryParts.push(
          `(mimeType = '${MIME_TYPES.DOCUMENT}' or mimeType contains 'word' or mimeType contains 'officedocument.wordprocessingml' or mimeType contains 'text/plain')`
        );
        break;
      case 'spreadsheets':
        queryParts.push(
          `(mimeType = '${MIME_TYPES.SPREADSHEET}' or mimeType contains 'excel' or mimeType contains 'officedocument.spreadsheetml' or mimeType contains 'csv')`
        );
        break;
      case 'presentations':
        queryParts.push(
          `(mimeType = '${MIME_TYPES.PRESENTATION}' or mimeType contains 'powerpoint' or mimeType contains 'officedocument.presentationml')`
        );
        break;
      case 'pdfs':
        queryParts.push(`mimeType = 'application/pdf'`);
        break;
      case 'images':
        queryParts.push(`mimeType contains 'image/'`);
        break;
      case 'videos':
        queryParts.push(`mimeType contains 'video/'`);
        break;
      case 'audio':
        queryParts.push(`mimeType contains 'audio/'`);
        break;
      case 'archives':
        queryParts.push(
          `(mimeType contains 'zip' or mimeType contains 'tar' or mimeType contains 'rar' or mimeType contains 'compressed' or mimeType contains '7z')`
        );
        break;
    }
  }

  const q = queryParts.join(' and ');

  const fields =
    'nextPageToken,files(id,name,mimeType,size,modifiedTime,createdTime,owners,shared,starred,trashed,parents,webViewLink,webContentLink,iconLink,thumbnailLink,hasThumbnail,description)';

  const params = new URLSearchParams({
    q,
    fields,
    pageSize: pageSize.toString(),
    orderBy,
    supportsAllDrives: 'true',
    includeItemsFromAllDrives: 'true',
  });

  if (pageToken) {
    params.set('pageToken', pageToken);
  }

  const res = await fetch(`${DRIVE_API_BASE}/files?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`تعذر استعراض الملفات: ${res.status} ${errorText}`);
  }

  const data = await res.json();
  let files: DriveFile[] = data.files || [];

  // Secondary client-side verification to guarantee 100% precision with owner filtering
  if (advancedFilters?.ownerType) {
    if (advancedFilters.ownerType === 'me') {
      files = files.filter((f) => f.owners?.some((o) => o.me));
    } else if (advancedFilters.ownerType === 'not-me') {
      files = files.filter((f) => !f.owners?.some((o) => o.me));
    } else if (advancedFilters.ownerType === 'custom' && advancedFilters.ownerEmail?.trim()) {
      const qLower = advancedFilters.ownerEmail.trim().toLowerCase();
      files = files.filter((f) =>
        f.owners?.some(
          (o) =>
            o.emailAddress?.toLowerCase().includes(qLower) ||
            o.displayName?.toLowerCase().includes(qLower)
        )
      );
    }
  }

  return { files, nextPageToken: data.nextPageToken };
}

export async function createDriveFolder(
  token: string,
  name: string,
  parentId: string = 'root'
): Promise<DriveFile> {
  const metadata = {
    name,
    mimeType: MIME_TYPES.FOLDER,
    parents: [parentId],
  };

  const res = await fetch(`${DRIVE_API_BASE}/files?supportsAllDrives=true`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metadata),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`تعذر إنشاء المجلد: ${res.status} ${errorText}`);
  }

  return res.json();
}

export async function uploadDriveFile(
  token: string,
  file: File,
  parentId: string = 'root',
  onProgress?: (percent: number) => void
): Promise<DriveFile> {
  // Use XMLHttpRequest for actual upload progress
  return new Promise((resolve, reject) => {
    const metadata = {
      name: file.name,
      mimeType: file.type || 'application/octet-stream',
      parents: [parentId],
    };

    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const reader = new FileReader();
    reader.onload = () => {
      const fileContent = reader.result as ArrayBuffer;

      const metadataPart =
        delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        `Content-Type: ${file.type || 'application/octet-stream'}\r\n` +
        'Content-Transfer-Encoding: base64\r\n\r\n';

      // Convert buffer to base64
      let binary = '';
      const bytes = new Uint8Array(fileContent);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64Data = btoa(binary);

      const multipartBody = metadataPart + base64Data + closeDelimiter;

      const xhr = new XMLHttpRequest();
      xhr.open(
        'POST',
        `${DRIVE_UPLOAD_BASE}/files?uploadType=multipart&supportsAllDrives=true&fields=id,name,mimeType,size,modifiedTime,createdTime,webViewLink,webContentLink,iconLink,thumbnailLink`
      );
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.setRequestHeader('Content-Type', `multipart/related; boundary=${boundary}`);

      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 100);
            onProgress(percentComplete);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const parsed = JSON.parse(xhr.responseText);
            resolve(parsed);
          } catch {
            reject(new Error('فشل معالجة استجابة الرفع'));
          }
        } else {
          reject(new Error(`فشل رفع الملف: ${xhr.status} ${xhr.responseText}`));
        }
      };

      xhr.onerror = () => {
        reject(new Error('حدث خطأ في الاتصال أثناء رفع الملف'));
      };

      xhr.send(multipartBody);
    };

    reader.onerror = () => {
      reject(new Error('فشل قراءة الملف المحلي'));
    };

    reader.readAsArrayBuffer(file);
  });
}

export async function updateDriveFile(
  token: string,
  fileId: string,
  updates: { name?: string; starred?: boolean; trashed?: boolean; description?: string }
): Promise<DriveFile> {
  const res = await fetch(
    `${DRIVE_API_BASE}/files/${fileId}?supportsAllDrives=true&fields=id,name,mimeType,size,modifiedTime,starred,trashed,parents,webViewLink`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`تعذر تعديل الملف: ${res.status} ${errorText}`);
  }

  return res.json();
}

export async function moveDriveFile(
  token: string,
  fileId: string,
  newParentId: string,
  previousParentId?: string
): Promise<DriveFile> {
  const params = new URLSearchParams({
    addParents: newParentId,
    supportsAllDrives: 'true',
  });

  if (previousParentId) {
    params.set('removeParents', previousParentId);
  }

  const res = await fetch(`${DRIVE_API_BASE}/files/${fileId}?${params.toString()}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`تعذر نقل الملف: ${res.status} ${errorText}`);
  }

  return res.json();
}

export async function deleteDriveFilePermanently(token: string, fileId: string): Promise<void> {
  const res = await fetch(`${DRIVE_API_BASE}/files/${fileId}?supportsAllDrives=true`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`تعذر حذف الملف نهائياً: ${res.status} ${errorText}`);
  }
}

export async function emptyDriveTrash(token: string): Promise<void> {
  const res = await fetch(`${DRIVE_API_BASE}/files/trash`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`تعذر إفراغ سلة المهملات: ${res.status} ${errorText}`);
  }
}

export function formatBytes(bytes?: string | number): string {
  if (!bytes) return '—';
  const num = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes;
  if (isNaN(num) || num === 0) return '0 بايت';

  const k = 1024;
  const sizes = ['بايت', 'ك.ب', 'م.ب', 'ج.ب', 'ت.ب'];
  const i = Math.floor(Math.log(num) / Math.log(k));

  return `${parseFloat((num / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDate(isoString?: string): string {
  if (!isoString) return '—';
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return isoString;
  }
}

export function isFolder(mimeType: string): boolean {
  return mimeType === MIME_TYPES.FOLDER;
}

export async function createDriveDocument(
  token: string,
  title: string,
  content: string,
  parentId: string = 'root',
  asGoogleDoc: boolean = true
): Promise<DriveFile> {
  const metadata: any = {
    name: title,
    parents: [parentId],
  };

  let mediaType = 'text/plain; charset=UTF-8';
  let bodyContent = content;

  if (asGoogleDoc) {
    metadata.mimeType = MIME_TYPES.DOCUMENT;
    mediaType = 'text/html; charset=UTF-8';
    if (!content.trim().startsWith('<!DOCTYPE') && !content.trim().startsWith('<html')) {
      bodyContent = `<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>${title}</title><style>body{font-family:sans-serif;line-height:1.6;padding:20px;direction:rtl;}</style></head><body>${content.replace(/\n/g, '<br/>')}</body></html>`;
    }
  } else {
    metadata.mimeType = 'text/plain';
  }

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const encoder = new TextEncoder();
  const contentBytes = encoder.encode(bodyContent);

  let binary = '';
  const len = contentBytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(contentBytes[i]);
  }
  const base64Data = btoa(binary);

  const multipartBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${mediaType}\r\n` +
    'Content-Transfer-Encoding: base64\r\n\r\n' +
    base64Data +
    closeDelimiter;

  const res = await fetch(
    `${DRIVE_UPLOAD_BASE}/files?uploadType=multipart&supportsAllDrives=true&fields=id,name,mimeType,size,modifiedTime,createdTime,webViewLink,webContentLink,iconLink,thumbnailLink`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartBody,
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`تعذر إنشاء المستند: ${res.status} ${err}`);
  }

  return res.json();
}

export async function getDriveFileContent(
  token: string,
  fileId: string,
  mimeType: string
): Promise<string> {
  if (mimeType === MIME_TYPES.DOCUMENT || mimeType.includes('google-apps.document')) {
    const res = await fetch(`${DRIVE_API_BASE}/files/${fileId}/export?mimeType=text/plain`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error(`تعذر قراءة المستند: ${res.status}`);
    }
    return res.text();
  } else {
    const res = await fetch(`${DRIVE_API_BASE}/files/${fileId}?alt=media`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error(`تعذر قراءة محتوى الملف: ${res.status}`);
    }
    return res.text();
  }
}
