export interface WebhookModel {
  id: string;
  tipo: string;
  url: string;
  updatedAt: Date;
  disabledAt?: Date;
}
