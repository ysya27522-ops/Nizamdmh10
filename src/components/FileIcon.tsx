import {
  FileText,
  FileSpreadsheet,
  Presentation,
  FileCode,
  FileArchive,
  Image,
  Video,
  Music,
  Folder,
  File,
  FileCheck,
} from 'lucide-react';
import { MIME_TYPES } from '../lib/driveApi';

interface FileIconProps {
  mimeType: string;
  className?: string;
  size?: number;
}

export function FileIcon({ mimeType, className = 'w-6 h-6', size }: FileIconProps) {
  const iconProps = { className, size };

  if (mimeType === MIME_TYPES.FOLDER) {
    return <Folder {...iconProps} className={`${className} text-amber-400 fill-amber-400/20`} />;
  }

  if (mimeType === MIME_TYPES.DOCUMENT || mimeType.includes('word') || mimeType.includes('document')) {
    return <FileText {...iconProps} className={`${className} text-blue-400`} />;
  }

  if (mimeType === MIME_TYPES.SPREADSHEET || mimeType.includes('sheet') || mimeType.includes('excel') || mimeType.includes('csv')) {
    return <FileSpreadsheet {...iconProps} className={`${className} text-emerald-400`} />;
  }

  if (mimeType === MIME_TYPES.PRESENTATION || mimeType.includes('presentation') || mimeType.includes('powerpoint')) {
    return <Presentation {...iconProps} className={`${className} text-amber-500`} />;
  }

  if (mimeType === MIME_TYPES.PDF) {
    return <FileCheck {...iconProps} className={`${className} text-rose-500`} />;
  }

  if (mimeType.startsWith('image/')) {
    return <Image {...iconProps} className={`${className} text-purple-400`} />;
  }

  if (mimeType.startsWith('video/')) {
    return <Video {...iconProps} className={`${className} text-pink-500`} />;
  }

  if (mimeType.startsWith('audio/')) {
    return <Music {...iconProps} className={`${className} text-cyan-400`} />;
  }

  if (
    mimeType.includes('zip') ||
    mimeType.includes('tar') ||
    mimeType.includes('rar') ||
    mimeType.includes('compressed') ||
    mimeType.includes('7z')
  ) {
    return <FileArchive {...iconProps} className={`${className} text-yellow-500`} />;
  }

  if (
    mimeType.includes('javascript') ||
    mimeType.includes('json') ||
    mimeType.includes('html') ||
    mimeType.includes('css') ||
    mimeType.includes('typescript')
  ) {
    return <FileCode {...iconProps} className={`${className} text-indigo-400`} />;
  }

  return <File {...iconProps} className={`${className} text-zinc-400`} />;
}
