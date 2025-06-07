export interface ContentVersion {
  id?: string;
  content_id: string;
  content_type: string; // 'topic', 'taxonomy', etc.
  version_number: number;
  title?: string;
  data: Record<string, any>; // Snapshot of content data
  change_summary?: string;
  change_type: 'create' | 'update' | 'delete' | 'publish' | 'unpublish' | 'restore';
  created_by: string;
  created_at: string;
  is_current: boolean;
  parent_version_id?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface ContentRevision {
  id?: string;
  content_id: string;
  content_type: string;
  from_version: number;
  to_version: number;
  changes: ChangeRecord[];
  created_by: string;
  created_at: string;
}

export interface ChangeRecord {
  field: string;
  operation: 'add' | 'remove' | 'modify';
  old_value?: any;
  new_value?: any;
  path?: string; // JSON path for nested changes
}

export interface VersionComparison {
  content_id: string;
  version_a: ContentVersion;
  version_b: ContentVersion;
  differences: FieldDifference[];
}

export interface FieldDifference {
  field: string;
  type: 'added' | 'removed' | 'modified' | 'unchanged';
  old_value?: any;
  new_value?: any;
  path?: string;
}
