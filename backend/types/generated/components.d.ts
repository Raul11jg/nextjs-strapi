import type { Schema, Struct } from '@strapi/strapi';

export interface ComponentLink extends Struct.ComponentSchema {
  collectionName: 'components_component_links';
  info: {
    displayName: 'Link';
    icon: 'link';
  };
  attributes: {
    isExternal: Schema.Attribute.Boolean;
    name: Schema.Attribute.String;
    url: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'#'>;
  };
}

export interface LayoutHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_layout_hero_sections';
  info: {
    displayName: 'Hero Section';
    icon: 'house';
  };
  attributes: {
    headerLink: Schema.Attribute.Component<'component.link', false>;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    subHeader: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'component.link': ComponentLink;
      'layout.hero-section': LayoutHeroSection;
    }
  }
}
