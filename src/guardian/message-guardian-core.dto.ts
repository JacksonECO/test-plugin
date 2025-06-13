export interface MessageGuardianCoreDTO {
  topLeft: string;
  topRight: string;
  /**ejdhew */
  headerText?: string;
  title: string;
  titleColor?: 'Default' | 'Dark' | 'Light' | 'Accent' | 'Good' | 'Warning' | 'Attention';
  textDetail?: string;
  info?: Record<string, any>;
  detalhes?: Record<string, any>;
}
