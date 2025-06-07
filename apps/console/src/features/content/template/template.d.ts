export interface ContentTemplate {
  id?: string;
  name: string;
  description?: string;
  type: 'topic' | 'taxonomy' | 'page' | 'email' | 'custom';
  category?: string;
  template_data: Record<string, any>;
  fields: TemplateField[];
  preview_image?: string;
  is_public: boolean;
  usage_count: number;
  tags?: string[];
  author_id: string;
  tenant_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface TemplateField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'date' | 'image' | 'rich_text' | 'repeater';
  required: boolean;
  default_value?: any;
  options?: TemplateFieldOption[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  description?: string;
  placeholder?: string;
  order: number;
}

export interface TemplateFieldOption {
  label: string;
  value: any;
}

export interface TemplateInstance {
  id?: string;
  template_id: string;
  content_id?: string;
  content_type?: string;
  data: Record<string, any>;
  created_by: string;
  created_at: string;
}
