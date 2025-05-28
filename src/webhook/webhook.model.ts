export interface WebhookCoreModel {
  id: string;
  tipo: string;
  evento: string;
  agencia: string;
  url: string;
  updatedAt: Date;
  disabledAt?: Date;
}
